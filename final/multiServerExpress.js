var express = require('express')
, app = express()
, server = require('http').createServer(app)
, socketio = require('socket.io');

var portnum = process.argv[2] || 3000; // Get portnum from the command line if it is there, otherwise use 3000 as default
 
// Use www as the "root" directory for all requests.
// if no path is given, it will look for index.html in that directoy.
app.use(express.static('www'));

// Start the server listening on a port 
server.listen(portnum, function(){
	console.log ("server listening on port " + portnum);
});

let connectCounter = 0;
let serverMessage = `There's more than one of you here, say hi!`;
//let playerArray = [];

// When we get a connection, 
socketio.listen(server).on('connection', function (socket) {
    connectCounter++;
    console.log("Number of connected clients: " + connectCounter);

    socket.emit('message', {'datatype': 'playerCounter', 'data': connectCounter});

    if (connectCounter > 1){
        socket.emit('message', {'datatype': 'serverMessage', 'data': serverMessage});
        socket.broadcast.emit('message', {'datatype': 'serverMessage', 'data': serverMessage});
    };

    socket.on('message', function(msg){
    	socket.broadcast.emit('message', msg);
        /*if (msg.datatype === "username"){
            playerArray[connectCounter-1] = msg.data
            console.log(playerArray)
        };
        if (msg.datatype === "disconnect"){
            var index = playerArray.indexOf(msg.data);
                if (index >= 0) {
                    delete playerArray[index];
                };
            console.log(playerArray)
        };*/
    });

    socket.on('disconnect', function(){
    	connectCounter--;
    	console.log("Number of connected clients: " + connectCounter);
    });
});