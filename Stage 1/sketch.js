// matter.js
var Engine = Matter.Engine;
var World = Matter.World;
var Bodies = Matter.Bodies;

let engine;
let world;
let grounds = [];

let character1;
let character2;
let obstacles = [];

// ml5.js
let handpose;
let detections = [];

let cam;

function setup(){
  createCanvas(640, 480, WEBGL);

  engine = Engine.create();
  world = engine.world;
  grounds.push(new Boundary(0, height/2, 10, height));
  grounds.push(new Boundary(width, height/2, 10, height));
  grounds.push(new Boundary(width/2, 0, width, 10));
  grounds.push(new Boundary(width/2, height, width, 10));
  World.add(world, grounds);

  character1 = new Character(-10, -10, 5);
  character2 = new Character(50, 430, 20);

  cam = createCapture(VIDEO);
  cam.hide();

  const options = {
    flipHorizontal: true, // boolean value for if the video should be flipped, defaults to false
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

  if (obstacles.length < 10) {
    if (frameCount % 50 == 0) obstacles.push(new obstacle(width/2, 80, 40, 40));
  }

  if (detections.length > 0) updateCharacter1();
  updateCharacter2();

  if (obstacles.legnth != 0) {
    for (let obstacle of obstacles) {
      obstacle.show();
    }
  }

  for (let ground of grounds) {
    ground.show();
  }

  character1.show();
  character2.show();

  Engine.update(engine);
}

function updateCharacter1() {
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

    character1.update(avgX, avgY, distance);
  }
}


function keyPressed() {
  if (keyCode == UP_ARROW) {
    Matter.Body.applyForce(character2.body, character2.body.position, {x: 0, y: -0.05});
  }
}

function updateCharacter2() {
  if (keyIsDown(RIGHT_ARROW)) {
    Matter.Body.applyForce(character2.body, character2.body.position, {x: 0.005, y: 0});
  } else if (keyIsDown(LEFT_ARROW)) {
    Matter.Body.applyForce(character2.body, character2.body.position, {x: -0.005, y: 0});
  }
}