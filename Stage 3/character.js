class Character {
  constructor(x, y, r) {
    let options = {
      friction: 0.3,
      restitution: 0.6
    };
    this.body = Bodies.circle(x, y, r, options);
    this.r = r;
    World.add(world, this.body);
  }

  update(x, y, r) {
    World.remove(world, this.body);
    let options = {
      friction: 0.3,
      restitution: 0.6
    };
    this.body = Bodies.circle(x, y, r, options);
    this.r = r;
    World.add(world, this.body);
  }

  show() {
    let pos = this.body.position;
    let angle = this.body.angle;

    push();
    translate(pos.x, pos.y);
    rotate(angle);
    rectMode(CENTER);
    strokeWeight(1);
    stroke(255);
    fill(255, 0, 0);
    ellipse(0, 0, this.r * 2);
    pop();
  }
}