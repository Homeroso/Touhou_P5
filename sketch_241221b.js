let player;
let startScreen;
let selectStageScreen;
let pauseMenuScreen;
let lowPassFilter;
let deathScreen;
let boss;
let bossDefeated = false;

//Variables para entidades
let bullets = [];
let enemies = [];
let enemyBullets = [];
let enemySpawnInterval = 5; // Spawn rate enemigos
let obstacles = [];
//Variables de imagenes
let enemyImages = [];
let stageImages = [];
let bossImages = []; // New array to store boss images for each stage
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
let bossActive = false; // New variable to track if boss is active

//Variables de estado
let gameState = "start"; // Estados posibles: 'start', 'playing', 'paused', stageSelect
let selectedStage = 0;
let musicMuted = false;
let isStopped = false;

//Variables de musica
let music;
let menu_music;
let boss_music; // New variable for boss music
let started = false;
let menuMusicStarted = false;
let bossMusicStarted = false; // New variable to track if boss music is playing

//Sidebar
const sideBarWidth = 100;
let frameCount = 0;

// Speedrun timing
let startTime;
let endTime;
let elapsedTime = 0;
let timerRunning = false;

function drawObstacles() {
  // Placeholder function for drawing obstacles
  // Add your obstacle drawing logic here
}

function startTimer() {
  startTime = millis();
  timerRunning = true;
}

function stopTimer() {
  endTime = millis();
  elapsedTime = (endTime - startTime) / 1000; // Convert to seconds
  timerRunning = false;
}
function displayTimer() {
  if (timerRunning) {
    let currentTime = (millis() - startTime) / 1000; // Convert to seconds
    fill(255);
    textSize(16);
    textAlign(LEFT, TOP);
    text(`Time: ${currentTime.toFixed(2)}s`, 10, 10);
  } else {
    fill(255);
    textSize(16);
    textAlign(LEFT, TOP);
    text(`Final Time: ${elapsedTime.toFixed(2)}s`, 10, 10);
  }
}

function preload() {
  //Cargar cancion
  soundFormats("mp3");
  music = loadSound("assets/sounds/music.mp3");
  menu_music = loadSound("assets/sounds/menu_music.mp3");
  boss_music = loadSound("assets/sounds/menu_music.mp3"); // Load boss music
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

  // Load boss images for each stage
  bossImages.push(loadImage("assets/img/boss1.png"));
  bossImages.push(loadImage("assets/img/boss2.png"));
  bossImages.push(loadImage("assets/img/boss3.png"));
  bossImages.push(loadImage("assets/img/boss4.png"));
  bossImages.push(loadImage("assets/img/boss5.png"));

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
  boss_music.setVolume(0.2);

  // Crear un filtro de agua para menu de pausa
  lowPassFilter = new p5.LowPass();
  music.disconnect();
  music.connect(lowPassFilter);
  boss_music.disconnect();
  boss_music.connect(lowPassFilter);

  // Initialize boss with null (will be created when needed)
  boss = null;

  if (!enemyBulletImage) {
    console.error("Failed to load enemyBulletImage");
  }
}

// Create a new boss for the current stage
function createBossForStage() {
  const bossTypes = [
    { attack: "circular", movement: "leftRight" },
    { attack: "spread", movement: "sine" },
    { attack: "aimed", movement: "zigzag" },
    { attack: "line", movement: "horizontal" },
    { attack: "spiral", movement: "chase" },
  ];

  // Choose boss type based on stage
  const bossType = bossTypes[stage % bossTypes.length];

  // Create boss with increasing health for each stage
  const bossHealth = 50 + stage * 25; // More health for higher stages
  const bossSpeed = 1 + stage * 0.3; // Faster bosses for higher stages

  // Use the boss image for current stage or default to last image if we run out
  const bossImage =
    stage < bossImages.length
      ? bossImages[stage]
      : bossImages[bossImages.length - 1];

  return new Boss(
    width / 2,
    100,
    bossImage,
    bossType.attack,
    bossType.movement,
    bossHealth,
    bossSpeed
  );
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
    boss_music.stop();
    started = false;
    bossMusicStarted = false;
    startScreen.show();
    if (!menuMusicStarted) {
      menu_music.loop();
      menuMusicStarted = true;
    }
  } else if (gameState === "stageSelect") {
    music.stop();
    boss_music.stop();
    started = false;
    bossMusicStarted = false;
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
    if (!started && !bossActive) {
      music.loop();
      started = true;
    }

    bulletHandle();

    // Handle boss activation when enough enemies are killed
    if (killCount >= 10 && !bossActive) {
      bossActive = true;
      // Create a boss for the current stage
      boss = createBossForStage();

      // Switch to boss music
      music.stop();
      started = false;
      if (!bossMusicStarted) {
        boss_music.loop();
        bossMusicStarted = true;
      }
    }

    // Only spawn regular enemies if boss is not active
    if (!bossActive) {
      enemyHandle();
    }

    enemyBulletHandle();
    player.update();
    player.show();

    if (bossActive && boss) {
      boss.update();
      boss.show();

      // Display boss health
      fill(255);
      textSize(16);
      textAlign(CENTER, TOP);
      text(`BOSS HP: ${boss.health}`, width / 2, 30);
    }

    drawObstacles();
    checkCollisions();
    checkBossCollisions();
    updateStage();

    // Speedrun Timer
    displayTimer();
  }
}

