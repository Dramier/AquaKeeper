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
require('dotenv').config({silent: true});
io.path('/public');
io.serveClient(true);
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

var errorlogger = new (winston.Logger)({
	level: 'silly',
    transports: [
      new (winston.transports.Console)()
      
    ]
  });


var conlogger = new (winston.Logger)({
	level: 'silly',
    transports: [
      new (winston.transports.Console)()
      
    ]
  });

app.get('/', function(req, res){
  res.sendFile(__dirname + '/public/login.html');
});

/*
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
*/

//io.close();

//need to load in the user database
// Read Synchrously

console.log("\n *START* \n");
var userDatabase = fs.readFileSync("users.json");
console.log("\n Reading in user database... \n");
userDatabase = JSON.parse(userDatabase);
userCount = userDatabase.Users.length;
console.log('Number of users in database: ' + userCount);

io.use(function(socket, next) {
  var handshakeData = socket.request;
  // make sure the handshake data looks good as before
  // if error do this:
    // next(new Error('not authorized'));
  // else just call next
  next();
});

io.on('connection', function(socket){

	
  //************************************************************
  //*******************Variables local to each client connection
  //************************************************************
  //-
  //-
  //-
	var userAuth = false;
	var userFile = null;
	var userData = null;
  
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
  
  socket.on('login', function(msg)
  {
	  //do something
	  conlogger.log('info', 'Socket login: ', socket.client.id);
	  console.log("Received input msg: ");
	  console.log(JSON.stringify(msg));
	  
	  if (userAuth == false)
	  {
		  if ((msg.user_name == 'Dramier') && (msg.user_password == 'test'))
		  {
			  userAuth = true;
			  userFile = msg.user_name + ".tnk";
			  if (fs.existsSync(userFile)) 
			  {
				userData = fs.readFileSync(userFile);
			  }
			  else
			  {
				  fs.writeFile(userFile, '', function (err) 
				  {
						if (err) return console.log(err);
						console.log('Created new user file.');
					});

			  }
			  
			  console.log('Valid user detected!');
			  //http.serveClient(__dirname + '/public/intro.html');
			  socket.emit('move', '/intro.html');
			  
			  //res.sendFile(__dirname + '/public/intro.html');
			  return;
		  }
		  else
		  {
			  //res.sendFile(__dirname + '/public/login.html');
			  return;
		  }
		  
	  }
	  
	  return;
  });
  
  //do not modify this one - it's for copypasta
  socket.on('template', function(msg)
  {
	  //do something
	  console.log("Received input msg: ");
	  console.log(JSON.stringify(msg));
	  
	  
	  
	  return;
  });
  
  socket.on('select', function(msg)
  {
	  //do something
	  console.log("select: Received input msg: ");
	  console.log(JSON.stringify(msg));
	  
	  if (msg.button1 == 1)
	  {
		  //load tanks
	  }
	  if (msg.button2 == 1)
	  {
		  //load fish
	  }
	  if (msg.button3 == 1)
	  {
		  //load add a tank
		  console.log('Sending user to add a tank.');
		  socket.emit('move', 'addtank.html');
	  }
	  if (msg.button4 == 1)
	  {
		  //load add a fish
      }
	  
	  
	  return;
  });
  
  socket.on('addtank', function(msg)
  {
	  //do something
	  conlogger.log('info', 'Socket add tank: ', socket.client.id);
	  console.log("Received input msg: ");
	  console.log(JSON.stringify(msg));
	  
	  console.log('User file: ' + userFile);
	  
	  /*
	  
	  fs.appendFile(userFile, JSON.stringify(msg.body), (err) => 
	{
		if (err) throw err;
		console.log('Tank data saved.');
	});
	  */
	  socket.emit('move', '/intro.html');
	  return;
  });
  
 }); //end of io.connection
  

http.listen(port, function(){
  console.log('listening on *:' + port);
  errorlogger.log('info', ': listening on *:' + port);
});

module.exports = app;

