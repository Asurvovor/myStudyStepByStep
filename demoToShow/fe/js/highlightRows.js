function highlightRows(tag) {
	// var jsonData = '{"name":"gafish",type:onmouseover}';
	// var obj= eval('('+ jsonData +')');
	// var over = obj.type;
	
	// alert(typeof over);
	if (!document.getElementsByTagName) return false;
	var rows = document.getElementsByTagName(tag);
	for (var i = 0; i < rows.length; i++) {
		rows[i].onmouseover = function() {
			this.style.fontWeight = "bold";
		}
		rows[i].onmouseout = function() {
			this.style.fontWeight = "normal";
		}
	}
}

addLoadEvent(function() {
	highlightRows("tr");	
});

