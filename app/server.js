// server.js

// modules =================================================
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var server = require('http').createServer(app);
var io = require('socket.io');
var socket = io.listen(server);

// configuration ===========================================

// config files
//var db = require('./config/db');

// set our port
const port = process.argv[2] || 8080;

// connect to our mongoDB database 
// (uncomment after you entder in your own credentials in config/db.js)
// mongoose.connect(db.url); 

// get all data/stuff of the body (POST) parameters
// parse application/json 
app.use(bodyParser.json());

// parse application/vnd.api+json as json
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(methodOverride('X-HTTP-Method-Override'));

// set the static files location /public/img will be /img for users
app.use(express.static(__dirname + '/public'));

// routes ==================================================
require('./routes')(app); // configure  routes

// start app ===============================================
// startup our app at http://localhost:8888
var srv = server.listen(port, () => {
    // shoutout to the user                     
    console.log('Server at ' + port);
});




// expose app           
exports = module.exports = app;

//Main Protocol =======================================================================================

// Paint BACKEND ================================================
// states
// for paint
var buffer = [];
var count = 0;

//for chat
var connected = [];
var users = [];

//for text
var body = "CAPSTONE";

var w_clients = [];
var w_count = 0;
var w_users = [];

var closedClientconnection = null;

socket.sockets.on('connection', function (client) {

    var id = w_count++;
    w_clients.push(client);
    client.name = id;
    w_users.push(id);
    //console.log('new Client connected with id : ' + client.name);
    client.send(JSON.stringify({ type: 'yourId', value: client.name }));

    broadcastMessage('insertClient');

    //VIDEO ================================================================

    client.on('message', function (data) {
        var jdata = JSON.parse(data);
        var type = jdata.type;

        switch (type) {
            case 'request': sendToCallee(jdata.SDP, jdata.CALLEE,jdata.CALLER); break;
            case 'response': sendToCaller(jdata.SDP, jdata.CALLER); break;
            case 'candidate': newCandidate(jdata.CANDIDATE, jdata.CALLEE); break;
            case 'disconnectClient': removeClient(jdata.CALL); break;
            case 'ALL': send_msg_all(jdata.sender,jdata.message); break;
            case 'Individual': send_msg_to(jdata.sender,jdata.message,jdata.receiver); break;
            default: break;
        }
    })

    client.on('close', function (reasonCode, description) {
        closedClientconnection = parseInt(client.name);
        w_clients.splice(w_clients.indexOf(client), 1);
        w_users.splice(w_users.indexOf(client.name), 1);
        broadcastMessage('removeClient');
        console.log('client id : ' + client.name + ' has been disconnected');
    })

    //CHAT ================================================================
    count++;
    //PAINT ================================================================
    connected.push(client);
    console.log('connected : %s clients connected', connected.length);

    client.on('disconnect', function (data) {
        connected.splice(connected.indexOf(client), 1);
        users.splice(users.indexOf(client.username), 1);
        updateUserName();
        console.log('Disconnected : %s clients connected', connected.length);
    });

    client.on('user connected', function (data, callback) {
        callback(true);
        client.username = data;
        users.push(client.username);
        updateUserName();
    });

    function updateUserName() {
        socket.sockets.emit('new User', users);
    }

    client.on('send message', function (person, data, sendto) {
        //console.log(sendto);
        socket.sockets.emit('new message', { name: person, msg: data, recv: sendto });
    });


    //PAINT =====================================================================
    // each time a new person connects, send them the old stuff
    client.emit('message', {
        buffer: buffer,
        count: count
    });

    // send a welcome
    client.broadcast.emit('message', { count: count, sessionId: client.sessionId })

    // message
    client.on('paint', function (data) {

        var msg = {
            circle: data,
            session_id: data.sessionId
        }

        buffer.push(msg)

        if (buffer.length > 1024) buffer.shift();

        client.broadcast.emit('paint', msg);

    });

    client.on('reset', function () {
        client.broadcast.emit('reset');
    });

    client.on('clear', function () {
        buffer = [];
        client.broadcast.emit('clear');
    });

    client.on('disconnect', function (data) {
        count--;
        client.broadcast.emit('message', { count: count, sessionId: client.sessionId });
    });

    //TEXT =============================================================================

    client.emit('refresh-text', { body: body });

    client.on('refresh-text', function (body_) {
        console.log('new body');
        body = body_;
    });

    client.on('change-text', function (op) {
        console.log(op);
        if (op.origin == '+input' || op.origin == 'paste' || op.origin == '+delete') {
            client.broadcast.emit('change-text', op);
        };
    });



});

function newCandidate(candidate,callee){
    if(!callee){
        return;
    }
    w_clients[w_users.indexOf(parseInt(callee))].send(JSON.stringify({ type: 'candidate', value: candidate }));
}

function removeClient(call){
    w_clients[w_users.indexOf(parseInt(call))].send(JSON.stringify({ type: 'removeCall'}));
}

function sendToCallee(sdp,callee,caller) {
    var index = w_users.indexOf(parseInt(callee));
    var client = w_clients[index];
    client.send(JSON.stringify({ type: caller, value: sdp }));
}

function sendToCaller(sdp,caller) {
    w_clients[w_users.indexOf(parseInt(caller))].send(JSON.stringify({ type: 'response', value: sdp }));
}

function broadcastMessage(types) {
    for (var i in w_clients) {
        var client = w_clients[i];
        client.send(JSON.stringify({ type: types, value: w_users , client : closedClientconnection}));
    }
    closedClientconnection = null;
}

function send_msg_all(sendBy,msg){
    for (var i in w_clients) {
        var client = w_clients[i];
        if(parseInt(sendBy) !== parseInt(w_users[i]))
            client.send(JSON.stringify({ type: "msg",sender : sendBy,message : msg}));
    }
}

function send_msg_to(sendBy,msg,receiver){
    for (var i in w_clients) {
        var client = w_clients[i];
        if(parseInt(sendBy) !== parseInt(w_users[i]))
            client.send(JSON.stringify({ type: "msg",sender : sendBy,message : msg}));
    }
}