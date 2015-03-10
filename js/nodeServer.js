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
	admin      : 'Roboto',
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
				var i = NodeServer.allClients.indexOf(client);
				NodeServer.allClients[i].nickname = data.nickname;
				console.log("[" + data.nickname + "] entrou no chat.");
				console.log("Existem" + NodeServer.allClients.length + " pessoa(s) conectadas.");
				NodeServer.io.sockets.emit("welcome", { nickname: NodeServer.admin, message: "<strong>" + data.nickname + "</strong> entrou no chat." });
				NodeServer.io.sockets.emit("info", { nickname: NodeServer.admin, message: "Existem <strong>" + NodeServer.allClients.length + "</strong> pessoa(s) conectadas." });
			});
			client.on("users", function(data){
				var users = [];
				for(var i=0;i<NodeServer.allClients.length; i++){
					users[i] = NodeServer.allClients[i].nickname;
				}
				NodeServer.io.sockets.emit("users", { nickname: data.nickname, nickname_admin: NodeServer.admin, users : users });
			});
			client.on("message", function(data){
				console.log("Message received: " + data.nickname + " : " + data.message + "\n");
				NodeServer.io.sockets.emit("message", { nickname: data.nickname, message: data.message });
			});
			client.on("disconnect", function(){
				var i = NodeServer.allClients.indexOf(client);
				var user_exit = NodeServer.allClients[i].nickname;
				NodeServer.allClients.splice(i, 1);
				NodeServer.io.sockets.emit("info", { nickname: NodeServer.admin, message: "O usuário <strong>" + user_exit + "</strong> saiu do chat." });
				NodeServer.io.sockets.emit("info", { nickname: NodeServer.admin, message: "Existem <strong>" + NodeServer.allClients.length + "</strong> pessoa(s) conectadas." });

			});
		});
		NodeServer.server.listen(NodeServer.port);
	}	
}

NodeServer.init();