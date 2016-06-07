const opencv = require('opencv');
const SmileFaceDetector = require('smile-face-detector');
const detector = new SmileFaceDetector();
const camera = new opencv.VideoCapture(0);
const camWidth = 640;
const camHeight = 480;
const camFps = 10;
const camInterval = 1000 / camFps;

camera.setWidth(camWidth);
camera.setHeight(camHeight);
var cameraImage = null;
module.exports = (socket) => {
  detector.on('error', (error) => {
    console.error(error);
  });
  detector.on('face', (faces, image) => {
    console.log(faces);
    faces.forEach((face) => {
      // write rectangle
      image.rectangle([face.x, face.y], [face.width, face.height], SmileFaceDetector.green, 2);
    });
  });
  detector.on('smile', (smiles, face, image) => {
    console.log(smiles);
    smiles.forEach((smile) => {
      image.rectangle([smile.x + face.x, smile.y + face.height/2 + face.y], [smile.width, smile.height], SmileFaceDetector.blue, 2);
    });
  });
  const interval = setInterval(() => {
    if (cameraImage !== null) {
      try {
        socket.send(cameraImage.toBuffer(), {binary: true});
      } catch(e) {
        console.log(e);
      }
    }
    camera.read((err, image) => {
      cameraImage = image;
      detector.detect(cameraImage);
    });
  }, camInterval);
  socket.on('close', () => {clearInterval(interval)});
};
