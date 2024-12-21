let player;
let startScreen;
let selectStageScreen;

//Variables para entidades
let bullets = [];
let enemies = [];
let enemyBullets = [];
let enemySpawnInterval = 60; // Spawn rate enemigos

//Variables de imagenes
let enemyImages = [];
let playerImage;
let bulletImage;
let enemyBulletImage;
let backgroundImage;

//Variables para manejo de niveles
let killCount = 0;
let stage = 1;
let initialStage = 1;
let score = 0;
let stages = ["Stage 1", "Stage 2", "Stage 3", "Stage 4", "Stage 5"];

//Variables de estado
let gameState = "start"; // Estados posibles: 'start', 'playing', 'paused', stageSelect
let selectedStage = 0;
let musicMuted = false;

//Variables de musica
let music;
let menu_music;
let started = false;
let menuMusicStarted = false;

//Sidebar
const sideBarWidth = 150;

let frameCount = 0;

function preload() {
  //Cargar cancion
  soundFormats("mp3");
  music = loadSound("assets/sounds/music.mp3");
  menu_music = loadSound("assets/sounds/menu_music.mp3");

  //Image loading
  playerImage = loadImage("assets/img/player.png");
  bulletImage = loadImage("assets/img/bullet.png");
  backgroundImage = loadImage("assets/img/background.png");
  menuImage = loadImage("assets/img/menu.png");
  enemyBulletImage = loadImage("assets/img/enemyBullet.png");
  enemyImages.push(loadImage("assets/img/enemy1.png"));
  enemyImages.push(loadImage("assets/img/enemy2.png"));
  enemyImages.push(loadImage("assets/img/enemy3.png"));
  enemyImages.push(loadImage("assets/img/enemy4.png"));

  //Font loading
  arcadeFont = loadFont("./assets/PressStart2P-Regular.ttf");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  player = new Player(playerImage);
  startScreen = new StartScreen(menuImage, arcadeFont);
}

function draw() {
  background(backgroundImage);
  //actaliza constantemente la selectedStage
  selectStageScreen = new SelectStageScreen(
    arcadeFont,
    stages,
    selectedStage,
    backgroundImage
  );
  if (gameState === "start") {
    startScreen.show();
    if (!menuMusicStarted) {
      menu_music.loop();
      menuMusicStarted = true;
    }
  } else if (gameState === "stageSelect") {
    selectStageScreen.show();
  } else if (gameState === "playing") {
    menu_music.stop();
    tint(160, 255);
    noTint();

    drawSidebar();

    //Iniciar musica
    if (keyIsPressed === true && !started) {
      music.loop();
      started = true;
    }

    bulletHandle();
    enemyHandle();
    enemyBulletHandle();
    player.update();
    player.show();

    updateStage();
  }
}

//Menu lateral
function drawSidebar() {
  fill(50);
  rect(width - sideBarWidth, 0, 200, height);
  fill(255);
  textSize(16);
  textAlign(LEFT, TOP);
  text(`Health: ${player.health}`, width - sideBarWidth + 10, 20);
  text(`Score: ${score}`, width - sideBarWidth + 10, 50);
  text(`Stage: ${stage}`, width - sideBarWidth + 10, 80);
  text(`Defeated: ${killCount}`, width - sideBarWidth + 10, 110);
  // Add more stats as needed
}

//Actualizar y eliminar las balas del jugador
//Para eliminar --> Agregar a un nuevo arreglo, iterarlo posteriormente y borrar todas las balas que se encuentran en él
function bulletHandle() {
  let bulletsToRemove = [];

  //Si hay colisión con enemigo, eliminar la bala
  for (let i = bullets.length - 1; i >= 0; i--) {
    if (bullets[i].collision()) {
      continue;
    }

    bullets[i].update();

    //Eliminar cuando estan fuera de pantalla
    if (bullets[i].y < -50 || bullets[i].x > width - sideBarWidth) {
      bulletsToRemove.push(i);
      continue;
    }
    bullets[i].show();
  }

  for (let i of bulletsToRemove) {
    bullets.splice(i, 1);
  }

  for (let bullet of bullets) {
    bullet.update();
    bullet.show();
  }
}

