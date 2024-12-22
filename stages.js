class Stage {
  constructor(number, enemySpawnInterval, subname, enemyStats) {
    this.number = number;
    this.enemySpawnInterval = enemySpawnInterval;
    this.name = `Stage ${number}`;
    this.subname = subname;
    this.enemyStats = enemyStats;
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
function setUpStages() {
  stages = [
    new Stage(
      (number = 1),
      (enemySpawnInterval = 60),
      (submame = 'How do you turn this on?'),
      (enemyStats = [
        ['aime'], //Tipo de disparo
        ['straight'],
      ])
    ),
    // new Stage(2, 50, 'Lost in the woods'),
    new Stage(
      (number = 2),
      (enemySpawnInterval = 50),
      (submame = 'Lost in the woods'),
      (enemyStats = {
        shoot: ['aimed', 'spread'], //Tipo de disparo
        movement: ['sine', 'straight', 'standing'], //Tipo de movimiento
      })
    ),
    new Stage(
      (number = 3),
      (enemySpawnInterval = 40),
      (submame = 'You are not prepared'),
      (enemyStats = {
        shoot: ['aimed', 'spread', 'circular'], //Tipo de disparo
        movement: ['sine', 'straight', 'standing', 'zigzag'], //Tipo de movimiento
      })
    ),
    new Stage(
      (number = 4),
      (enemySpawnInterval = 40),
      (submame = 'Mastering the art of war'),
      (enemyStats = {
        shoot: ['aimed', 'spread', 'circular', 'line'], //Tipo de disparo
        movement: ['sine', 'straight', 'standing', 'zigzag', 'horizontal'], //Tipo de movimiento
      })
    ),
    new Stage(
      (number = 5),
      (submame = 'The Final Countdown'),
      (enemySpawnInterval = 40),
      (enemyStats = [])
    ),
  ];
}
