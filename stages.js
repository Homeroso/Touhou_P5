class Stage {
  constructor(
    number,
    enemySpawnInterval,
    subname,
    enemyStats,
    stageBackground,
    bulletColor = [255, 0, 0]
  ) {
    this.number = number;
    this.enemySpawnInterval = enemySpawnInterval;
    this.name = `Stage ${number}`;
    this.subname = subname;
    this.enemyStats = enemyStats;
    this.stageBackground = stageBackground;
    this.bulletColor = bulletColor;
  }

  showLabel() {
    fill(255);
    textFont(arcadeFont);
    textSize(20);
    text(this.name, 10, 20);
    text(this.subname, 10, 40);
  }
}

let stages;
function setUpStages(stateImages) {
  stages = [
    new Stage(
      (number = 1),
      (enemySpawnInterval = 100),
      (submame = "How do you turn this on?"),
      (enemyStats = [
        ["aime"], //Tipo de disparo
        ["straight"],
      ]),
      (stageBackground = stateImages[0]),
      (bulletColor = [255, 0, 0])
    ),
    // new Stage(2, 50, 'Lost in the woods'),
    new Stage(
      (number = 2),
      (enemySpawnInterval = 100),
      (submame = "Lost in the woods"),
      (enemyStats = {
        shoot: ["aimed", "spread"], //Tipo de disparo
        movement: ["sine", "straight", "standing"], //Tipo de movimiento
      }),
      (stageBackground = stateImages[1]),
      (bulletColor = [0, 255, 0])
    ),
    new Stage(
      (number = 3),
      (enemySpawnInterval = 200),
      (submame = "Mausoleum of the divine spirits"),
      (enemyStats = {
        shoot: ["aimed", "spread", "circular"], //Tipo de disparo
        movement: ["sine", "straight", "standing", "zigzag"], //Tipo de movimiento
      }),
      (stageBackground = stateImages[2]),
      (bulletColor = [255, 0, 0])
    ),
    new Stage(
      (number = 4),
      (enemySpawnInterval = 170),
      (submame = "Mastering the art of war"),
      (enemyStats = {
        shoot: ["aimed", "spread", "circular", "line"], //Tipo de disparo
        movement: ["sine", "straight", "standing", "zigzag", "horizontal"], //Tipo de movimiento
      }),
      (stageBackground = stateImages[3]),
      (bulletColor = [255, 255, 255])
    ),
    new Stage(
      (number = 5),
      (enemySpawnInterval = 100),
      (submame = "The Final Countdown"),
      (enemyStats = []),
      (stageBackground = stateImages[4]),
      (bulletColor = [255, 255, 255])
    ),
  ];
}
