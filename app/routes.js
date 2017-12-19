// app/routes.js

// grab the nerd model
var Nerd = require('./models/nerd');

    module.exports = function(app) {
        
        app.get('/', function(req, res) {
            res.sendfile('./public/views/home.html'); // load our public/index.html file
        });

        app.get('/uidemo', function(req, res) {
            res.sendfile('./public/views/index2.html'); // load our public/index.html file
        });

        app.get('/a2drt', function(req, res){
            res.sendfile('./public/views/index2.html')
        });
        app.get('/demo', function(req, res) {
            res.sendfile('./public/views/viz.html'); // load our public/index.html file
        });

        app.get('/about', function(req, res) {
            res.sendfile('./public/views/about.html'); // load our public/index.html file
        });

        app.get('/media', function (req, res) {
            res.sendfile('./public/views/media.html');
        })


    };