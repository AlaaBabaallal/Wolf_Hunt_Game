// variables d'images utilisées dans le jeu
let imgDog;
let imgWolf;
let imgSheep;
let imgRock;
let imgBush;
let imgGrass;
let imgBarn;
let imgMenuBg;

// objets du jeu
let dog;
let wolf;
let sheepFlock = [];
let obstacles = [];

// zones de jeu
let pen;       
let playArea;  

// état du jeu : menu, playing, gameover (lost), done (win)
let gameState = "menu"; 
let startBtn = { x: 0, y: 0, w: 0, h: 0 };

// constantes de jeu ( Total moutons de debut et compteur de moutons mangés )
let TOTAL_SHEEP = 10;
let eatenCount = 0;

// Chargement des images avant le démarrage du jeu
function preload() {
  imgDog   = loadImage("assets/dog.png");
  imgWolf  = loadImage("assets/wolf.png"); 
  imgSheep = loadImage("assets/sheep.png");
  imgRock  = loadImage("assets/rock.png");
  imgBush  = loadImage("assets/bush.png");
  imgGrass = loadImage("assets/grass.jpg");
  imgBarn  = loadImage("assets/barn.png");
  imgMenuBg = loadImage("assets/shepherd.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  setupPlayArea();
  initGameObjects();
}

function setupPlayArea() {
  const marginX = width * 0.08;
  const marginY = height * 0.08;

  playArea = {
    x: marginX,
    y: marginY,
    w: width - 2 * marginX,
    h: height - 2 * marginY
  };

// Grange (pen) : carré dans le coin inférieur droit
  const penSize = min(playArea.w, playArea.h) * 0.25;
  pen = {
    x: playArea.x + playArea.w - penSize - 20,
    y: playArea.y + playArea.h - penSize - 20,
    w: penSize,
    h: penSize
  };
}

function initGameObjects() {
  sheepFlock = [];
  obstacles = [];
  eatenCount = 0;

  // Joueur : le loup (controlé par le joueur au clavier)
  wolf = new Wolf(playArea.x + playArea.w * 0.25, playArea.y + playArea.h * 0.65);

  // Chien de berger (IA) 
  dog = new Dog(playArea.x + playArea.w * 0.70, playArea.y + playArea.h * 0.35);

  // Moutons (IA)
let spawnMargin = 60;
let spawnWidth  = playArea.w * 0.25;  
let spawnHeight = playArea.h * 0.25;  

// Génération des moutons dans la zone de spawn 
for (let i = 0; i < TOTAL_SHEEP; i++) {
  let x = random(
    playArea.x + spawnMargin,
    playArea.x + spawnWidth
  );

  let y = random(
    playArea.y + spawnMargin,
    playArea.y + spawnHeight
  );

  sheepFlock.push(new Sheep(x, y));
}

  // Generation des obstacles
  obstacles.push(new Rock(playArea.x + playArea.w * 0.40, playArea.y + playArea.h * 0.50, 50));
  obstacles.push(new Bush(playArea.x + playArea.w * 0.62, playArea.y + playArea.h * 0.58, 80));
  obstacles.push(new Rock(playArea.x + playArea.w * 0.12, playArea.y + playArea.h * 0.18, 55));
  obstacles.push(new Bush(playArea.x + playArea.w * 0.58, playArea.y + playArea.h * 0.12, 45));
  obstacles.push(new Rock(playArea.x + playArea.w * 0.88, playArea.y + playArea.h * 0.18, 55));
  obstacles.push(new Rock(playArea.x + playArea.w * 0.18, playArea.y + playArea.h * 0.72, 50));

}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  setupPlayArea();
}

