function createVideoControls() {
  var vids = document.getElementsByTagName('video');
  for (var i = 0; i < vids.length; i++) {
    addControls(vids[i]);
  }
}

function addControls(vid) {
  vid.removeAttribute('controls');

  vid.height = vid.videoHeight;
  vid.width = vid.videoWidth;
  vid.parentNode.style.height = vid.videoHeight + 'px';
  vid.parentNode.style.width = videoWidth + 'px';

  var controls = document.createElement('div');
  controls.setAttribute('class', 'controls');

  var play = document.createElement('button');
}