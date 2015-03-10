/**
*   Chat Node Server
*   Server literal object to start nodejs server
*   Author: Diogo Cezar Teixeira Batista
*   Year: 2015
*/
NodeServer = {
	port       : '8080',
	socket     : require('socket.io'),
	express    : require('express'),
	http       : require('http'),
	app        : null,
	server     : null,
	io         : null,
	allClients : [],
	init : function(){
		NodeServer.app    = NodeServer.express();
		NodeServer.server = NodeServer.http.createServer(NodeServer.app);
		NodeServer.io     = NodeServer.socket.listen(NodeServer.server);
		NodeServer.go();
	},
	go : function(){
		NodeServer.io.sockets.on('connection', function(client){
			NodeServer.allClients.push(client);
			client.on("chat_connection", function(data){
				console.log("[" + data.nickname + "] entrou no chat.");
				console.log("Existem " + NodeServer.allClients.length + " pessoa(s) conectadas");
				NodeServer.io.sockets.emit("welcome", { nickname: data.nickname, message: "Entrou no chat." });
				NodeServer.io.sockets.emit("info", { nickname: "Roboto", message: "Existem " + NodeServer.allClients.length + " pessoa(s) conectadas." });
			});
			client.on("message", function(data){
				console.log("Message received: " + data.nickname + " : " + data.message + "\n");
				NodeServer.io.sockets.emit("message", { nickname: data.nickname, message: data.message });
				//client.broadcast.emit( 'message', { nickname: data.nickname, message: data.message } );
			});
			client.on("disconnect", function(){
				var i = NodeServer.allClients.indexOf(client);
				NodeServer.allClients.splice(i, 1);
				NodeServer.io.sockets.emit("info", { nickname: "Roboto", message: "Existem " + NodeServer.allClients.length + " pessoa(s) conectadas." });
			});
		});
		NodeServer.server.listen(NodeServer.port);
	}	
}

NodeServer.init();