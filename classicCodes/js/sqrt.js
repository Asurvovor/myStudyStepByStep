//算术平方根，误差 |r-sart(v)|<= t

function sqrt(v,t) {
  var r = v/2;
  var min = 0, max = v;
  while(!((r-t)*(r-t)<=v && (r+t)*(r+t)>=v)){
      if(r*r<v){min=r;r=(r+max)/2;}
      else {max=r;r=(r+min)/2;}
  }
  return r;
}