//Crear, actualizar y eliminar enemigos si se salen de la pantalla
function enemyHandle() {
  for (let i = enemies.length - 1; i >= 0; i--) {
    enemies[i].update();
    if (enemies[i].y > height + 50) {
      enemies.splice(i, 1);
      continue;
    }
    enemies[i].show();
  }

  //Crea enemigos cada cierto tiempo (enemySpawnInterval)
  frameCount++;
  if (frameCount % enemySpawnInterval === 0) {
    ///Definicion de niveles (cambiar posiblemente)----------------------
    if (stage == 1) {
      enemies.push(
        new Enemy( //Propiedades del nuevo enemigo
          random(width - sideBarWidth - 30), //Posicion x
          0, //Posicion y
          random(enemyImages), //Sprite
          "aimed", //Tipo de disparo
          "straight"
        ) //Tipo de movimiento
      );
    } else if (stage == 2) {
      enemies.push(
        new Enemy( //Propiedades del nuevo enemigo
          random(width - sideBarWidth - 30), //Posicion x
          0, //Posicion y
          random(enemyImages), //Sprite
          random(["aimed", "spread"]), //Tipo de disparo
          random(["sine", "straight", "standing"]) //Tipo de movimiento
        )
      );
    } else if (stage == 3) {
      enemies.push(
        new Enemy( //Propiedades del nuevo enemigo
          random(width - sideBarWidth - 30), //Posicion x
          0, //Posicion y
          random(enemyImages), //Sprite
          random(["aimed", "spread", "circular"]), //Tipo de disparo
          random(["sine", "straight", "zigzag", "standing"]) //Tipo de movimiento
        )
      );
    } else if (stage >= 4) {
      enemies.push(
        new Enemy( //Propiedades del nuevo enemigo
          random(width - sideBarWidth - 30), //Posicion x
          0, //Posicion y
          random(enemyImages), //Sprite
          random(["aimed", "spread", "circular", "line"]), //Tipo de disparo
          random(["sine", "straight", "zigzag", "standing", "horizontal"]) //Tipo de movimiento
        )
      );
      if (stage == 5) {
        enemySpawnInterval = 30;
      }
    }
    ////-----------------------------------------------------------------
  }
}

//Actualiza y elimina las balas de los enemigos
function enemyBulletHandle() {
  for (let i = enemyBullets.length - 1; i >= 0; i--) {
    enemyBullets[i].update();
    if (
      enemyBullets[i].y > height + 50 ||
      enemyBullets[i].y < -50 ||
      enemyBullets[i].x > width - sideBarWidth
    ) {
      enemyBullets.splice(i, 1);
      continue;
    }
    enemyBullets[i].show();
  }
}

function updateStage() {
  if (killCount % 50 === 0) {
    stage = initialStage + killCount / 50;
  }
}

function restart() {
  bullets = [];
  enemies = [];
  enemyBullets = [];
  stage = 0;
  score = 0;
  killCount = 0;
  player.health = 5;
  frameCount = 0;

  loop();
}

function keyPressed() {
  if (keyCode === ENTER && gameState === "start") {
    gameState = "stageSelect";
  } else if (gameState == "stageSelect") {
    if (keyCode === UP_ARROW) {
      selectedStage = (selectedStage - 1 + stages.length) % stages.length; //Para que no se salga de los limites
    } else if (keyCode === DOWN_ARROW) {
      selectedStage = (selectedStage + 1) % stages.length;
    } else if (keyCode === ENTER) {
      stage = selectedStage + 1;
      initialStage = stage;
      console.log(stage);
      gameState = "playing";
    }
  }
  if (key === "r") {
    restart();
  }
}
