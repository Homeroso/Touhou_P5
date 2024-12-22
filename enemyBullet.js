class EnemyBullet {
  constructor(x, y, angle, image, recolor = [50, 40, 200]) {
    this.x = x;
    this.y = y;
    this.size = 15;
    this.speed = 3;
    this.image = image;
    this.angle = angle;
    this.recolor = recolor;
  }

  update() {
    this.x += cos(this.angle) * this.speed;
    this.y += sin(this.angle) * this.speed;
  }

  show(bulletColor = this.recolor) {
    push();
    stroke(255); // Color del borde (blanco)
    strokeWeight(5); // Grosor del borde
    fill(0, 0, 0, 0); // Color de relleno (rojo)
    ellipse(
      this.x + this.size / 2,
      this.y + this.size / 2,
      this.size,
      this.size
    ); // Dibujar el borde y el relleno
    tint(...bulletColor); // Aplicar color azul a la bala enemiga
    // agregar borde blanco a la bala enemiga

    image(this.image, this.x, this.y, this.size, this.size);
    noTint();
    pop();
  }
}
