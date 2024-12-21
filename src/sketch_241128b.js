// Additional functions for handling game logic, character movement, etc. can be added below.
let player;
let bullets = [];
let enemies = [];
let enemyBullets = [];
let enemySpawnInterval = 60; // Spawn an enemy every 60 frames
let frameCount = 0;

function setup() {
    createCanvas(600, 400);
    player = new Player();
}

function draw() {
    background(0);
    player.update();
    player.display();
    
    let bulletsToRemove = [];
    for (let i = bullets.length - 1; i >= 0; i--) {
        if (bullets[i].collision()){
          continue;    
        }
        
        bullets[i].update();
        
        if (bullets[i].y < -50) {
            bulletsToRemove.push(i);
            continue;
        }
        bullets[i].display();
    }
    for (let i of bulletsToRemove) {
        bullets.splice(i, 1);
    }
  
    for (let bullet of bullets) {
        bullet.update();
        bullet.display();
    }
    
    for (let i = enemies.length - 1; i >= 0; i--) {
        enemies[i].update();
        if (enemies[i].y > height + 50) {
            enemies.splice(i, 1);
            continue;
        }
        enemies[i].display();
    }
  
    for (let i = enemyBullets.length - 1; i >= 0; i--) {
          enemyBullets[i].update();
          if (enemyBullets[i].y > height + 50) {
              enemyBullets.splice(i, 1);
              continue;
          }
          enemyBullets[i].display();
      }
   frameCount++;
    if (frameCount % enemySpawnInterval === 0) {
        enemies.push(new Enemy(random(width), 0));
    }
}

function keyPressed() {
    if (key === 'x') {
        console.log(bullets)
        bullets.push(new Bullet(player.x, player.y));
    }
}

class Player {
    constructor() {
        this.x = width / 2;
        this.y = height - 50;
        this.size = 20;
    }
    
    update() {
        if (keyIsDown(LEFT_ARROW)) {
            this.x -= 5;
        }
        if (keyIsDown(RIGHT_ARROW)) {
            this.x += 5;
        }
        if (keyIsDown(UP_ARROW)) {
            this.y -= 5;
        }
        if (keyIsDown(DOWN_ARROW)) {
            this.y += 5;
        }
      
        // Check for collision with enemies
        for (let i = enemies.length - 1; i >= 0; i--) {
            let enemy = enemies[i];
            let d = dist(this.x, this.y, enemy.x, enemy.y);
            if (d < this.size / 2 + enemy.size / 2) {
              
                // Collision detected, handle accordingly
                console.log('Collision with enemy!');
                enemies.splice(i, 1); // Remove the enemy on collision
            }
        }
    }
    
    display() {
        fill(255);
        ellipse(this.x, this.y, this.size);
    }
}

class Bullet {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 5;
        this.speed = 10;
    }
    
    update() {
        this.y -= this.speed;
        
    }
    
    display() {
        fill(255, 0, 0);
        ellipse(this.x, this.y, this.size);
    }
  
    collision(){
      // Check for collision with enemies
        for (let i = enemies.length - 1; i >= 0; i--) {
            let enemy = enemies[i];
            let d = dist(this.x, this.y, enemy.x, enemy.y);
            if (d < this.size / 2 + enemy.size / 2) {
                // Collision detected, handle accordingly
                console.log('Bullet hit enemy!');
                enemies.splice(i, 1); // Remove the enemy on collision
                bullets.splice(bullets.indexOf(this), 1); // Remove the bullet on collision
                return true;
            }
        }
      return false
    }
}

class Enemy {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 20;
        this.speed = 2;
        this.shootInterval = 120; // Shoot every 120 frames
        this.lastShotFrame = 0;
        this.movementPattern = 'sine';
        this.angle = 0;
        this.shootingPattern = 'circular'; // New property for shooting pattern
    }
    
    update() {
        if (this.movementPattern === 'sine') {
            this.x += Math.sin(this.angle) * 2; // Sine wave movement
            this.angle += 0.1;
        } else {
            this.y += this.speed; // Default downward movement
        }
        
        // Shoot bullets at intervals
        if (frameCount - this.lastShotFrame > this.shootInterval) {
            this.shoot();
            this.lastShotFrame = frameCount;
        }
    }
    
    shoot() {
        if (this.shootingPattern === 'circular') {
            this.shootCircularPattern();
        } else {
            // Default shooting pattern
            enemyBullets.push(new EnemyBullet(this.x, this.y));
        }
    }
    
    shootCircularPattern() {
        let numBullets = 12;
        for (let i = 0; i < numBullets; i++) {
            let angle = (TWO_PI / numBullets) * i;
            let bulletX = this.x + cos(angle) * 10;
            let bulletY = this.y + sin(angle) * 10;
            enemyBullets.push(new EnemyBullet(bulletX, bulletY, angle));
        }
    }
    
    display() {
        fill(0, 0, 255);
        ellipse(this.x, this.y, this.size);
    }
}

class EnemyBullet {
    constructor(x, y, angle) {
        this.x = x;
        this.y = y;
        this.size = 5;
        this.speed = 3;
        this.angle = angle;
    }
    
    update() {
        this.x += cos(this.angle) * this.speed;
        this.y += sin(this.angle) * this.speed;
        let d = dist(this.x, this.y, player.x, player.y);
          if (d < this.size / 2 + player.size / 2) {
              // Collision detected, handle accordingly
              console.log('Player hit by enemy bullet!');
              // Handle player being hit by enemy bullet
          }
    }
    
    display() {
        fill(255, 255, 0);
        ellipse(this.x, this.y, this.size);
    }
}