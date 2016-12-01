function addLoadEvent(func) {
  var oldload = window.onload;
  if (typeof window.onload != 'function') {
    window.onload = func;
  } else {
    window.onload = function() {
      oldonload();
      func();
    }
  }
}


function insertAfter(newElement,targetElement) {
  var parent = targetElement.parentNode;
  if (parent.lastChild == targetElement) {
    parent.appendCild(newElement);
  } else {
    parent.insertBefore(newElement,targetElement.nextSibling);
  }
}