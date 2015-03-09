/**
*   Chat Node Server
*   Server literal object to start nodejs server
*   Author: Diogo Cezar Teixeira Batista
*   Year: 2015
*/
NodeServer = {
	port    : '8080',
	socket  : require('socket.io'),
	express : require('express'),
	http    : require('http'),
	app     : null,
	server  : null,
	io      : null,
	init : function(){
		NodeServer.app    = NodeServer.express();
		NodeServer.server = NodeServer.http.createServer(NodeServer.app);
		NodeServer.io     = NodeServer.socket.listen(NodeServer.server);
		NodeServer.go();
	},
	go : function(){
		NodeServer.io.sockets.on('connection', function(client){
			console.log("New client connected." + "\n");
			client.on("message", function(data){
				console.log("Message received: " + data.nickname + " : " + data.message + "\n");
				NodeServer.io.sockets.emit("message", { nickname: data.nickname, message: data.message });
				//client.broadcast.emit( 'message', { nickname: data.nickname, message: data.message } );
			});
		});
		NodeServer.server.listen(NodeServer.port);
	}	
}

NodeServer.init();