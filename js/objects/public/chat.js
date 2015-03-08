/**
*   Chat
*   Literal Object to control chat
*   Author: Diogo Cezar Teixeira Batista
*   Year: 2015
*/
Chat = {
	instanse : false,
	state    : 0,
	nick     : null,
	init: function(){
		Chat.getState();
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
	     	$.ajax({
				type: "POST",
			   	url : "chat/getHistory",
			   	data: {  
			   		'state'    : Chat.state
				},
			   	dataType: "json",
			   	success: function(data){
					if(data.text){
						for(var i = 0; i < data.text.length; i++) {
                        	$('#chat-area').append($("<p>"+ data.text[i] +"</p>"));
                        }								  
				   	}
				   	document.getElementById('chat-area').scrollTop = document.getElementById('chat-area').scrollHeight;
				   	Chat.instanse = false;
			   	},
			});
	 	}
	},
	update: function(){
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
					if(data.text){
						for(var i = 0; i < data.text.length; i++) {
							newMsgs = true;
                        	$('#chat-area').append($("<p>"+ data.text[i] +"</p>"));
                        }								  
				   	}
				   	if(newMsgs)
				   		document.getElementById('chat-area').scrollTop = document.getElementById('chat-area').scrollHeight;
				   	Chat.instanse = false;
				   	Chat.state    = data.state;
			   	},
			});
	 	}
	 	else{
			setTimeout(Chat.update, 1500);
	 	}
	},
	send: function(message, nickname){
		Chat.update();
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
}

$(window).resize(function() {
	Chat.resize();
});

$(document).ready(function() {
	Chat.init();
	setInterval(function() { Chat.update() }, 2000);
});