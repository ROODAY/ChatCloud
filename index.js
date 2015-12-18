var login = require("facebook-chat-api");
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require("socket.io")(http);

Array.prototype.clean = function(deleteValue) {
  for (var i = 0; i < this.length; i++) {
    if (this[i] == deleteValue) {         
      this.splice(i, 1);
      i--;
    }
  }
  return this;
};
var messagetext = []

	

app.use(express.static(__dirname + '/public'));
app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
	socket.on("inputssent", function(email1, password1, threadid, start, end) {
		login({email: email1, password: password1}, function callback (err, api) {
		    if(err) {
		    	console.error(err);
		    	socket.emit("apierror", err);
		    } else {
		    	socket.emit("apiready");
			    var time = new Date().getTime();
			    api.getThreadHistory(parseInt(threadid), parseInt(start), parseInt(end), time, function(err, arr){
			    	messages = arr;
			    	messages.forEach(function(message){
			    		messagetext.push(message.body)
			    	});
			    	messagetext.clean(undefined)
			    	messagetext.clean(null)
			    	var bigtext = messagetext.join(" ");
			    	socket.emit("messagetext", bigtext);
			    });
		    }
		});
	});
});

http.listen((process.env.PORT || 3000), function(){
  console.log('listening on *:3000');
});