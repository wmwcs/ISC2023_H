// Example based on https://www.youtube.com/watch?v=urR596FsU68
// 5.17: Introduction to Matter.js - The Nature of Code
// by @shiffman

// module aliases

var Engine = Matter.Engine,
  //    Render = Matter.Render,
  World = Matter.World,
  MouseConstraint = Matter.MouseConstraint,
  Mouse = Matter.Mouse,
  Bodies = Matter.Bodies;

let engine;
let world;
let boxes = [];
let circles = [];
let grounds = [];
let mConstraint;

let canvas;
let sizes = [5, 10, 20, 30, 40];

function setup() {
  canvas = createCanvas(400, 400);
  engine = Engine.create();
  world = engine.world;
  //  Engine.run(engine);
  grounds.push(new Boundary(0, height / 2, 10, height));
  grounds.push(new Boundary(width, height / 2, 10, height));
  grounds.push(new Boundary(200, 0, width, 10));
  grounds.push(new Boundary(200, height, width, 10));
  World.add(world, grounds);

  let mouse = Mouse.create(canvas.elt);
  mouse.pixelRatio = pixelDensity() // for retina displays etc
  let options = {
    mouse: mouse
  }
  mConstraint = MouseConstraint.create(engine, options);
  World.add(world, mConstraint);
}

let count = 0;
function draw() {
  background(51);
  if (frameCount % 5 === 0) {
    print (++count);
    let size = random(sizes);
    if (random() < 0.5) {
      boxes.push(new Box(width / 2, 80, size, size));
    } else {
      circles.push(new Circle(width / 2, 80, size / 2));
    }
  }
  Engine.update(engine);
  for (let box of boxes) {
    box.show();
  }
  for (let circle of circles) {
    circle.show();
  }
  for (let ground of grounds) {
    ground.show();
  }
}

// function mouseDragged() {
//   let size = random(sizes);
//   if (random() < 0.5) {
//     boxes.push(new Box(mouseX, mouseY, size, size));
//   } else {
//     circles.push(new Circle(mouseX, mouseY, size / 2));
//   }
// }