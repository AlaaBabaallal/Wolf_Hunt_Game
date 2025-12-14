// Classe Dog : représente le chien de berger (Comportement IA)
class Dog extends Vehicle {

  // Constructeur : initialise le chien
  constructor(x, y) {
    super(x, y);
    this.maxSpeed = 2.5;   // vitesse du chien
    this.maxForce = 0.28;  // force de direction
    this.size = 44;        // taille pour collision
  }

// Comportement du chien : poursuite du loup (seek) et évitement des obstacles (avoidObstacles) avec un wander léger
  behave(wolf, obstacles) {
    this.wander();

    // Force de poursuite du loup
    let seekF = this.seek(wolf.pos);
    seekF.mult(1.3);
    this.applyForce(seekF);

    // Évitement des obstacles
    let avoidF = this.avoidObstacles(obstacles);
    avoidF.mult(1.8);
    this.applyForce(avoidF);
  }

// Évite les obstacles en appliquant une force de répulsion lorsqu’ils sont trop proches
  avoidObstacles(obstacles) {
    let steer = createVector(0, 0);

    for (let obs of obstacles) {
      let dir = p5.Vector.sub(this.pos, obs.pos);
      let dist = dir.mag();
      let safeDist = obs.r + 40;

      if (dist < safeDist) {
        dir.setMag(map(dist, 0, safeDist, 3, 0));
        steer.add(dir);
      }
    }

    steer.limit(this.maxForce * 2);
    return steer;
  }

// Affiche le chien à l’écran
  show() {
    push();
    translate(this.pos.x, this.pos.y);

    if (this.vel.x < 0) scale(-1, 1);

    if (imgDog) {
      imageMode(CENTER);
      image(imgDog, 0, 0, 48, 48);
    } else {
      noStroke();
      fill(50, 200, 255);
      triangle(15, 0, -15, 10, -15, -10);
    }
    pop();
  }
}
