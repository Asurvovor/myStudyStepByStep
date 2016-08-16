function getNextElement(node) {
	if (node.nodeType == 1) {
		return node;
	}
	if (node.nextSibling) {
		return getNextElement(node.nextSibling);
	}
	return null;
}

function styleHeaderSiblings(tag, theclass) {
	if (!document.getElementsByTagName) return false;
	var headers = document.getElementsByTagName(tag);

	for (var i = 0; i < headers.length; i++) {
		var elem = getNextElement(headers[i].nextSibling);
		// elem.style.fontWeight = "bold";
		// elem.style.fontSize = "1.2em";
		addClass(elem, theclass);
	}
}

addLoadEvent(function(){
styleHeaderSiblings("h1", "intro");	
});