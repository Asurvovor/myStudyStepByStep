function positionMessage() {
  if (!document.getElementById) return false;
  if (!document.getElementById('message')) return false;
  var elem = document.getElementById('message');
  elem.style.position = "absolute";
  elem.style.left = "50px";
  elem.style.top = "100px";
  moveElement("message", 200, 100, 10);
  var elem2 = document.getElementById('2');
  elem2.style.position = "absolute";
  elem2.style.left = "100px";
  elem2.style.top = "200px";
  moveElement("2", 200, 100, 10)
}

addLoadEvent(positionMessage);
