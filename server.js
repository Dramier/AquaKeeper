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
var util = require('util'); //Util for formatting output
var bodyParser = require('body-parser'); // parser for post requests
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;  //used for sending POST requests
require('dotenv').config({silent: true});

var port = process.env.PORT || 3000;
var fs = require('fs');

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
  res.sendFile(__dirname + '/public/login.html');
});

app.post('/login', function(req, res){
	//console.log('Request: ' + JSON.stringify(req.body));
	console.log('Authenticating user.');
	if ((req.body.user_name == "Dramier") && (req.body.user_password == "test"))
	{
		console.log('Login accepted.');
		res.sendFile(__dirname + '/public/intro.html');
	}
	else
	{
		console.log('Login denied.');
		//console.log('Username: ' + req.body.user_name);
		//console.log('Password: ' + req.body.user_password);
		res.sendFile(__dirname + '/public/login.html');
	}
});

app.get('/addtank', function(req, res){
  res.sendFile(__dirname + '/public/addtank.html');
});

app.post('/addtank', function(req, res){
	console.log('New Tank received: ');
	console.log(JSON.stringify(req.body));

	var userfile = 'our_tanklist.json';
  
  //open user name file
	fs.appendFile(userfile, JSON.stringify(req.body), (err) => 
	{
		if (err) throw err;
		console.log('Tank data saved');
	});
	
	//send user back to selection menu
	res.sendFile(__dirname + '/public/intro.html');
	
});

app.get('/tanks', function(req, res){
  res.sendFile(__dirname + '/public/tanks.html');
});

app.post('/tanks', function(req, res){
  console.log('Post recieved');
  //console.log(req);
  if (req.body.which_tank == 1)
	  console.log('Tank: 20g Main');
  if (req.body.which_tank == 2)
	  console.log('Tank: Christine Tank');
  if (req.body.which_tank == 3)
	  console.log('Tank: Hatchery');
  //console.log('Element 1: ' + req.body.element_1);
  
  /*
  console.log('Date month: ' + req.body.date_month);
  console.log('Date day: ' + req.body.date_day);
  console.log('Date year: ' + req.body.date_year);
  console.log('Date hour: ' + req.body.date_hour);
  console.log('Date minute: ' + req.body.date_minute);
  console.log('Date second: ' + req.body.date_seconds);
  console.log('Date am/pm: ' + req.body.date_ampm);
  console.log('Ammonia: ' + req.body.tank_ammonia);
  console.log('PH: ' + req.body.tank_ph);
  console.log('GH: ' + req.body.tank_gh);
  console.log('KH: ' + req.body.tank_kh);
  console.log('Nitrite: ' + req.body.tank_nitrite);
  console.log('Nitrate: ' + req.body.tank_nitrate);
  console.log('Temperature: ' + req.body.tank_temp + "F");
  */
	
  //console.log('Rest of req: ');
  //console.log(req.body);
  
  var userfile = 'our_tanks.json';
  
  //open user name file
  fs.appendFile(userfile, JSON.stringify(req.body), (err) => 
  {
	if (err) throw err;
	console.log('Tank data saved');
	});
	
	//send user back to selection menu
	res.sendFile(__dirname + '/public/intro.html');
  
});

	
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
  


http.listen(port, function(){
  console.log('listening on *:' + port);
  errorlogger.log('info', ': listening on *:' + port);
});

module.exports = app;

