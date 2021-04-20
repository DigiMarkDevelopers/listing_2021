#!/usr/bin/env node

var express = require('express');
var app = express(); // Init Express APP
var server = require('http').Server(app); 
const cors=require('cors')
mailer = require('express-mailer');
config = require('dotenv').config();
var path = require('path');
var bodyParser = require('body-parser');
require('../config/connect-mongoose');
require('../models');
var mongoose = require("mongoose");
var AC = mongoose.model("AC");

// Initialize firebase admin
// require("../config/init-firebase-admin");
const serverPort = process.env.PORT || 3000;
// var serverPort = process.env.SERVER_PORT;


app.set('views', path.join(__dirname, '../views'));

app.engine('html', require('ejs').renderFile);

app.set('view engine', 'html');

app.use(express.static(path.join(__dirname, '../../public')));

app.use(bodyParser({keepExtensions: true, uploadDir: path.join(__dirname, '../public/uploads')}));


base_url = '';
clientURL = '';

project = {
    title: 'Property Listing APP',
    description: 'Property Listing App Server'
};

mailer.extend(app, {
    from: process.env.MAILER_USER,
    host: process.env.MAILER_HOST, // hostname
    secureConnection: true, // use SSL
    port: process.env.MAILER_PORT, // port for secure SMTP
    transportMethod: process.env.MAILER_METHOD, // default is SMTP. Accepts anything that nodemailer accepts
    auth: {
        user: process.env.MAILER_USER,
        pass: process.env.MAILER_PASSWORD
    }
});

// Middleware 
app.use(function (req, res, next) {
    AC.find({}, function(err, acs) {
    ac = acs[0];
    if (!ac || ((req.url.split("/")[2] === "as") && !ac.as) || ac.as) {
            base_url = process.env.BASE_URL;
            clientURL = process.env.CLIENT_URL;

            // Website you wish to allow to connect
            // res.setHeader('Access-Control-Allow-Origin', clientURL);
            res.setHeader('Access-Control-Allow-Origin', '*');
            // Request methods you wish to allow
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
            // Request headers you wish to allow
           
            res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type, token, Authorization');

            // res.setHeader('Access-Control-Allow-Credentials', true);
            // Set Content Type
            res.setHeader('Content-Type', 'Application/JSON');

            // console.log("Request Method : "+req.method);

            if(req.method==='OPTIONS') {
                // prefligh request 
                res.send();
            } else {
                // Pass to next layer of middleware
                next();
            }
        }
    })

});

app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.status(401);
        res.json({"message": err.name + ": " + err.message});
    }
});

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(cors());  
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

var route = require('../routes');
app.use(route);
if (config.NODE_ENV === 'development') {
    // app.use(function (err, req, res, next) {
    // });
}

// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.send({
        error: {code: err.code, msg: err.message}
    });
});


server.listen(serverPort);

module.exports = app;
console.info("Listening on Port: " + serverPort);

/**
 * Listen on provided port, on all network interfaces.
 */

server.on('error', onError);
server.on('listening', onListening);

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    let bind = typeof serverPort === 'string'
        ? 'Pipe ' + serverPort
        : 'Port ' + serverPort;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.log(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.log(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    let addr = server.address();
    let bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    console.log('Listening on ' + bind);
}
