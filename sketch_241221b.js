let player;
let startScreen;
let selectStageScreen;
let pauseMenuScreen;
let lowPassFilter;
let deathScreen;

//Variables para entidades
let bullets = [];
let enemies = [];
let enemyBullets = [];
let enemySpawnInterval = 5; // Spawn rate enemigos

//Variables de imagenes
let enemyImages = [];
let stageImages = [];
let playerImage;
let bulletImage;
let enemyBulletImage;
let backgroundImage;

//Variables para manejo de niveles
let killCount = 0;
let stage = 0;
let initialStage = 1;
let score = 0;
let lastKillCount = 0; // Ultima killcount con la que se actualizo el stage
let pauseMenuIndex = 0;
let deathIndex = 0;

//Variables de estado
let gameState = "start"; // Estados posibles: 'start', 'playing', 'paused', stageSelect
let selectedStage = 0;
let musicMuted = false;
let isStopped = false;

//Variables de musica
let music;
let menu_music;
let started = false;
let menuMusicStarted = false;

//Sidebar
const sideBarWidth = 100;

let frameCount = 0;

function preload() {
  //Cargar cancion
  soundFormats("mp3");
  music = loadSound("assets/sounds/music.mp3");
  menu_music = loadSound("assets/sounds/menu_music.mp3");
  select_sound = loadSound("assets/sounds/select.mp3");
  confirm_sound = loadSound("assets/sounds/confirm.mp3");
  success_sound = loadSound("assets/sounds/success.mp3");

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

  stageImages.push(loadImage("assets/img/stage1.png"));
  stageImages.push(loadImage("assets/img/stage2.png"));
  stageImages.push(loadImage("assets/img/stage3.png"));
  stageImages.push(loadImage("assets/img/stage4.png"));
  stageImages.push(loadImage("assets/img/stage5.png"));
  //Font loading
  arcadeFont = loadFont("./assets/PressStart2P-Regular.ttf");

  setUpStages((stageImages = stageImages));
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  player = new Player(playerImage, gameState);
  startScreen = new StartScreen(menuImage, arcadeFont);
  select_sound.setVolume(1.0);
  confirm_sound.setVolume(1.0);
  menu_music.setVolume(0.4);
  music.setVolume(0.1);

  // Crear un filtro de agua para menu de pausa
  lowPassFilter = new p5.LowPass();
  music.disconnect();
  music.connect(lowPassFilter);
}

