<!DOCTYPE html>
<html lang="pt-br">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no">
        <title>Simple Chat</title>
        <link rel="stylesheet" href="css/public/style.css" type="text/css" />
        <link rel="stylesheet" href="css/emoticons/emoticons.css" type="text/css" />
        <link href='http://fonts.googleapis.com/css?family=Roboto:300,400,500,700' rel='stylesheet' type='text/css'>
    </head>
    <body>
        <div id="page-wrap">
            <p id="name-area"></p>
            <div id="chat-wrap">
                <div id="chat-area"></div>
            </div>
        </div>
        <div id="message-wrap">
            <textarea id="chat" maxlength="100"></textarea>
        </div>
        <div id="nick-wrap">
            <div id="box-nick">
                <input type="text" id="nick" placeHolder="Quem é você?" maxlength="20"></div>
            </div>
        </div>
    </body>
    <script src="js/jquery/jquery.js"></script>
    <script src="js/libs/easing/easing.min.js"></script>
    <script src="js/libs/nice.scroll/nice.scroll.min.js"></script>
    <script src="js/libs/mouse.wheel/mouse.wheel.min.js"></script>
    <script src="js/node_modules/socket.io/node_modules/socket.io-client/dist/socket.io.js"></script>
    <script src="js/objects/public/util.js"></script>
    <script src="js/objects/public/emoticons.js"></script>
    <script src="js/objects/public/commands.js"></script>
    <script src="js/objects/public/nodeClient.js"></script>
    <script src="js/objects/public/chat.js"></script>
</html>