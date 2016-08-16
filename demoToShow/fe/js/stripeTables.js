function stripeTables(theclass) {
	if (!document.getElementsByTagName) return false;
	var tables = document.getElementsByTagName("table");

	for (var i = 0; i < tables.length; i++) {
		var odd = false;
		var rows = tables[i].getElementsByTagName("tr");
		for (var j = 0; j < rows.length; j++) {
			if (odd == true) {
				// rows[j].style.backgroundColor = "#ffc";
				// alert(rows[j]);
				addClass(rows[j], theclass);

				odd = false;
			} else {
				odd = true;
			}
		}
	}
}
addLoadEvent(function(){
	stripeTables("odd");	
});