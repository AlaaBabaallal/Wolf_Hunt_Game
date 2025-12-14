// Classe Sheep : représente un mouton (Comportement IA)
class Sheep extends Vehicle {

  // Constructeur : initialise un mouton
  constructor(x, y) {
    super(x, y);
    this.maxSpeed = 1.2;   // vitesse lente du mouton
    this.maxForce = 0.16;  // faible réactivité
    this.size = 26;

    this.saved = false; // mouton arrivé dans la grange
    this.eaten = false; // mouton mangé par le loup
  }

// Comportement du mouton : arrive à la grange (arrive), fuit le loup (flee), évite les obstacles (avoidObstacles)
  behave(wolf, obstacles, pen) {
    if (this.eaten) return;

    // Si le mouton est déjà dans la grange
    if (this.saved || this.isInPen(pen)) {
      this.saved = true;
      this.stayInsidePen(pen);
      return;
    }

    let total = createVector(0, 0);

    // Force d’arrivée vers le centre de la grange
    let center = createVector(pen.x + pen.w / 2, pen.y + pen.h / 2);
    let arriveF = (this.arrive ? this.arrive(center) : this.seek(center));
    arriveF.mult(1.1);
    total.add(arriveF);

    // Fuite du loup
    total.add(this.fleeWolf(wolf));

    // Évitement des obstacles
    total.add(this.avoidObstacles(obstacles));

    total.limit(this.maxForce * 3);
    this.applyForce(total);
  }

// Fuite du loup avec intensité variable selon la distance si le mouton est proche du loup la vitesse de fuite augmente
  fleeWolf(wolf) {
    let threatDist = 320;
    let contactDist = 28;
    let d = p5.Vector.dist(this.pos, wolf.pos);

    if (d < threatDist) {
      let f = this.flee(wolf.pos);
      let intensity = map(d, contactDist, threatDist, 3.2, 0.7, true);
      f.mult(intensity);
      return f;
    }
    return createVector(0, 0);
  }

// Évite les obstacles en appliquant une force de répulsion lorsqu’ils sont trop proches
  avoidObstacles(obstacles) {
    let steer = createVector(0, 0);
    for (let obs of obstacles) {
      let dir = p5.Vector.sub(this.pos, obs.pos);
      let dist = dir.mag();
      let safeDist = obs.r + 28;
      if (dist < safeDist) {
        dir.setMag(map(dist, 0, safeDist, 2, 0));
        steer.add(dir);
      }
    }
    return steer;
  }

// Vérifie si le mouton est dans la grange 
  isInPen(pen) {
    return (
      this.pos.x > pen.x &&
      this.pos.x < pen.x + pen.w &&
      this.pos.y > pen.y &&
      this.pos.y < pen.y + pen.h
    );
  }

// Maintient le mouton à l’intérieur de la grange une fois qu’il y est entré pour éviter qu’il ne ressorte pas chez le loup 
  stayInsidePen(pen) {
    const m = 5;
    this.vel.mult(0);
    this.acc.mult(0);
    this.pos.x = constrain(this.pos.x, pen.x + m, pen.x + pen.w - m);
    this.pos.y = constrain(this.pos.y, pen.y + m, pen.y + pen.h - m);
  }

// Affiche le mouton à l’écran
  show() {
    if (this.eaten) return;

    push();
    translate(this.pos.x, this.pos.y);

    if (imgSheep) {
      imageMode(CENTER);
      image(imgSheep, 0, 0, 28, 28);
    } else {
      noStroke();
      fill(255);
      ellipse(0, 0, 18, 18);
      fill(200);
      ellipse(6, -4, 10, 8);
    }

    pop();
  }
}
