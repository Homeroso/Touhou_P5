class Bullet {
  constructor(x, y, image, recolor = [50, 40, 200]) {
    this.x = x;
    this.y = y;
    this.size = 20;
    this.speed = 5;
    this.image = image;
    this.recolor = recolor;
  }

  update() {
    this.y -= this.speed;
  }

  show(bulletColor = this.recolor) {
    tint(...bulletColor); // Aplicar color rojo a la bala enemiga
    image(this.image, this.x, this.y, this.size, this.size);
    noTint(); // Restablecer el tinte
  }

  collision() {
    // Comprobar colison con enemigos
    for (let i = enemies.length - 1; i >= 0; i--) {
      let enemy = enemies[i];
      let d = dist(this.x, this.y, enemy.x, enemy.y);
      if (d < this.size / 2 + enemy.size / 2) {
        // Colision detectada

        enemies.splice(i, 1); // eliminar enemigo
        bullets.splice(bullets.indexOf(this), 1); // eliminar bala
        killCount++;
        score += 10;
        return true;
      }
    }
    return false;
  }
}
