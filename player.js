class Player {
  constructor(image, gameState) {
    this.x = width / 2 - 80;
    this.y = height - 70;
    this.size = 80;
    this.image = image;
    this.health = 5;
    this.cooldown = 60;
    this.canHurt = true;
    this.gameState = gameState;
    this.opacity = 255;
    this.canShoot = true;
  }

  update() {
    this.move();
    this.shoot();
    this.collision(enemies);
    this.collision(enemyBullets);

    if (this.isDead()) {
      gameState = "death";
    }
    if (this.canHurt == false) {
      this.cooldownStart();
    }
  }

  show() {
    // Show opacity when invulnerable
    push();
    tint(255, this.opacity);
    image(this.image, this.x - 20, this.y - 20, this.size - 25, this.size);
    pop();
  }

  move() {
    if (keyIsDown(LEFT_ARROW) && this.x > 15) {
      this.x -= 7.5;
    }
    if (
      keyIsDown(RIGHT_ARROW) &&
      this.x < width - sideBarWidth - 20 - this.image.width
    ) {
      this.x += 7.5;
    }
    if (keyIsDown(UP_ARROW) && this.y > 25) {
      this.y -= 7.5;
    }
    if (keyIsDown(DOWN_ARROW) && this.y < height - this.image.height - 5) {
      this.y += 7.5;
    }
  }

  shoot() {
    //Dispara con la tecla 'x'
    if (keyIsDown(88) && this.canShoot) {
      //Disparo sostenido, es decir dispara mientras esté presionada
      bullets.push(new Bullet(player.x + 8, player.y, bulletImage));
      this.canShoot = false;
      setTimeout(() => {
        this.canShoot = true;
      }, 500);
    }
  }

  collision(object) {
    // Detecta colisiones con enemigos
    for (let i = object.length - 1; i >= 0; i--) {
      let enemy = object[i];
      let d = dist(this.x, this.y, enemy.x, enemy.y);
      if (d < this.size / 2 + enemy.size / 2) {
        if (this.canHurt == true) {
          this.health--;
          this.canHurt = false;
          object.splice(i, 1); // Remove the enemy on collision
        }
      }
    }
  }

  isDead() {
    if (this.health <= 0) {
      return true;
    }
    return false;
  }

  cooldownStart() {
    // Set an oscillating opacity for the player when it's invulnerable

    if (this.cooldown > 0) {
      this.cooldown--;
      // Oscilar la opacidad durante el cooldown
      let alpha = 255 * (0.5 + 0.5 * sin(millis() / 100));
      this.opacity = alpha;
    } else {
      this.cooldown = 60;
      this.canHurt = true;
      this.opacity = 255;
    }
  }
}
