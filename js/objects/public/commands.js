var Commands = {
	list: [
		{
			'command' : ['/?','/help'],
			'text'    : '<br/><br/><strong>Esta é a ajuda do chat.</strong><br/><br/>Comandos:<br/><br/><strong>[/smiles,/emoticons,/emotions]</strong> -> Mostra opções de emotions;<br/><strong>[/?,/help]</strong> -> Mostra os comandos; <br/> <strong>[/clear]</strong> -> Limpa a tela;'
		},
		{
			'command' : ['/smiles', '/emoticons', '/emotions'], 
			'action'  : 'list_smiles'
		},
		{
			'command' : ['/clear'],
			'action'  : 'clear'
		},
	],
	admin_name: 'Roboto',
	check: function(message, obj){
		var date;
		for(var i=0; i<Commands.list.length; i++){
			var list_comands = Commands.list[i].command;
			var text = Commands.list[i].text;
			var action = Commands.list[i].action;
			for(var j=0; j<list_comands.length; j++){
				if(Commands.normalize(list_comands[j]) == Commands.normalize(message)){
					if(!action){
						date = Util.getDate();
						obj.append('<p><span class="span-chat date admin">' + date + '</span> <span class="span-chat admin">' + Commands.admin_name + '</span> ' + text + '</p>');
					}
					else{
						if(action == 'clear'){ Commands.clear(obj)}
						if(action == 'list_smiles'){ Commands.list_smiles(obj)}
					}
				}
			}
		}
	},
	clear: function(obj){
		obj.empty();
	},
	list_smiles: function(obj){
		str = "";
		var date = Util.getDate();
		str += '<p><span class="span-chat date admin">' + date + '</span> <span class="span-chat admin">' + Commands.admin_name + '</span> ';
		str += "<br/><br/>"
		var emotions = Emoticons.definition;
		for (name in emotions){
			codes = emotions[name].codes;
			for (i in codes){
				str += " " + codes[i] + " ";
			}
			str += " -> " + Emoticons.replace(codes[0]) + " <br/>";
		}
		obj.append(str);
	},
	normalize: function(text){
		return text.replace(/(\r\n|\n|\r)/gm,"");
	}
}