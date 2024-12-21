class EnemyBullet {
    constructor(x, y, angle, image) {
        this.x = x;
        this.y = y;
        this.size = 5;
        this.speed = 3;
        this.image = image;
        this.angle = angle;
    }
    
    update() {
        this.x += cos(this.angle) * this.speed;
        this.y += sin(this.angle) * this.speed;
        
    }
    
    show() {
        image(this.image, this.x, this.y, this.size, this.size)
    }
}