function draw() {
  background(stages[stage].stageBackground);
  //actaliza constantemente la selectedStage
  selectStageScreen = new SelectStageScreen(
    arcadeFont,
    stages.map((stage) => stage.name),
    selectedStage,
    stageImages
  );
  pauseMenuScreen = new PauseMenu(arcadeFont, pauseMenuIndex);
  deathScreen = new DeathScreen(arcadeFont, deathIndex);
  if (gameState === "start") {
    music.stop();
    started = false;
    startScreen.show();
    if (!menuMusicStarted) {
      menu_music.loop();
      menuMusicStarted = true;
    }
  } else if (gameState === "stageSelect") {
    music.stop();
    started = false;
    if (!menuMusicStarted) {
      menu_music.loop();
      menuMusicStarted = true;
    }
    selectStageScreen.show();
  } else if (gameState === "paused") {
    lowPassFilter.freq(1000); // Aplicar filtro de agua
    pauseMenuScreen.show();
  } else if (gameState === "death") {
    lowPassFilter.freq(1000);
    deathScreen.show();
  } else if (gameState === "playing") {
    lowPassFilter.freq(22050); // Ajustar la frecuencia de corte del filtro a un valor alto
    menu_music.stop();
    menuMusicStarted = false;
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

//Pausar el juego
function showPauseMenu() {
  background(0, 150); // Fondo semi-transparente
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(32);
  textFont(arcadeFont); // Aplicar fuente estilo arcade
  text("Paused", width / 2, height / 2 - 100);

  textSize(24);
  for (let i = 0; i < 4; i++) {
    if (i === pauseMenuIndex) {
      fill(255, 0, 0); // Resaltar el elemento seleccionado en rojo
    } else {
      fill(255);
    }
    if (i === 0) {
      text("Resume", width / 2, height / 2);
    } else if (i === 1) {
      text("Restart", width / 2, height / 2 + 50);
    } else if (i === 2) {
      text("Select Stage", width / 2, height / 2 + 100);
    } else if (i === 3) {
      text("Main Menu", width / 2, height / 2 + 150);
    }
  }
}

//Menu lateral
function drawSidebar() {
  fill(50);
  rect(width - sideBarWidth - 20, 0, 200, height);
  fill(255);
  textSize(7);
  textAlign(LEFT, TOP);
  text(`Health: ${player.health}`, width - sideBarWidth - 20 + 10, 20);
  text(`Score: ${score}`, width - sideBarWidth - 20 + 10, 50);
  text(`Stage: ${stage}`, width - sideBarWidth - 20 + 10, 80);
  text(`Defeated: ${killCount}`, width - sideBarWidth - 20 + 10, 110);
  text(`____________`, width - sideBarWidth - 20 + 10, 120);
  text(`Controls:`, width - sideBarWidth - 20 + 10, 140);
  text(`Arrows to move`, width - sideBarWidth - 20 + 10, 180);
  text(`x to shoot`, width - sideBarWidth - 20 + 10, 210);
  text(`p to pause`, width - sideBarWidth - 20 + 10, 240);
  text(`r to restart`, width - sideBarWidth - 20 + 10, 270);
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
    if (stage == 0) {
      enemies.push(
        new Enemy( //Propiedades del nuevo enemigo
          random(width - sideBarWidth - 50), //Posicion x
          0, //Posicion y
          random(enemyImages), //Sprite
          "aimed", //Tipo de disparo
          "straight"
        ) //Tipo de movimiento
      );
    } else if (stage == 1) {
      enemies.push(
        new Enemy( //Propiedades del nuevo enemigo
          random(width - sideBarWidth - 30), //Posicion x
          0, //Posicion y
          random(enemyImages), //Sprite
          random(["aimed", "spread"]), //Tipo de disparo
          random(["sine", "straight", "standing"]) //Tipo de movimiento
        )
      );
    } else if (stage == 2) {
      enemies.push(
        new Enemy( //Propiedades del nuevo enemigo
          random(width - sideBarWidth - 30), //Posicion x
          0, //Posicion y
          random(enemyImages), //Sprite
          random(["aimed", "spread", "circular"]), //Tipo de disparo
          random(["sine", "straight", "zigzag", "standing"]) //Tipo de movimiento
        )
      );
    } else if (stage >= 3) {
      enemies.push(
        new Enemy( //Propiedades del nuevo enemigo
          random(width - sideBarWidth - 30), //Posicion x
          0, //Posicion y
          random(enemyImages), //Sprite
          random(["aimed", "spread", "circular", "line"]), //Tipo de disparo
          random(["sine", "straight", "zigzag", "standing", "horizontal"]) //Tipo de movimiento
        )
      );
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
    enemyBullets[i].show(stages[stage].bulletColor);
  }
}

// Funcion para mostrar mensajes de inicio de etapa de forma secuencial
function showStageMessages(stage) {
  const messages = [
    {
      text: [`Stage ${stage + 1} completed!`, stages[stage].subname],
      delay: 2500,
    },
    {
      text: [
        `${stages[stage + 1 > 4 ? 4 : stage + 1].name} starting!`,
        stages[stage + 1 > 4 ? 4 : stage + 1].subname,
      ],
      delay: 1000,
    },
    { text: ["Ready?"], delay: 1000 },
    { text: ["Set?"], delay: 1000 },
    { text: ["Go!"], delay: 500 },
  ];

  let currentMessageIndex = 0;

  function showNextMessage() {
    if (currentMessageIndex < messages.length) {
      const message = messages[currentMessageIndex];
      background(0);
      fill(255);
      textSize(32);
      textAlign(CENTER, CENTER);
      message.text.forEach((messageContent, index) => {
        if (index != 0) {
          fill(255, 255, 0);
        }
        text(messageContent, width / 2, height / 2 + index * 40);
      });
      currentMessageIndex++;
      setTimeout(showNextMessage, message.delay);
    } else {
      loop();
    }
  }

  showNextMessage();
}

function updateStage() {
  if (
    killCount % 4 === 0 &&
    frameCount != 0 &&
    killCount != lastKillCount &&
    !isStopped
  ) {
    if (stage != 4) {
      success_sound.play();
      isStopped = true;

      showStageMessages(stage);
      noLoop();
      stage += 1;

      isStopped = false;
      lastKillCount = killCount;
      enemySpawnInterval = stages[stage].enemySpawnInterval;
    } else {
      // Show game over screen with thanks for playing message
      noLoop();
      background(0);
      fill(255);
      textSize(32);
      textAlign(CENTER, CENTER);
      text("Congratulations!", width / 2, height / 2 - 100);
      text("Thanks for playing!", width / 2, height / 2);
      setTimeout(() => {
        gameState = "start";
        restart();
        loop();
      }, 5000);
    }
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
  lastKillCount = 0;

  loop();
}

function keyPressed() {
  if (keyCode === ENTER && gameState === "start") {
    confirm_sound.play();
    gameState = "stageSelect";
  } else if (gameState == "stageSelect") {
    if (keyCode === UP_ARROW) {
      select_sound.play();
      selectedStage = (selectedStage - 1 + stages.length) % stages.length; //Para que no se salga de los limites
    } else if (keyCode === DOWN_ARROW) {
      select_sound.play();
      selectedStage = (selectedStage + 1) % stages.length;
    } else if (keyCode === ENTER) {
      confirm_sound.play();
      stage = selectedStage;
      initialStage = stage;
      gameState = "playing";
    }
  } else if (gameState === "playing") {
    if (key === "p" || key === "P") {
      gameState = "paused";
      noLoop();
      redraw();
    }
  } else if (gameState === "paused") {
    if (keyCode === UP_ARROW) {
      pauseMenuIndex = (pauseMenuIndex - 1 + 4) % 4; // Navegar hacia arriba en el menú
      select_sound.play();
      redraw();
    } else if (keyCode === DOWN_ARROW) {
      pauseMenuIndex = (pauseMenuIndex + 1) % 4; // Navegar hacia abajo en el menú
      select_sound.play();
      redraw();
    } else if (keyCode === ENTER) {
      if (pauseMenuIndex === 0) {
        gameState = "playing";
        loop(); // Reanudar el bucle de dibujo
      } else if (pauseMenuIndex === 1) {
        restart();
        gameState = "playing";
      } else if (pauseMenuIndex === 2) {
        restart();
        gameState = "stageSelect";
        loop();
      } else if (pauseMenuIndex === 3) {
        gameState = "start";
        restart();
        loop();
      }
      confirm_sound.play();
    }
  } else if (gameState === "death") {
    noLoop();
    if (keyCode === UP_ARROW) {
      deathIndex = (deathIndex - 1 + 3) % 3; // Navegar hacia arriba en el menú
      select_sound.play();
      redraw();
    } else if (keyCode === DOWN_ARROW) {
      deathIndex = (deathIndex + 1) % 3; // Navegar hacia abajo en el menú
      select_sound.play();
      redraw();
    } else if (keyCode === ENTER) {
      if (deathIndex === 0) {
        restart();
        gameState = "playing";
      } else if (deathIndex === 1) {
        restart();
        gameState = "stageSelect";
        loop();
      } else if (deathIndex === 2) {
        gameState = "start";
        restart();
        loop();
      }
      confirm_sound.play();
    }
  }
  if (key === "r" || key === "R") {
    restart();
  }
}
