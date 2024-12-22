class Enemy {
  constructor(x, y, image, shootingPattern, movementPattern) {
    this.x = x;
    this.y = y;
    this.size = 50;
    this.speed = 2;
    this.image = image;
    this.shootInterval = 250; // Shoot every 120 frames
    this.lastShotFrame = 0;
    this.movementPattern = movementPattern;
    this.angle = 0;
    this.shootingPattern = shootingPattern; // New property for shooting pattern
  }

  update() {
    this.move();
    // Shoot bullets at intervals
    if (frameCount - this.lastShotFrame > this.shootInterval) {
      this.shoot();
      this.lastShotFrame = frameCount;
    }
  }

  move() {
    if (this.movementPattern === "sine") {
      this.moveSine();
    } else if (this.movementPattern === "zigzag") {
      this.moveZigzag();
    } else if (this.movementPattern === "straight") {
      this.moveStraight();
    } else if (this.movementPattern === "horizontal") {
      this.moveHorizontal();
    } else if (this.movementPattern === "standing") {
      this.moveStanding();
    }
  }

  shoot() {
    if (this.shootingPattern === "circular") {
      this.shootCircularPattern();
    } else if (this.shootingPattern === "spread") {
      this.shootSpreadPattern();
    } else if (this.shootingPattern === "aimed") {
      this.shootAimedPattern();
    } else if (this.shootingPattern === "burst") {
      this.shootBurstPattern();
    } else if (this.shootingPattern === "line") {
      this.shootLinePattern();
    } else {
      // Default shooting pattern
      enemyBullets.push(
        new EnemyBullet(this.x, this.y, null, enemyBulletImage)
      );
    }
  }

  //-------------------------Patrones de dispaaro del enemigo-----------------------------------------------------
  shootCircularPattern() {
    let numBullets = 12;
    for (let i = 0; i < numBullets; i++) {
      let angle = (TWO_PI / numBullets) * i;
      let bulletX = this.x + cos(angle) * 10;
      let bulletY = this.y + sin(angle) * 10;
      enemyBullets.push(
        new EnemyBullet(bulletX, bulletY, angle, enemyBulletImage)
      );
    }
  }

  shootSpreadPattern() {
    let numBullets = 5;
    let baseAngle = atan2(player.y - this.y, player.x - this.x);
    for (let i = -2; i <= 2; i++) {
      let angle = baseAngle + (PI / 12) * i; // Spread bullets around the base angle
      enemyBullets.push(
        new EnemyBullet(this.x, this.y, angle, enemyBulletImage)
      );
    }
  }
  shootBurstPattern() {
    if (this.burstCount < 3) {
      let baseAngle = atan2(player.y - this.y, player.x - this.x);
      let angle = baseAngle + (PI / 18) * (this.burstCount - 1); // Burst bullets around the base angle
      enemyBullets.push(
        new EnemyBullet(this.x, this.y, angle, enemyBulletImage)
      );
      this.burstCount++;
      this.lastShotFrame = frameCount; // Reset the last shot frame to create a delay between burst bullets
    } else {
      this.burstCount = 0; // Reset burst count after 3 bullets
    }
  }
  shootLinePattern() {
    let numBullets = 5;
    let baseAngle = atan2(player.y - this.y, player.x - this.x);
    for (let i = 0; i < numBullets; i++) {
      let offsetX = cos(baseAngle) * i * 10;
      let offsetY = sin(baseAngle) * i * 10;
      enemyBullets.push(
        new EnemyBullet(
          this.x + offsetX,
          this.y + offsetY,
          baseAngle,
          enemyBulletImage
        )
      );
    }
  }

  shootAimedPattern() {
    let angle = atan2(player.y - this.y, player.x - this.x);
    enemyBullets.push(new EnemyBullet(this.x, this.y, angle, enemyBulletImage));
  }

  //-----------------Patrones de movimiento del enemigo----------------------------------------------------------------

  moveSine() {
    this.x += Math.sin(this.angle) * 2; // Sine wave movement
    this.angle += 0.1;
    if (this.y <= 70) {
      this.y += this.speed;
    }
  }

  moveZigzag() {
    this.x += Math.sin(this.angle) * 5; // Zigzag movement
    this.y += this.speed;
    this.angle += 0.1;
  }

  moveStraight() {
    this.y += this.speed; // Default downward movement
  }

  moveHorizontal() {
    this.x += this.speed; // Horizontal movement
    if (this.x > width - sideBarWidth - this.image.width || this.x < 0) {
      this.speed *= -1; // Reverse direction at edges
    }
    this.y += abs(this.speed / 2);
  }

  moveStanding() {
    if (this.y <= 70) {
      this.y += this.speed;
    }
  }

  show() {
    image(this.image, this.x, this.y, this.size, this.size);
  }
}
