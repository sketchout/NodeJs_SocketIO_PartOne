// ----
// 1. server set
// ---
// SOCKET.IO Setup
var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http); //initialise after http server
var port = process.env.PORT || 3000;

var nickNamesArray =[];
// ----
// 2. http listen
// ---

http.listen(port, function(err) {
    if ( err ) {
        console.log(err);
    } else {
        console.log('listening on *: %d', port);
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

    var address = socket.conn.remoteAddress;;
    console.log('New connection from : ' + address );

    // cmd 
    socket.on('reqJoinRoom', function(data,callback) {

        //console.log('cmdNewUser  data ' + data );

        // check exist nickNamesArray
        if ( nickNamesArray.indexOf(data) != -1 ) {

            callback(false);

        } else {

            var address = socket.conn.remoteAddress;;
            console.log('New connection from : ' + address );

            callback(true);
            // store data
            socket.nickname = data;
            noticeUserJoin(data, address );

            nickNamesArray.push(socket.nickname);
            updateNickNames();
        }

    });

    // function
    function noticeUserJoin(nickname, address) {
        io.sockets.emit('cmdUserJoin', {nickname:nickname, address:address} );
    }
    function noticeUserLeave(nickname, address) {
        io.sockets.emit('cmdUserLeave', {nickname:nickname, address:address} );
    }
    // function
    function updateNickNames() {
        io.sockets.emit('cmdUserNames', nickNamesArray);
    }

    socket.on('messageSend', function(parameters) {

        var name = parameters.name;
        var data = parameters.data;

        io.sockets.emit('messageBroadcast', { name:name, data:data } );

        // except me
        // socket.broadcast.emit('messageBroadcast',data );

    });

    socket.on('disconnect', function(data) {

        if ( ! socket.nickname ) return;

        var nick = socket.nickname;
        var address = socket.conn.remoteAddress;;

        console.log('disconnected from : ' + address +"("+ nick+")" );

        noticeUserLeave(nick, address );

        nickNamesArray.splice( nickNamesArray.indexOf(nick), 1 );
        // update
        updateNickNames();


    });

});
