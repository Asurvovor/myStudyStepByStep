window.onload = function() {
	var para = document.createElement("p");
	// var info = "nodeName: ";
	// info += para.nodeName;
	// info += " nodeType: ";
	// info += para.nodeType;
	// alert(info);

	var testdiv = document.getElementById("test");

	var txt1 = document.createTextNode("This is ");
	var emphasis = document.createElement("em");
	var txt2 = document.createTextNode("my");
	var txt3 = document.createTextNode(" content.");

	para.appendChild(txt1);
	emphasis.appendChild(txt2);
	para.appendChild(emphasis);
	para.appendChild(txt3);
	testdiv.appendChild(para);
}