// Check collisions between player bullets and boss
function checkBossCollisions() {
  if (!boss || !bossActive) return;

  for (let i = bullets.length - 1; i >= 0; i--) {
    if (boss.isHitBy(bullets[i])) {
      // Remove bullet
      bullets.splice(i, 1);

      // Reduce boss health
      boss.health -= 1;

      // Add to score
      score += 10;

      // Check if boss is defeated
      if (boss.health <= 0) {
        bossDefeated = true;
        bossActive = false;
        boss_music.stop();
        bossMusicStarted = false;
        success_sound.play();
      }
    }
  }

  // Check if player is hit by boss
  if (boss.isHittingPlayer(player)) {
    player.health -= 1;
    if (player.health <= 0) {
      gameState = "death";
    }
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
  text(`Stage: ${stage + 1}`, width - sideBarWidth - 20 + 10, 80);
  text(`Defeated: ${killCount}`, width - sideBarWidth - 20 + 10, 110);

  // Show boss indicator when boss is active
  if (bossActive) {
    fill(255, 0, 0);
    text(`BOSS FIGHT!`, width - sideBarWidth - 20 + 10, 140);
    fill(255);
  }

  text(`____________`, width - sideBarWidth - 20 + 10, 170);
  text(`Controls:`, width - sideBarWidth - 20 + 10, 190);
  text(`Arrows to move`, width - sideBarWidth - 20 + 10, 220);
  text(`x to shoot`, width - sideBarWidth - 20 + 10, 250);
  text(`p to pause`, width - sideBarWidth - 20 + 10, 280);
  text(`r to restart`, width - sideBarWidth - 20 + 10, 310);
}

//Actualizar y eliminar las balas del jugador
function bulletHandle() {
  let bulletsToRemove = [];

  for (let i = bullets.length - 1; i >= 0; i--) {
    if (bullets[i].collision()) {
      continue;
    }

    bullets[i].update();

    if (
      bullets[i].y < -50 ||
      bullets[i].x > width - sideBarWidth ||
      bullets[i].y > height ||
      bullets[i].x < 0
    ) {
      bulletsToRemove.push(i);
      continue;
    }
    bullets[i].show();
  }

  for (let i of bulletsToRemove) {
    bullets.splice(i, 1);
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
  if (frameCount % enemySpawnInterval === 0 && !bossActive) {
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
  let bulletsToRemove = [];

  for (let i = enemyBullets.length - 1; i >= 0; i--) {
    enemyBullets[i].update();
    if (
      enemyBullets[i].y > height + 50 ||
      enemyBullets[i].y < -50 ||
      enemyBullets[i].x > width - sideBarWidth ||
      enemyBullets[i].x < 0
    ) {
      bulletsToRemove.push(i);
      continue;
    }
    enemyBullets[i].show(stages[stage].bulletColor);
  }

  for (let i of bulletsToRemove) {
    enemyBullets.splice(i, 1);
  }
}

// Funcion para mostrar mensajes de inicio de etapa de forma secuencial
function showStageMessages(stage) {
  const messages = [
    {
      text: [`Stage ${stage + 1} completed!`, stages[stage].subname],
      delay: 1000,
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
  noLoop();
  showNextMessage();
}

function updateStage() {
  // If boss is defeated, advance to next stage
  if (bossDefeated) {
    bossDefeated = false;
    showStageMessages(stage);
    noLoop();

    // Only advance to next stage if we're not at the last stage already
    if (stage < stages.length - 1) {
      stage += 1;
    } else {
      // If at last stage, show victory message
      background(0);
      fill(255, 215, 0);
      textSize(48);
      textAlign(CENTER, CENTER);
      text("YOU WIN!", width / 2, height / 2 - 50);
      textSize(24);
      text(`Final Score: ${score}`, width / 2, height / 2 + 50);
      text(`Press R to restart`, width / 2, height / 2 + 100);
    }

    killCount = 0;
    lastKillCount = 0;
    enemySpawnInterval = stages[stage].enemySpawnInterval;
  }

  // Check if enough enemies killed to trigger boss
  else if (killCount >= 10 && !bossActive) {
    bossActive = true;
  }
}

function restart() {
  bullets = [];
  enemies = [];
  enemyBullets = [];
  stage = initialStage;
  score = 0;
  killCount = 0;
  player.health = 5;
  frameCount = 0;
  lastKillCount = 0;
  bossActive = false;
  bossDefeated = false;
  boss = null;

  // Reset music
  music.stop();
  boss_music.stop();
  started = false;
  bossMusicStarted = false;

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
    if (!timerRunning) {
      startTimer(); // Start the timer when the game starts
    }
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
    if (timerRunning) {
      stopTimer(); // Stop the timer when the game ends
    }
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

function checkCollisions() {
  for (let obstacle of obstacles) {
    if (player.collidesWith(obstacle)) {
      player.health--;
    }
    for (let bullet of bullets) {
      if (bullet.collidesWith(obstacle)) {
        bullets.splice(bullets.indexOf(bullet), 1);
      }
    }
  }
}
