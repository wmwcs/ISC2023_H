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
    // drawLandmarks([0, 1], 0);//palm base
    // drawLandmarks([1, 5], 60);//thumb
    // drawLandmarks([5, 9], 120);//index finger
    // drawLandmarks([9, 13], 180);//middle finger
    // drawLandmarks([13, 17], 240);//ring finger
    // drawLandmarks([17, 21], 300);//pinky

    drawCircle();
  }
}

function drawCircle() {
  fill(255, 0, 0);
  for (let i=0; i<detections.length; i++) {
    let tX = detections[i].landmarks[4][0];
    let tY = detections[i].landmarks[4][1];
  
    let iX = detections[i].landmarks[8][0];
    let iY = detections[i].landmarks[8][1];

    let mX = detections[i].landmarks[12][0];
    let mY = detections[i].landmarks[12][1];

    let rX = detections[i].landmarks[16][0];
    let rY = detections[i].landmarks[16][1];

    let pX = detections[i].landmarks[20][0];
    let pY = detections[i].landmarks[20][1];

    let avgX = (tX + iX + mX + rX + pX) / 5;
    let avgY = (tY + iY + mY + rY + pY) / 5;

    let dt = dist(tX, tY, avgX, avgY);
    let it = dist(iX, iY, avgX, avgY);
    let mt = dist(mX, mY, avgX, avgY);
    let rt = dist(rX, rY, avgX, avgY);
    let pt = dist(pX, pY, avgX, avgY);

    let distance = max(dt, it, mt, rt, pt);

    ellipse(avgX, avgY, distance * 2, distance * 2);
  }
}

function drawLandmarks(indexArray, hue){
    noFill();
    strokeWeight(10);
    for(let i=0; i<detections.length; i++){
      for(let j=indexArray[0]; j<indexArray[1]; j++){
        let x = detections[i].landmarks[j][0];
        let y = detections[i].landmarks[j][1];
        let z = detections[i].landmarks[j][2];
        stroke(hue, 40, 255);
        point(x, y);
      }
    }
  }