// Boucle principale de dessin du jeu 
function draw() {
  background(15, 60, 30);

  if (gameState === "menu") {
    drawMenu();
    return;
  }

  drawGrass();
  drawPlayArea();
  drawPen();

  // obstacles
  for (let obs of obstacles) obs.show();

  // compteurs de moutons mangés et sauvés 
  let savedCount = sheepFlock.filter(s => s.saved).length;

  if (gameState === "playing") {
    // loup contrôlé par le joueur
    wolf.handleInput();
    wolf.avoidObstacles(obstacles);
    wolf.update();
    keepInBounds(wolf);
    wolf.show();

    // chien de berger (IA)
    dog.behave(wolf, obstacles);
    dog.update();
    keepInBounds(dog);
    dog.show();

    // Si chien attrape le loup => game over
    if (circleHit(wolf.pos, wolf.size * 0.45, dog.pos, dog.size * 0.45)) {
      gameState = "gameover";
    }

    // moutons (IA)
    for (let sh of sheepFlock) {
      sh.behave(wolf, obstacles, pen);
      sh.update();
      keepInBounds(sh);
      sh.show();

      // Loup mange le mouton s’il y a contact avant qu’il n’est pas déjà sauvé dans la grange
      if (!sh.eaten && !sh.saved) {
        if (circleHit(wolf.pos, wolf.size * 0.45, sh.pos, sh.size * 0.5)) {
          sh.eaten = true;
          eatenCount += 1;
        }
      }
    }

    savedCount = sheepFlock.filter(s => s.saved).length;

    // Fin du jeu si tous les moutons sont soit mangés soit sauvés ( done )
    if (eatenCount + savedCount === TOTAL_SHEEP) {
      gameState = "done";
    }
  } else {
    // les objets restent affichés à la fin du jeu
    wolf.show();
    dog.show();
    for (let sh of sheepFlock) sh.show();
  }

  drawHUD(savedCount);

  if (gameState === "gameover") {
    drawCenterText("GAME OVER\nThe dog caught the wolf!");
  }
  if (gameState === "done") {
    drawCenterText(`END!\nScore (sheep eaten): ${eatenCount}`);
  }
}

// Dessine l’écran de menu avec le bouton Start
function drawMenu() {
  background(10, 50, 25);

  if (imgMenuBg) {
    imageMode(CENTER);

    let targetW = width * 0.92;
    let targetH = (imgMenuBg.height / imgMenuBg.width) * targetW;

    if (targetH > height * 0.85) {
      targetH = height * 0.85;
      targetW = (imgMenuBg.width / imgMenuBg.height) * targetH;
    }

    image(imgMenuBg, width / 2, height / 2, targetW, targetH);
  }

  noStroke();
  fill(0, 0, 0, 90);
  rect(0, 0, width, height);

  textAlign(CENTER, CENTER);

  const titleW = min(520, width * 0.7);
  const titleH = 70;
  const titleX = width / 2 - titleW / 2;
  const titleY = height * 0.12;

  // Ombre titre
  fill(0, 0, 0, 120);
  rect(titleX + 4, titleY + 4, titleW, titleH, 18);

  // Fond titre
  fill(20, 20, 20, 170);
  rect(titleX, titleY, titleW, titleH, 18);

  // Texte du titre
  fill(255, 240, 120);
  textSize(42);
  text("🐺 Wolf vs Shepherd 🐕", width / 2, titleY + titleH / 2);

  const boxW = min(460, width * 0.6); // ⬅️ largeur réduite
  const boxH = 220;
  const boxX = width / 2 - boxW / 2;
  const boxY = titleY + titleH + 26;

  // Fond description
  fill(0, 0, 0, 150);
  rect(boxX, boxY, boxW, boxH, 16);

  // Texte description
  fill(255);
  textAlign(CENTER, TOP);
  textSize(17);

// Description du jeu
  const msg =
`Vous incarnez le loup.
Votre objectif est de dévorer un maximum de moutons
avant qu’ils ne trouvent refuge dans la grange.

Mais attention…
Un chien de berger rôde et vous traque sans relâche.
S’il vous attrape, la partie est terminée.`;

  text(msg, width / 2, boxY + 20);

  // Bouton Start
  startBtn.w = 240;
  startBtn.h = 58;
  startBtn.x = width / 2 - startBtn.w / 2;
  startBtn.y = boxY + boxH + 26;

  // Ombre bouton
  fill(0, 0, 0, 100);
  rect(startBtn.x + 4, startBtn.y + 4, startBtn.w, startBtn.h, 14);

  // Hover
  let hover =
    mouseX >= startBtn.x && mouseX <= startBtn.x + startBtn.w &&
    mouseY >= startBtn.y && mouseY <= startBtn.y + startBtn.h;

  fill(hover ? color(255, 245, 150) : color(250, 230, 90));
  stroke(90);
  strokeWeight(2);
  rect(startBtn.x, startBtn.y, startBtn.w, startBtn.h, 14);

  // Texte bouton
  noStroke();
  fill(40);
  textAlign(CENTER, CENTER);
  textSize(24);
  text("Start", width / 2, startBtn.y + startBtn.h / 2);
}

