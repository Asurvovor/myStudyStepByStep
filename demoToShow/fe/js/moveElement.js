function moveElement(elementID, final_x, final_y, interval) {
  if (!document.getElementById) return false;
  if (!document.getElementById(elementID)) return false;
  var elem = document.getElementById(elementID);
  var xpos = parseInt(elem.style.left);
  var ypos = parseInt(elem.style.top);
  if (xpos == final_x && ypos == final_y) {
    return true;
  }
  if (xpos < final_x) {
    xpos++;
  }
  if (xpos > final_x) {
    xpos--;
  }
  if (ypos < final_y) {
    ypos++;
  }
  if (ypos > final_y) {
    ypos--;
  }
  elem.style.left = xpos + "px";
  elem.style.top = ypos + "px";
  // var repeat = "moveElement('"+elementID+"',"+final_x+","+final_y+","+interval+")";
  //注意上面的单引号，不可缺少，若没有，传参时，字符串合并，elementID的实参会把自带的双引号去掉，成为未定义的变量名
  // movement = setTimeout(repeat, interval);
  movement = setTimeout(function () {
    moveElement(elementID,final_x,final_y,interval);
  },interval)
}