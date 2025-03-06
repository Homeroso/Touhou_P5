class EnemyBullet {
  constructor(x, y, dx, dy, image) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.size = 10;
    this.image = image;
  }

  update() {
    this.x += this.dx;
    this.y += this.dy;
  }

  show() {
    if (this.image) {
      image(this.image, this.x, this.y, this.size, this.size);
    } else {
      console.error("EnemyBullet image is not defined");
    }
  }
}
