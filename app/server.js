// server.js

// modules =================================================
var express        = require('express');
var app            = express();
var bodyParser     = require('body-parser');
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
server.listen(port, () => {
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

socket.sockets.on('connection', function(client) {
	
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

    client.on('send message', function (person, data,sendto) {
        //console.log(sendto);
        socket.sockets.emit('new message', {name:person, msg:data,recv:sendto});
    });
	
		
	//PAINT =====================================================================
    // each time a new person connects, send them the old stuff
	client.emit('message', {
		buffer: buffer,
		count: count
	});

    // send a welcome
	client.broadcast.emit('message', {count: count, sessionId: client.sessionId})
			
	// message
	client.on('paint', function(data) {
		
		var msg = {
			circle: data,
			session_id: data.sessionId
		}

		buffer.push(msg)

		if (buffer.length > 1024) buffer.shift();

		client.broadcast.emit('paint', msg);

	});

    client.on('reset', function() {
        client.broadcast.emit('reset');
    });

    client.on('clear', function() {
        buffer = [];
        client.broadcast.emit('clear');
    });
	
	client.on('disconnect', function(data){
		count--;
        client.broadcast.emit('message', {count: count, sessionId: client.sessionId});
    });

    //TEXT =============================================================================

    client.emit('refresh-text', {body: body});
    
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

