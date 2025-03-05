class Boss {
  constructor(
    x,
    y,
    image,
    attackType,
    movementType,
    health = 100,
    speed = 1.5
  ) {
    this.x = x;
    this.y = y;
    this.image = image;
    this.width = 80;
    this.height = 80;
    this.health = health;
    this.maxHealth = health;
    this.attackType = attackType;
    this.movementType = movementType;
    this.speed = speed;
    this.attackCooldown = 0;
    this.direction = 1; // For movement patterns
    this.angle = 0; // For circular patterns
  }

  update() {
    // Movement patterns
    switch (this.movementType) {
      case "leftRight":
        this.x += this.direction * this.speed;
        if (this.x > width - sideBarWidth - this.width || this.x < 0) {
          this.direction *= -1;
        }
        break;

      case "sine":
        this.x += this.direction * this.speed;
        this.y = 100 + Math.sin(frameCount / 30) * 50;
        if (this.x > width - sideBarWidth - this.width || this.x < 0) {
          this.direction *= -1;
        }
        break;

      case "zigzag":
        this.x += this.direction * this.speed;
        if (frameCount % 60 < 30) {
          this.y += 0.5;
        } else {
          this.y -= 0.5;
        }
        if (this.x > width - sideBarWidth - this.width || this.x < 0) {
          this.direction *= -1;
        }
        if (this.y < 50 || this.y > 200) {
          this.y = constrain(this.y, 50, 200);
        }
        break;

      case "horizontal":
        this.x = width / 2 + Math.sin(frameCount / 40) * (width / 2 - 100);
        break;

      case "chase":
        // Move towards player
        const dx = player.x - this.x;
        const dy = player.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > 200) {
          // Keep some distance
          this.x += (dx / dist) * this.speed;
          this.y += (dy / dist) * this.speed * 0.5; // Move slower vertically
        }
        this.y = constrain(this.y, 50, 200); // Keep boss near top of screen
        break;
    }

    // Attack patterns
    this.attackCooldown--;
    if (this.attackCooldown <= 0) {
      this.attack();
      // Adjust cooldown based on boss health (attacks more frequently when damaged)
      this.attackCooldown = 60 - (1 - this.health / this.maxHealth) * 30;
    }
  }

  attack() {
    switch (this.attackType) {
      case "aimed":
        // Fire directly at player
        let angle = Math.atan2(player.y - this.y, player.x - this.x);
        enemyBullets.push(
          new EnemyBullet(
            this.x,
            this.y,
            Math.cos(angle) * 5,
            Math.sin(angle) * 5,
            enemyBulletImage
          )
        );
        break;

      case "spread":
        // Fire 5 bullets in a spread pattern
        for (let i = -2; i <= 2; i++) {
          let angle =
            Math.atan2(player.y - this.y, player.x - this.x) + i * 0.2;
          enemyBullets.push(
            new EnemyBullet(
              this.x,
              this.y,
              Math.cos(angle) * 4,
              Math.sin(angle) * 4,
              enemyBulletImage
            )
          );
        }
        break;

      case "circular":
        // Fire bullets in a circular pattern
        for (let i = 0; i < 8; i++) {
          let angle = (i / 8) * Math.PI * 2 + this.angle;
          enemyBullets.push(
            new EnemyBullet(
              this.x,
              this.y,
              Math.cos(angle) * 3,
              Math.sin(angle) * 3,
              enemyBulletImage
            )
          );
        }
        this.angle += 0.2; // Rotate the pattern over time
        break;

      case "line":
        // Fire a line of bullets across the screen
        for (let i = 0; i < width - sideBarWidth; i += 80) {
          enemyBullets.push(new EnemyBullet(i, this.y, 0, 3, enemyBulletImage));
        }
        break;

      case "spiral":
        // Fire spiral pattern
        for (let i = 0; i < 3; i++) {
          let angle = this.angle + (i * Math.PI * 2) / 3;
          enemyBullets.push(
            new EnemyBullet(
              this.x,
              this.y,
              Math.cos(angle) * 3,
              Math.sin(angle) * 3,
              enemyBulletImage
            )
          );
        }
        this.angle += 0.3;
        break;
    }
  }

  show() {
    // Draw boss
    image(
      this.image,
      this.x - this.width / 2,
      this.y - this.height / 2,
      this.width,
      this.height
    );

    // Draw health bar
    const barWidth = 100;
    const barHeight = 10;
    fill(255, 0, 0);
    rect(
      this.x - barWidth / 2,
      this.y - this.height / 2 - 20,
      barWidth,
      barHeight
    );
    fill(0, 255, 0);
    rect(
      this.x - barWidth / 2,
      this.y - this.height / 2 - 20,
      barWidth * (this.health / this.maxHealth),
      barHeight
    );
  }

  isHitBy(bullet) {
    return (
      bullet.x > this.x - this.width / 2 &&
      bullet.x < this.x + this.width / 2 &&
      bullet.y > this.y - this.height / 2 &&
      bullet.y < this.y + this.height / 2
    );
  }

  isHittingPlayer(player) {
    return (
      player.x > this.x - this.width / 2 &&
      player.x < this.x + this.width / 2 &&
      player.y > this.y - this.height / 2 &&
      player.y < this.y + this.height / 2
    );
  }
}
