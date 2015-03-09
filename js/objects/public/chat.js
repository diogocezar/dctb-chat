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
	nodejs   : false,
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
	},
	getDate: function(date){
    	var d = new Date(date || Date.now()),
        	month = '' + (d.getMonth() + 1),
        	day = '' + d.getDate(),
        	year = d.getFullYear();
        	hour = '' + d.getHours();
        	min  = '' + d.getMinutes();
        	sec  = '' + d.getSeconds();

    	if (month.length < 2) month = '0' + month;
    	if (day.length < 2) day = '0' + day;
    	if (hour.length < 2) hour = '0' + hour;
    	if (min.length < 2) min = '0' + min;
    	if (sec.length < 2) sec = '0' + sec; 

    	return [day, month, year].join('/') + ' ' + [hour, min, sec].join(':');
	}
}

$(window).resize(function() {
	Chat.resize();
});

$(document).ready(function() {
	Chat.init();
	if(!Chat.nodejs)
		setInterval(function() { Chat.update() }, 2000);
});