class Boss {
  constructor(x, y, image, shootingPattern, movementPattern) {
    this.x = x;
    this.y = y;
    this.size = 100;
    this.image = image;
    this.health = 10; // Reduced health
    this.maxHealth = 10; // Maximum health for the health bar
    this.shootingPattern = shootingPattern;
    this.movementPattern = movementPattern;
    this.isVisible = true;
    this.shootInterval = 150; // Shoot every 150 frames (2.5 seconds)
    this.lastShotFrame = 0;
    this.speed = 2; // Speed for movement
  }

  update() {
    this.move();
    if (this.isVisible) {
      if (frameCount - this.lastShotFrame > this.shootInterval) {
        this.shoot();
        this.lastShotFrame = frameCount;
      }
    }
  }

  show() {
    if (this.isVisible) {
      image(this.image, this.x, this.y, this.size, this.size);
      this.showHealthBar();
    }
  }

  move() {
    if (this.movementPattern === "leftRight") {
      this.moveLeftRight();
    }
  }

  moveLeftRight() {
    this.x += this.speed;
    if (this.x > width - sideBarWidth - this.size || this.x < 0) {
      this.speed *= -1; // Reverse direction at edges
    }
  }

  shoot() {
    if (this.shootingPattern === "circular") {
      this.shootCircularPattern();
    }
  }

  shootCircularPattern() {
    let numBullets = 6;
    for (let i = 0; i < numBullets; i++) {
      let angle = (TWO_PI / numBullets) * i;
      let bulletX = this.x + cos(angle) * 10;
      let bulletY = this.y + sin(angle) * 10;
      enemyBullets.push(
        new EnemyBullet(bulletX, bulletY, angle, enemyBulletImage)
      );
    }
  }

  showHealthBar() {
    fill(255, 0, 0);
    rect(this.x - this.size / 2, this.y - 20, this.size, 10);
    fill(0, 255, 0);
    rect(
      this.x - this.size / 2,
      this.y - 20,
      (this.size * this.health) / this.maxHealth,
      10
    ); // Adjusted health bar
  }

  takeDamage() {
    if (this.isVisible) {
      this.health--;
      if (this.health <= 0) {
        // Boss defeated logic
      }
    }
  }
}
