/**
*   Chat Node Client
*   Client to connect to node server and return broadcasts
*   Author: Diogo Cezar Teixeira Batista
*   Year: 2015
*/
NodeClient = {
	host   : 'localhost',
	port   : '8080',
	socket : null,
	init : function(){
		NodeClient.socket = io.connect('http://' + NodeClient.host + ':' + NodeClient.port);
	},
	emit : function(obj){
		NodeClient.socket.emit('message', obj);
	},
	on : function(obj){
		NodeClient.socket.on('message', function(data){
			NodeClient.save(data.nickname, data.message);
			var actualContent = obj.html();
			var date = Chat.getDate();
			var newMsgContent = '<p><span class="date">' + date + '</span> <span>' + data.nickname + '</span> ' + data.message + '</p>';
			var content = newMsgContent + actualContent;
			obj.html(content);
		});
	},
	save: function(nickname, message){
		$.ajax({
			type: "POST",
		   	url : "chat/send",
		   	data: {  
		   		'nickname' : nickname,
		   		'message'  : message,
		   		'file'     : 'nodejs'
			},
		   	dataType: "json"
		});
	}
}