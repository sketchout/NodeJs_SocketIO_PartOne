# NodeJs_SocketIO_PartOne
Just simple your webChat v 0.0.1

## 0. edit package.json ( Run  npm install )

{

  "_comment" : "0. setup package",
  
  "name":"chat",
  
  "version" : "0.0.1",
  
  "private": "true",
  
  "dependencies" : {
  
    "socket.io" : "1.4.2",
    
    "express" : "4.13.4"
    
  }
  
}

## 1. edit app.js

// SOCKET.IO Setup

var app = require('express')();

var http = require('http').createServer(app);

var io = require('socket.io')(http); //initialise after http server


## 2. http listen in app.js

// http.listen

http.listen(3000, function(err) {

    if ( err ) {
    
        console.log(err);
        
    } else {
    
        console.log('listening on *: 3000')
        
    }
    
} );

## 3. send File (index.html) in app.js

// app.get

app.get('/', function(req, res) {

    // index.html

    res.sendFile(__dirname + '/index.html');
    
});


## 4. edit index.html ( <body></body> <head></head> )

    <!-- 4. definition form -->
    <h3>Just simple your webChat ( v 0.0.1,  @stanwix , 21-Apr-2016 ) </h3>
    <div id="container-id">
        <form id="form-input-userid">
            your ID :  <input size="15" id="input-userid"/>
            <input type="submit" value="Join"/>
        </form>
    </div>
    <div id="container-message" style="display: none;">
        <div id="div-chat-display"></div>
        <form id="form-send-message">
            <input size="35" id="input-message"/>
            <input type="submit" value="Send"/>
        </form>
    </div>
    
    <!-- 4. definition form -->
    <style>
        #div-chat-display {
            height:350px;
            width:500px;
            overflow-x: hidden;
            overflow-y: auto;
        }
    </style>

## 5. include javascript ( in index.html )
    <!-- 5. setup js script -->
    <script src="http://code.jquery.com/jquery-latest.min.js"></script>
    <script src="https://cdn.socket.io/socket.io-1.4.5.js"></script>

## 6. send message to io  ( 8. display message to html )

    <!-- 6. send message function -->
    <script>
        jQuery(function($){

            var socket = io.connect();

            // userid container
            var $useridInputForm = $('#form-input-userid');
            var $useridInput = $('#input-userid');

            // message container
            var $messageSendForm = $('#form-send-message');
            var $messageInput = $('#input-message');
            var $displayChatDiv = $('#div-chat-display');


            $useridInputForm.submit( function(e) {

                e.preventDefault();

                if ( $useridInput.val().length == 0) {

                    alert("Please choose your chat ID...");

                } else {
                    $("#container-id").hide();
                    $("#container-message").show();
                    // $("#hidden-name").val( $useridInput );
                }
            });

            $messageSendForm.submit(function(e) {

                e.preventDefault();

                console.log( "name:" + $useridInput );

                socket.emit('messageSend', { name : $useridInput.val(),
                                            data : $messageInput.val() } );
                $messageInput.val('');
            });

            <!-- 8. io handle -->
            socket.on('messageBroadcast', function(parameters) {

                var name = parameters.name;
                var data = parameters.data;

                $displayChatDiv.append( "["+name+"]" +data + "<br/>");
                // auto scroll
                $('#div-chat-display').scrollTop($('#div-chat-display').prop("scrollHeight"));
            });

        });
    </script>
    
    
## 7. io handle ( in app.js )

// 7. io handle 

io.sockets.on('connection', function(socket) {

    socket.on('messageSend', function(parameters) {

        var name = parameters.name;
   
        var data = parameters.data;

        io.sockets.emit('messageBroadcast', { name:name, data:data } );
   
        // except me
        // socket.broadcast.emit('messageBroadcast',data );

    });
    
});
