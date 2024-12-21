class Bullet {
    constructor(x, y, image) {
        this.x = x;
        this.y = y;
        this.size = 5;
        this.speed = 10;
        this.image = image;
    }
    
    update() {
        this.y -= this.speed;
        
    }
    
    show() {
        image(this.image, this.x, this.y, this.size);
    }
  
    collision(){
      // Comprobar colison con enemigos
        for (let i = enemies.length - 1; i >= 0; i--) {
            let enemy = enemies[i];
            let d = dist(this.x, this.y, enemy.x, enemy.y);
            if (d < this.size / 2 + enemy.size / 2) {
                // Colision detectada
         
                enemies.splice(i, 1); // eliminar enemigo
                bullets.splice(bullets.indexOf(this), 1); // eliminar bala
                killCount++;
                score+=10;
                return true;
            }
        }
      return false
    }
}
