/**
*   Chat
*   Literal Object to control chat
*   Author: Diogo Cezar Teixeira Batista
*   Year: 2015
*/
Chat = {
	instanse  : false,
	state     : 0,
	nickname  : null,
	nodejs    : true,
	timeout   : 2000,
	init: function(){
		Chat.getNick();
		Chat.resize();
		Chat.keys();
		Chat.setNiceScroll();
		Chat.getState();
	},
	getChatType: function(){
		if(Chat.nodejs)
			return 'nodejs'
		else
			return 'php';
	},
	setNiceScroll: function(){
		$('#chat-area').niceScroll({
            cursorwidth: '8px',
            zindex: 99999999,
            scrollspeed: 90,
            mousescrollstep: 60,
            cursoropacitymax: 0.8,
            cursorcolor: "#3C3C3C",
            horizrailenabled:false
        });
	},
	getNick: function(){
		$('#nick').focus();
		$("#nick").keydown(function(event) {  
			var key = event.which;  
			if(key >= 33){
				var maxLength = $(this).attr("maxlength");  
				var length    = this.value.length;  
				if(length >= maxLength){  
					event.preventDefault();  
				}  
			}
		});
		$('#nick').keyup(function(e){
			if(e.keyCode == 13){ 
				var text      = $(this).val();
				var maxLength = $(this).attr("maxlength");  
				var length    = text.length;
				if (length <= maxLength + 1){ 
					Chat.nickname = $(this).val();
					$('#nick-wrap').fadeOut();
					$('#chat').focus();
					if(Chat.nodejs){
						NodeClient.init();
						NodeClient.on($('#chat-area'));
					}
				}
				else{
					$(this).val(text.substring(0, maxLength));
				}	
			}	
		});
	},
	keys: function(){
		$("#chat").keydown(function(event) {  
			var key = event.which;  
			if(key >= 33){
				var maxLength = $(this).attr("maxlength");  
				var length    = this.value.length;  
				if(length >= maxLength){  
					event.preventDefault();  
				}  
			}
		});
		$('#chat').keyup(function(e){
			if(e.keyCode == 13){ 
				var text      = $(this).val();
				var maxLength = $(this).attr("maxlength");  
				var length    = text.length;
				if (length <= maxLength + 1){ 
					Chat.send(text, name);
					$(this).val("");
				}
				else{
					$(this).val(text.substring(0, maxLength));
				}	
			}	
		});
	},
	resize: function(){
		var height = $(window).height();
		$("#chat-area").css('height', (height - 180) + 'px');
	},
	getState: function(){
		if(!Chat.instanse){
			Chat.instanse = true;
		 	$.ajax({
				type: "POST",
				url : "chat/getState",
			   	data: {  
			   		'type' : Chat.getChatType(),
				},
			   	dataType: "json",
			   	success: function(data){
				   Chat.state    = data.state;
				   Chat.instanse = false;
				   Chat.history();
			   	},
			});
		}	 
	},
	history: function(){
		if(!Chat.instanse){
			Chat.instanse = true;
	     	$.ajax({
				type: "POST",
			   	url : "chat/getHistory",
			   	data: {  
			   		'state'    : Chat.state,
			   		'type'     : Chat.getChatType()
				},
			   	dataType: "json",
			   	success: function(data){
			   		var newMsgs = false;
			   		var obj     = $('#chat-area');
					if(data.text){
						for(var i = 0; i < data.text.length; i++){
                        	obj.append($("<p>"+ Emoticons.replaces(data.text[i]) + "</p>"));
                        }								  
				   	}
				   	document.getElementById('chat-area').scrollTop = document.getElementById('chat-area').scrollHeight;
				   	Chat.instanse = false;
			   	},
			});
	 	}
	},
	update: function(){
		if(!Chat.nodejs){
			if(!Chat.instanse){
				Chat.instanse = true;
		     	$.ajax({
					type: "POST",
				   	url : "chat/update",
				   	data: {
						'state'    : Chat.state
					},
				   	dataType: "json",
				   	success: function(data){
				   		var newMsgs = false;
				   		var obj     = $('#chat-area');
						if(data.text){
							for(var i = 0; i < data.text.length; i++) {
								newMsgs = true;
								text = data.text[i];
	                        	var index_cut = text.lastIndexOf('</span>');
	                        	var only_text = text.slice(index_cut+7, text.length-1);
	                        	var index_cut_nick = text.lastIndexOf('<span class="span-chat">');
	                        	var aux = text.slice(index_cut_nick+24, text.length-1);
	                        	var only_nick = aux.slice(0, aux.indexOf('</span>'))
								if(!Commands.isCommand(only_text))
	                        		obj.append($("<p>" + Emoticons.replaces(data.text[i]) + "</p>"));
	                        	if(only_nick == Chat.nickname)
									Commands.check(only_text, obj);
	                        }								  
					   	}
					   	if(newMsgs)
					   		document.getElementById('chat-area').scrollTop = document.getElementById('chat-area').scrollHeight;
					   	Chat.instanse = false;
					   	Chat.state    = data.state;
				   	},
				});
		 	}
		}
	},
	send: function(message, nickname){
		Chat.update();
		if(!Chat.nodejs){
	    	$.ajax({
				type: "POST",
			   	url : "chat/send",
			   	data: {  
						'message'  : message,
						'nickname' : Chat.nickname,
				},
			   	dataType: "json",
			   	success: function(data){
					Chat.update();
			   	},
			});
    	}
    	else{
    		NodeClient.emit({
    			'message'  : message,
    			'nickname' : Chat.nickname
    		})
    	}
	}
}

$(window).resize(function() {
	Chat.resize();
});

$(document).ready(function() {
	Chat.init();
	if(!Chat.nodejs)
		setInterval(function() { Chat.update() }, Chat.timeout);
});
