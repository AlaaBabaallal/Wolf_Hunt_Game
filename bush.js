class Bush extends Obstacle {
  constructor(x, y, r) {
    super(x, y, r);
  }

  show() {
    push();
    translate(this.pos.x, this.pos.y);
    if (imgBush) {
      imageMode(CENTER);
      image(imgBush, 0, 0, this.r * 2.4, this.r * 2.4);
    } else {
      noStroke();
      fill(20, 100, 20);
      ellipse(0, 0, this.r * 2.2, this.r * 2.2);
      fill(30, 140, 30);
      ellipse(this.r * 0.3, -this.r * 0.2, this.r * 1.4, this.r * 1.4);
    }
    pop();
  }
}