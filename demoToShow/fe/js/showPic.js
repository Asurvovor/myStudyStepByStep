function preparePlaceholder() {
	var placeholder = document.createElement("img");
	placeholder.setAttribute("id", "placeholder");
	placeholder.setAttribute("src", "../img/placeholder.gif");
	placeholder.setAttribute("alt", "my image gallery");


	var description = document.createElement("p");
	description.setAttribute("id", "description");
	var desctext = document.createTextNode("Choose an image");
	
	description.appendChild(desctext);

	document.getElementsByTagName('body')[0].appendChild(placeholder);
	document.getElementsByTagName('body')[0].appendChild(description);

	var gallery = document.getElementById("imagegallery");

}

function insertAfter(newElement, targetElement) {
	var parent = targetElement.parentNode;
	if (parent.lastChild == targetElement) {
		parent.appendChild(newElement);
	} else {
		parent.insertBefore(newElement, targetElement.nextSibling);
	}
}

function prepareGallery() {
	if (!document.getElementById) return false;
	if (!document.getElementsByName) return false;
	if (!document.getElementById("imagegallery")) return false;

	var gallery = document.getElementById("imagegallery");
	var links = gallery.getElementsByTagName("a");
	
	for (var i = 0; i < links.length; i++) {
		links[i].onclick = function () {
			return !showPic(this);
		}
		// links[i].onkeypress = links[i].onclick;
	}
}

function showPic(whichpic){
	if (!document.getElementById('placeholder')) return false;
	var source = whichpic.getAttribute("href");
	var placeholder = document.getElementById("placeholder");
	if (placeholder.nodeName != 'IMG') return false;
	placeholder.setAttribute("src",source);
	// placeholder.src = source;
	
	if (document.getElementById('description')) {
		
		var text = whichpic.getAttribute("title") ? whichpic.getAttribute("title") : "";
		var description = document.getElementById("description");
		if (description.firstChild.nodeType == 3){
			// alert(description.firstChild.nodeValue);
			description.firstChild.nodeValue = text;
		}
	}
	return true;
}

function countBodyChildren() {
	var body_element = document.getElementsByTagName("body")[0];
	// alert(body_element.childNodes.length);
	// alert(body_element.nodeType);
}

// window.onload = function() {
// 	countBodyChildren();
// 	prepareGallery();
// }
function addLoadEvent(func) {
	var oldonload = window.onload;
	if (typeof window.onload != 'function') {
		window.onload = func;
	} else {
		window.onload = function() {
			oldonload();
			func();
		}
	}
}

addLoadEvent(countBodyChildren);
addLoadEvent(prepareGallery);
addLoadEvent(preparePlaceholder);
