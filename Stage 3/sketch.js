let handpose;
let detections = [];

let cam;


function setup(){
  createCanvas(640, 480, WEBGL);

  cam = createCapture(VIDEO);

  const options = {
    flipHorizontal: false, // boolean value for if the video should be flipped, defaults to false
    maxContinuousChecks: Infinity, // How many frames to go without running the bounding box detector. Defaults to infinity, but try a lower value if the detector is consistently producing bad predictions.
    detectionConfidence: 0.8, // Threshold for discarding a prediction. Defaults to 0.8.
    scoreThreshold: 0.75, // A threshold for removing multiple (likely duplicate) detections based on a "non-maximum suppression" algorithm. Defaults to 0.75
    iouThreshold: 0.3, // A float representing the threshold for deciding whether boxes overlap too much in non-maximum suppression. Must be between [0, 1]. Defaults to 0.3.
  }

  handpose = ml5.handpose(cam, options, modelReady);
}

function modelReady() {
  console.log("Model ready!");
  handpose.on('predict', results => {
    detections = results;

    // console.log(detections);
  });
}


function draw(){
  background(255);
  translate(-width/2, -height/2);

  if(detections.length > 0){
    rotateRect();
  }
}

function rotateRect() {
  for (let i=0; i<detections.length; i++) {
    pX = detections[i].landmarks[0][0];
    pY = detections[i].landmarks[0][1];

    mX = detections[i].landmarks[12][0];
    mY = detections[i].landmarks[12][1];

    dX = mX - pX;
    dY = mY - pY;

    push();
    translate(pX, pY);
    rotate(atan2(dY, dX));
    rectMode(CENTER);
    rect(0, 0, 100, 100);
    pop();
  }
}
