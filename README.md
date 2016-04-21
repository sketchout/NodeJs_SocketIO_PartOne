# NodeJs_SocketIO_PartOne 


## Just simple your webChat v 0.0.1

> This is a simple web chat through nodeJS & socket.io.
> 이 예제는 간단하게 웹채팅을 nodeJS와 socket.io를 통해서 구현했다.

New things
> This added some features from orginal. First can select a userid and message can scroll, but can't not delete message.
> 이 예제는 원래자료를 참고해서 수정이 되었다. 첫째로 유저아이디를 선택하고, 메시지는 화면 스크롤이되지만, 메시지를 화면내에서 
> 삭제하지는 않는다.

## 0. edit package.json ( Run  npm install )
```javascript
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
```
## 1. edit app.js
```javascript
// SOCKET.IO Setup
var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http); //initialise after http server
```

## 2. http listen in app.js
```javascript
// http.listen
http.listen(3000, function(err) {
    if ( err ) {
        console.log(err);
    } else {
        console.log('listening on *: 3000')
    }
} );
```

## 3. send File (index.html) in app.js
```javascript
// app.get
app.get('/', function(req, res) {
    // index.html
    res.sendFile(__dirname + '/index.html');
  
});
```
## 4. edit index.html 
```html 
<head>
    <!-- 4. definition form -->
    <style>
        #div-chat-display {
            height:350px;
            width:500px;
            overflow-x: hidden;
            overflow-y: auto;
        }
    </style>
</head> 
<body> 
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
</body> 
``` 

## 5. include javascript ( in index.html )
```html
    <!-- 5. setup js script -->
    <script src="http://code.jquery.com/jquery-latest.min.js"></script>
    <script src="https://cdn.socket.io/socket.io-1.4.5.js"></script>
```

## 6. send message to io  ( 8. display message to html )
```javascript    
    <!-- 6. send message function -->
    <script>
        jQuery(function($){
            // io connect to server
            var socket = io.connect();
            // userid container
            var $useridInputForm = $('#form-input-userid');
            var $useridInput = $('#input-userid');

            // message container
            var $messageSendForm = $('#form-send-message');
            var $messageInput = $('#input-message');
            var $displayChatDiv = $('#div-chat-display');
            
            // get userid
            $useridInputForm.submit( function(e) {
                e.preventDefault();
                if ( $useridInput.val().length == 0) {
                    alert("Please choose your chat ID...");
                } else {
                    $("#container-id").hide();
                    $("#container-message").show();
                }
            });
            // send message to server
            $messageSendForm.submit(function(e) {
                e.preventDefault();
                socket.emit('messageSend', { name : $useridInput.val(),
                                            data : $messageInput.val() } );
                $messageInput.val('');
            });
            <!-- 8. io handle and display message -->
            socket.on('messageBroadcast', function(parameters) {
                var name = parameters.name;
                var data = parameters.data;
                $displayChatDiv.append( "["+name+"]" +data + "<br/>");
                // auto scroll down
                $('#div-chat-display').scrollTop($('#div-chat-display').prop("scrollHeight"));
            });
        });
    </script>
```    
    
## 7. io handle ( in app.js )

```javascript
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
```

## Run Screenshot

1. before Chat: 

![alt text]( https://github.com/sketchout/NodeJs_SocketIO_PartOne/blob/master/beforeChat.PNG "input userid")

2. on Chat: 

![alt text]( https://github.com/sketchout/NodeJs_SocketIO_PartOne/blob/master/onChat.PNG "send message")

## Thanks to
> [Smitha Milli]( https://www.youtube.com/watch?v=pNKNYLv2BpQ ) 
> Create a basic chat application using node.js, socket.io, and express by the end of this video. 

