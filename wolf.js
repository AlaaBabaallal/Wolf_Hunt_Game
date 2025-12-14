// Classe Wolf : représente le loup contrôlé par le joueur
class Wolf extends Vehicle {

  // Constructeur : initialise le loup à une position donnée
  constructor(x, y) {
    super(x, y);
    this.maxSpeed = 3;   // vitesse maximale du loup
    this.maxForce = 0.35;  // force maximale de direction
    this.size = 46;        // taille utilisée pour collisions
  }

  //Gestion des entrées clavier pour déplacer le loup wasd ou flèches
  handleInput() {
    let dir = createVector(0, 0);

    if (keyIsDown(LEFT_ARROW) || keyIsDown(65))  dir.x -= 1; // A
    if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) dir.x += 1; // D
    if (keyIsDown(UP_ARROW) || keyIsDown(87))    dir.y -= 1; // W
    if (keyIsDown(DOWN_ARROW) || keyIsDown(83))  dir.y += 1; // S

    // Si aucune touche n’est pressée, on ne fait rien
    if (dir.magSq() === 0) return;

    // Normalisation pour garder une vitesse constante
    dir.normalize();
    dir.mult(this.maxSpeed);

    // Calcul de la force de direction (steering)
    let steer = p5.Vector.sub(dir, this.vel);
    steer.limit(this.maxForce);
    this.applyForce(steer);
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
    this.applyForce(steer);
  }

// Affiche le loup à l’écran 
  show() {
    push();
    translate(this.pos.x, this.pos.y);

    // Inversion horizontale si le loup va vers la gauche
    if (this.vel.x < 0) scale(-1, 1);

    if (imgWolf) {
      imageMode(CENTER);
      image(imgWolf, 0, 0, 52, 52);
    } else {
      noStroke();
      fill(90);
      triangle(18, 0, -18, 12, -18, -12);
    }
    pop();
  }
}
