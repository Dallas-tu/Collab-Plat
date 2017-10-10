// app/routes.js

// grab the nerd model
var Nerd = require('./models/nerd');

    module.exports = function(app) {
        // route to handle creating goes here (app.post)
        // route to handle delete goes here (app.delete)

        // frontend routes =========================================================
        // route to handle all angular requests
        app.get('/', function(req, res) {
            res.sendfile('./public/views/index.html'); // load our public/index.html file
        });

        app.get('/demo', function(req, res) {
            res.sendfile('./public/views/viz.html'); // load our public/index.html file
        });

    };