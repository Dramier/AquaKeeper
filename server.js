/**
 * 
 *  Aqua Keeper 
 * 
 *  Version: 0.02
 *  9/19/2017 05:02pm
 */


var express = require('express'); // app server
var app = require('express')();
var winston = require('winston');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var util = require('util'); //Util for formatting output
var bodyParser = require('body-parser'); // parser for post requests
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;  //used for sending POST requests
io.path('/public');
io.serveClient(true);
require('dotenv').config({silent: true});

var port = process.env.PORT || 3000;

//************************************************************
//*******************Local libraries**************************
//************************************************************
//-
//-
//-
//var updateMessage = require('./libs/updateMessage.js');
//var userAuthenticate = require('./libs/userAuthenticate.js');

//-
//-
//-

//************************************************************
//*******************Local libraries**************************
//************************************************************


//************************************************************
//*******************Variables used globally******************
//************************************************************
//-
//-
//-



//-
//-
//-
//************************************************************
//*******************Variables used globally******************
//************************************************************


app.use(express.static('./public')); // load UI from public folder
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded





//setup the loggers
var date = new Date();
var logfilename = date.getFullYear() + "-" + date.getMonth() + "-" + date.getDay() + "-" + "debug.log";


var errorlogger = new (winston.Logger)({
	level: 'silly',
    transports: [
      new (winston.transports.Console)(),
      new (winston.transports.File)({ filename: logfilename })
    ]
  });

var confilename = date.getFullYear() + "-" + date.getMonth() + "-" + date.getDay() + "-" + "convos.log";  
var conlogger = new (winston.Logger)({
	level: 'silly',
    transports: [
      new (winston.transports.Console)(),
      new (winston.transports.File)({ filename: confilename })
    ]
  });

app.get('/', function(req, res){
  res.sendFile(__dirname + '/public/form.html');
});


io.close();

io.on('connection', function(socket){
	
  //************************************************************
  //*******************Variables local to each client connection
  //************************************************************
  //-
  //-
  //-

  
  //-
  //-
  //-
  //************************************************************
  //*******************Variables local to each client connection
  //************************************************************
  
  socket.on('reconnect_attempt', function(){
    errorlogger.log('info', 'user reconnected');
  });
  
  socket.on('connect', function(){
    errorlogger.log('info', 'new user connected');
	errorlogger.log('info', 'socket: ' + socket.client.id);
	conlogger.log('info', 'Socket connected: ', socket.client.id);
  });
  
  socket.on('disconnect', function(){
    conlogger.log('info', 'Socket disconnected: ', socket.client.id);
  });
  
  socket.on('chat message', function(msg)
  {
	conlogger.log('info', ': Socket#', socket.client.id, ': Received message: ');//, msg);
	//-
	//-
	//Parse the incoming message for use by Watson
	
	//Password Authentication
	//-
	//-
	
  }); //end of socket

}); //end of io.connection


http.listen(port, function(){
  console.log('listening on *:' + port);
  errorlogger.log('info', ': listening on *:' + port);
});

module.exports = app;

