// ----
// 1. server set
// ---
// SOCKET.IO Setup
var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http); //initialise after http server

// ----
// 2. http listen
// ---

http.listen(3000, function(err) {
    if ( err ) {
        console.log(err);
    } else {
        console.log('listening on *: 3000')
    }
} );

// ----
// 3. send File
// ---

// http req , res
app.get('/', function(req, res) {

    // index.html
    // res.sendfile is deprecated...
    //res.sendfile(__dirname + '/index.html');
    //
    res.sendFile(__dirname + '/index.html');
});

// ----
// 7. io handle
// ---
io.sockets.on('connection', function(socket) {



    socket.on('messageSend', function(parameters) {

        var name = parameters.name;
        var data = parameters.data;

        io.sockets.emit('messageBroadcast', { name:name, data:data } );
        // except me
        // socket.broadcast.emit('messageBroadcast',data );

    });
});
