class Character {
  constructor(x, y, r) {
    let options = {
      friction: 0.3,
      restitution: 0.6
    };
    this.body = Bodies.cir