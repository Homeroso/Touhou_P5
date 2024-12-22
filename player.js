class Player {
  constructor(image, gameState) {
    this.x = width / 2;
    this.y = height - 50;
    this.size = 20;
    this.image = image;
    this.health = 5;
    this.cooldown = 60;
    this.canHurt = true;
    this.gameState = gameState;
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
    image(this.image, this.x, this.y, this.size);
  }

  move() {
    if (keyIsDown(LEFT_ARROW) && this.x > 5) {
      this.x -= 5;
    }
    if (
      keyIsDown(RIGHT_ARROW) &&
      this.x < width - sideBarWidth - this.image.width
    ) {
      this.x += 5;
    }
    if (keyIsDown(UP_ARROW) && this.y > 10) {
      this.y -= 5;
    }
    if (keyIsDown(DOWN_ARROW) && this.y < height - this.image.height) {
      this.y += 5;
    }
  }

  shoot() {
    //Dispara con la tecla 'x'
    if (keyIsDown(88)) {
      //Disparo sostenido, es decir dispara mientras esté presionada
      bullets.push(new Bullet(player.x + 8, player.y, bulletImage));
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
        }

        object.splice(i, 1); // Remove the enemy on collision
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
    console.log(this.cooldown);
    if (this.cooldown > 0) {
      this.cooldown--;
    } else {
      this.cooldown = 60;
      this.canHurt = true;
    }
  }
}
