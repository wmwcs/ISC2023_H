// matter.js
var Engine = Matter.Engine;
var World = Matter.World;
var Bodies = Matter.Bodies;

let engine;
let world;
let grounds = [];

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

  character2 = new Character(0, 0, 20);

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

  if(detections.length > 0){
    calculateAngle();
  }

  World.remove(world, grounds);
  grounds = [];

  push();
  translate(width/2, height/2);
  rotate(angle);
  grounds.push(new Boundary(-width/2, 0, 10, height));
  grounds.push(new Boundary(width/2, 0, 10, height));
  grounds.push(new Boundary(0, -height/2, width, 10));
  grounds.push(new Boundary(0, height/2, width, 10));
  World.add(world, grounds);

  engine.world.gravity.x = cos(-angle + 0.5*PI);
  engine.world.gravity.y = sin(-angle + 0.5*PI);

  for (let ground of grounds) {
    ground.show();
  }
  
  if (obstacles.length < 10) {
    if (frameCount % 50 == 0) obstacles.push(new obstacle(0, 0, 40, 40));
  }

  if (obstacles.legnth != 0) {
    for (let obstacle of obstacles) {
      obstacle.show();
    }
  }

  updateCharacter2();
  character2.show();

  Engine.update(engine);
  pop();
}

let angle;
function calculateAngle() {
  for (let i=0; i<detections.length; i++) {
    pX = detections[i].landmarks[0][0];
    pY = detections[i].landmarks[0][1];

    mX = detections[i].landmarks[12][0];
    mY = detections[i].landmarks[12][1];

    dX = mX - pX;
    dY = mY - pY;

    angle = atan2(dY, dX) + 0.5*PI;
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
