let scl = 15;
const SPEED = 2;

function setup(){
  createCanvas(300, 600);
  player = new Player();
}

function draw(){
  background(128)
  
  player.update();
  player.show();
  controls();
  fill(255)
}

/*-----------------------------------------------------------
GAME CONTROLS
-------------------------------------------------------------*/

function controls(){
  
  //Movement controls
  if (keyIsDown(UP_ARROW) && player.position.y >= 0){
   player.move(0,-SPEED);
 } else if (keyIsDown(DOWN_ARROW) && player.position.y <= height - scl){
   player.move(0,SPEED);
 } else if (keyIsDown(LEFT_ARROW) && player.position.x >= scl){
   player.move(-SPEED,0);
 } else if (keyIsDown(RIGHT_ARROW) && player.position.x <= width - scl){
   player.move(SPEED,0);
 } 

}

/*-------------------------------------------------------------
PLAYER 
--------------------------------------------------------------*/

class Player {
  constructor(){
    this.cooldown = 2;
    this.position = createVector(100,500);
  }
  
  show(){
    //Player's shape
    triangle(this.position.x, this.position.y,
             this.position.x - scl, this.position.y + scl,
             this.position.x + scl, this.position.y + scl)
  }
  
  update(){
    
  }
  
  //Function for handling movement
  move(x, y){
    if(x == 0){
      this.position.y += y;
    } else if (y == 0){
      this.position.x += x;
    }
  }
}
