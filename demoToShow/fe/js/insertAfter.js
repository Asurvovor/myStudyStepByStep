function insertAfter(newEle, target) {
	var parent = target.parentNode;
	if (parent.lastChild == target) {
		parent.appendChild(newEle);
	} else {
		parent.insertBefore(newEle, target.nextSibling);
	}
}