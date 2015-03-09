/**
*   Chat
*   Literal Object to control chat
*   Author: Diogo Cezar Teixeira Batista
*   Year: 2015
*/
Chat = {
	instanse  : false,
	state     : 0,
	nick      : null,
	nodejs    : false,
	timeout   : 2000,
	init: function(){
		if(!Chat.nodejs){
			Chat.getState();
		}
		else{
			NodeClient.init();
			NodeClient.on($('#chat-area'));
		}
		Chat.getNick();
		Chat.resize();
		Chat.keys();
		Chat.setNiceScroll();
	},
	setNiceScroll: function(){
		$('#chat-area').niceScroll(
        {
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
					Chat.nick = $(this).val();
					$('#nick-wrap').fadeOut();
					$('#chat').focus();
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
			var file = "php";
			if(Chat.nodejs)
				file = "nodejs"
	     	$.ajax({
				type: "POST",
			   	url : "chat/getHistory",
			   	data: {  
			   		'state'    : Chat.state,
			   		'file'     : file
				},
			   	dataType: "json",
			   	success: function(data){
			   		var newMsgs = false;
			   		var obj     = $('#chat-area');
					if(data.text){
						for(var i = 0; i < data.text.length; i++){
                        	obj.append($("<p>"+ Emoticons.replace(data.text[i]) + "</p>"));
                        }								  
				   	}
				   	if(newMsgs)
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
	                        	obj.append($("<p>" + Emoticons.replace(data.text[i]) + "</p>"));
	                        	var index_cut = text.lastIndexOf('</span>');
	                        	var only_text = text.slice(index_cut+7, text.length-1);
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
						'nickname' : Chat.nick,
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
    			'nickname' : Chat.nick
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
