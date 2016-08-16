function addClass(ele, value) {
	if (!ele.className) {
		ele.className = value;
	} else {
		ele.className += (" " + value);
	}
}