// Gestion des clics de souris pour démarrer ou redémarrer le jeu
function mousePressed() {
  if (gameState === "menu") {
    if (
      mouseX >= startBtn.x && mouseX <= startBtn.x + startBtn.w &&
      mouseY >= startBtn.y && mouseY <= startBtn.y + startBtn.h
    ) {
      gameState = "playing";
      initGameObjects();
    }
  } else if (gameState === "gameover" || gameState === "done") {
    // cliquer pour retourner au menu
    gameState = "menu";
  }
}

function drawGrass() {
  if (imgGrass) {
    imageMode(CORNER);
    image(imgGrass, playArea.x, playArea.y, playArea.w, playArea.h);
  } else {
    noStroke();
    fill(40, 120, 50);
    rect(playArea.x, playArea.y, playArea.w, playArea.h);
  }
}

function drawPlayArea() {
  noFill();
  stroke(10, 40, 10);
  strokeWeight(8);
  rect(playArea.x, playArea.y, playArea.w, playArea.h, 16);
}

function drawPen() {
  if (imgBarn) {
    imageMode(CORNER);
    image(imgBarn, pen.x, pen.y, pen.w, pen.h);
  }
  noFill();
  stroke(255, 255, 0);
  strokeWeight(3);
  rect(pen.x, pen.y, pen.w, pen.h);
}

function drawHUD(savedCount) {
  const remaining = TOTAL_SHEEP - (eatenCount + savedCount);

  const x = playArea.x + 14;
  const y = playArea.y + 12;

  // Smaller sizes
  const w = 170;
  const h = 10;
  const gap = 16;       
  const titleGap = 18;  

  // Panel background
  push();
  noStroke();
  fill(0, 0, 0, 110);
  rect(x - 10, y - 10, w + 20, titleGap + 3 * (h + gap) + 8, 10);

  // Gauges
  drawGauge(x, y + titleGap,                 w, h, eatenCount, TOTAL_SHEEP, "🐺 Eaten");
  drawGauge(x, y + titleGap + (h + gap),     w, h, savedCount, TOTAL_SHEEP, "🐑 In barn");
  drawGauge(x, y + titleGap + 2*(h + gap),   w, h, remaining,  TOTAL_SHEEP, "⏳ Remaining");

  pop();
}


// Generic gauge drawer
function drawGauge(x, y, w, h, value, maxValue, label) {
  const pct = maxValue > 0 ? constrain(value / maxValue, 0, 1) : 0;

  // Label
  fill(255);
  noStroke();
  textAlign(LEFT, BOTTOM);
  textSize(11);
  text(label, x, y - 3);

  // Numbers
  textAlign(RIGHT, BOTTOM);
  text(`${value}/${maxValue}`, x + w, y - 3);

  // Background bar
  noStroke();
  fill(255, 255, 255, 70);
  rect(x, y, w, h, 6);

  // Filled bar
  fill(255, 220, 90, 220);
  rect(x, y, w * pct, h, 6);

  // Subtle highlight (optional polish)
  fill(255, 255, 255, 40);
  rect(x + 2, y + 2, (w * pct) - 4, h * 0.3, 6);
}



function drawCenterText(msg) {
  fill(255, 230, 80);
  stroke(0);
  strokeWeight(3);
  textAlign(CENTER, CENTER);
  textSize(38);
  text(msg, width / 2, height / 2);
}

// Empêche un objet de sortir de la zone de jeu
function keepInBounds(agent) {
  if (agent instanceof Sheep && agent.saved) return;

  agent.pos.x = constrain(agent.pos.x, playArea.x, playArea.x + playArea.w);
  agent.pos.y = constrain(agent.pos.y, playArea.y, playArea.y + playArea.h);
}

function circleHit(p1, r1, p2, r2) {
  return p5.Vector.dist(p1, p2) <= (r1 + r2);
}
