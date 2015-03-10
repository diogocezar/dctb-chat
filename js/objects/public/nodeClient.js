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
		NodeClient.socket.on('connect', function(){
			NodeClient.socket.emit('chat_connection', {nickname : Chat.nickname});
		});
		NodeClient.socket.on('welcome', function(data){
			NodeClient.save(data.nickname, data.message);
			var date = Util.getDate();
			obj.append('<p><span class="span-chat date admin">' + date + '</span> <span class="span-chat admin">' + data.nickname + '</span> ' + data.message + '</p>');
			document.getElementById('chat-area').scrollTop = document.getElementById('chat-area').scrollHeight;
		});
		NodeClient.socket.on('info', function(data){
			NodeClient.save(data.nickname, data.message);
			var date = Util.getDate();
			obj.append('<p><span class="span-chat date admin">' + date + '</span> <span class="span-chat admin">' + data.nickname + '</span> ' + data.message + '</p>');
			document.getElementById('chat-area').scrollTop = document.getElementById('chat-area').scrollHeight;
		});
		NodeClient.socket.on('message', function(data){
			NodeClient.save(data.nickname, data.message);
			var date = Util.getDate();
			var text = data.message;
			var nickname = data.nickname;
			text = NodeClient.replaces(text);
			text = Emoticons.replaces(text);
			if(!Commands.isCommand(text))
				obj.append('<p><span class="span-chat date">' + date + '</span> <span class="span-chat">' + nickname + '</span> ' + text + '</p>');
			if(nickname == Chat.nickname)
				Commands.check(data.message, obj);
			document.getElementById('chat-area').scrollTop = document.getElementById('chat-area').scrollHeight;

		});
	},
	replaces: function(text){
		var return_text = "";
		return_text = Util.stripTags(text);
		return_text = Util.escapeHtmlEntities(return_text);
		return_text = Util.formatUrl(return_text);
		return return_text;
	},
	save: function(nickname, message){
		$.ajax({
			type: "POST",
		   	url : "chat/send",
		   	data: {  
		   		'nickname' : nickname,
		   		'message'  : message,
		   		'type'     : 'nodejs'
			},
		   	dataType: "json"
		});
	}
}
