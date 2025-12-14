class Obstacle {
  constructor(x, y, r = 30) {
    this.pos = createVector(x, y);
    this.r = r;
  }

  show() {
    push();
    noFill();
    stroke(255, 0, 0);
    strokeWeight(1.5);
    ellipse(this.pos.x, this.pos.y, this.r * 2);
    pop();
  }
}



