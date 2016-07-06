function displayAbbreviations() {
	if (!document.getElementsByTagName) return false;
	if (!document.createElement) return false;
	if (!document.createTextNode) return false;

	//取得所有缩略词
	var abbreviations = document.getElementsByTagName('abbr');
	if (abbreviations.length < 1) return false;
	
	//遍历缩略词
	var defs = new Array();
	for (var i = 0; i < abbreviations.length; i++) {
		var current_abbr = abbreviations[i];
		var definition = current_abbr.getAttribute("title");
		var key = current_abbr.lastChild.nodeValue;
		defs[key] = definition;
	}

    //创建并遍历定义列表
	var dlist = document.createElement("dl");
	for (key in defs) {
		var definition = defs[key];

		//定义标题
		var dtitle = document.createElement("dt");
		var dtitle_text = document.createTextNode(key);
		dtitle.appendChild(dtitle_text);
		//定义描述
		var ddesc = document.createElement("dd");
		var ddesc_text = document.createTextNode(definition);
		ddesc.appendChild(ddesc_text);
		//添加到定义列表
		dlist.appendChild(dtitle);
		dlist.appendChild(ddesc);
	}
    
    //定义列表标题
	var header = document.createElement("h2");
	var header_text = document.createTextNode("Abbreviations");
	header.appendChild(header_text);
    
    //标题和定义列表添加到body
	var body = document.getElementsByTagName("body")[0];
	body.appendChild(header);
	body.appendChild(dlist);
}

addLoadEvent(displayAbbreviations);





