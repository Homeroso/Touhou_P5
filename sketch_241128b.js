let scl = 20, rows, cols;

function setup(){
  createCanvas(400, 400);
  frameRate(10);
  
  rows = floor(height / scl)-1;
  cols = floor(width / scl);
  
  snake = new Snake();
  food = new Food();
  
  score = 0
}

function draw(){
  background(128)
  
  fill(255)
  text("Score: " + str(score), 10, 10);
  
  translate(0, scl)
  
  snake.update();
  snake.show();
  
  food.show();
}

function keyPressed(){
 if (keyCode === UP_ARROW){
   snake.setDirection(0, -1);
 } else if (keyCode === DOWN_ARROW){
   snake.setDirection(0, 1);
 } else if (keyCode === LEFT_ARROW){
   snake.setDirection(-1, 0);
 } else if (keyCode === RIGHT_ARROW){
   snake.setDirection(1, 0);
 } else if (keyCode == 'r'){
   snake = new Snake();
   score = 0;
   food = new Food();
   loop();
 }
}

class Snake {
  
  constructor(){
    this.head = createVector(0, 0);
    this.dir = createVector(1, 0);
    this.length = 0;
    this.tail = [];
  }
  
  update(){
    this.tail.push(createVector(this.head.x, this.head.y));
    
    this.head.add(this.dir);
    this.eat();
    
    if (this.tail.length > this.length){
      this.tail.shift();
    }
    
    if (this.isDeath()){
      noLoop();
    }
  }
  
  show(){
    fill(150, 250, 0)
    rect(this.head.x * scl,
        this.head.y * scl, 20)
  
    for (const pos of this.tail){
      rect(pos.x * scl,
        pos.y * scl,
        scl, scl);
    }
  }
  
  eat(){
    if (this.head.x === food.position.x &&
       this.head.y === food.position.y){
      this.length++;
      food = new Food();
      score += 100;
    }
  }
  
  isDeath(){
    if (this.head.x < 0 || this.head.x >= cols || this.head.y < 0 ||
       this.head.y >= rows){
      return true;
    }
    
    for (const pos of this.tail){
      if (this.head.x === pos.x && 
         this.head.y === pos.y){
        return true;
      }
    }
    
    return false;
  }
  
  setDirection(x, y){
    if (this.dir.x != -x && this.dir.y != -y){
      this.dir = createVector(x, y); 
    }
  }
}

class Food {
  
  constructor(x, y){
    this.position = createVector(
      floor(random(cols)),
      floor(random(rows))
    );
  }
  
  update(){
    
  }
  
  show(){
    fill(150,100,150)
    circle(this.position.x * scl + scl/2,
          this.position.y * scl + scl/2,
          scl)
  }
}
