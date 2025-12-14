class Rock extends Obstacle {
  constructor(x, y, r) {
    super(x, y, r);
  }

  show() {
    push();
    translate(this.pos.x, this.pos.y);
    if (imgRock) {
      imageMode(CENTER);
      image(imgRock, 0, 0, this.r * 2, this.r * 2);
    } else {
      noStroke();
      fill(120);
      ellipse(0, 0, this.r * 2, this.r * 2);
      fill(150);
      ellipse(-this.r * 0.3, -this.r * 0.2, this.r * 0.6, this.r * 0.4);
    }
    pop();
  }
}
