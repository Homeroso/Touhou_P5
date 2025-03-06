class EnemyBullet {
  constructor(x, y, angle, image) {
    this.x = x;
    this.y = y;
    this.size = 10;
    this.speed = 3;
    this.angle = angle;
    this.image = image;
  }

  update() {
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed;
  }

  show(bulletColor = [255, 0, 0]) {
    if (this.image) {
      tint(...bulletColor); // Aplicar color a la bala enemiga
      image(this.image, this.x, this.y, this.size, this.size);
      noTint(); // Restablecer el tinte
    } else {
      fill(...bulletColor);
      ellipse(this.x, this.y, this.size, this.size);
    }
  }
}
