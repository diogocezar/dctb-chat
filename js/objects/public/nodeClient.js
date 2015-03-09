/**
*   Chat Node Client
*   Client to connect to node server and return broadcasts
*   Author: Diogo Cezar Teixeira Batista
*   Year: 2015
*/
NodeClient = {
	host   : '11.1.1.40',
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
			var date = Util.getDate();
			obj.append('<p><span class="span-chat date">' + date + '</span> <span class="span-chat">' + data.nickname + '</span> ' + Emoticons.replace(data.message) + '</p>');
			Commands.check(data.message, obj);
			document.getElementById('chat-area').scrollTop = document.getElementById('chat-area').scrollHeight;

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
