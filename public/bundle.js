document.addEventListener("DOMContentLoaded", function(event) {
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext("2d");
  const client = new WebSocket('ws://' + location.hostname + ':3001/');
  client.binaryType = "arraybuffer";
  client.onmessage = function(msg) {
    var blob = new Blob([msg.data], {type: "image/jpeg"});
    var url = URL.createObjectURL(blob);
    var img = new Image();
    img.onload = function() {
      ctx.drawImage(img, 0, 0);
    };
    img.src = url;
  };
});
