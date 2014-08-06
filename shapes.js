(function(root){
  var Tetris = root.Tetris = (root.Tetris || {});

   var Shape = Tetris.Shape = function(type, ctx, x, y){
    this.x = x;
    this.y = y;
    this.type = type;
    this.orientation = "down";
    this.squares = Shape[type](x, y, this.orientation);
    this.pivot = this.squares[1];
    this.direction = "down";
    this.render(ctx);
    this.speed = "normal";
  };

  Shape.prototype.render = function(ctx){
    var squares = this.squares 
    if (squares.length == 0){
      return null;
    };
    for(i=0; i<squares.length; i++){
      if(squares[i].ypos >= 50 && squares[i].ypos < 650 && squares[i].xpos >= 250 && squares[i].xpos < 550){ 
        squares[i].render(ctx);
      }
    }
  };

  Shape.randomPiece = function(){
    var pieces = ["plus", "line", "square", "rightL", "leftL", "rightZ", "leftZ"]
    return pieces[Math.floor(Math.random() * pieces.length)];;
  };

  Shape.line = function(x,y){
    y -= 30;
    var squares = [];
    for(var i=0; i<4; i++){
      squares.push(new Tetris.Square(x, y, "blue"));
      y += 30;
    };
    return squares;
  };

  Shape.plus = function(x, y){
    var squares = [];
    for(var i=0; i<3; i++){
      squares.push(new Tetris.Square(x, y, "red"))
      x += 30
    }
    squares.push(new Tetris.Square(x-60, y+30, "red"))
    return squares;
  }

  Shape.square = function(x,y){
    var squares = [];
    for(var i=0; i<2; i++){
      squares.push(new Tetris.Square(x, y, "yellow"))
      squares.push(new Tetris.Square(x+30, y, "yellow"))
      y += 30;
    };
    return squares;
  };

  Shape.rightZ = function(x,y){
    var squares = [];
    for(var i=0; i<2; i++){
      squares.push(new Tetris.Square(x+30, y, "green"))
      squares.push(new Tetris.Square(x, y, "green"))
      y += 30;
      x -= 30;
    }
    return squares;
  };

  Shape.leftZ = function(x,y){
    var squares = [];
    for(var i=0; i<2; i++){
      squares.push(new Tetris.Square(x, y, "pink"))
      squares.push(new Tetris.Square(x+30, y, "pink"))
      y += 30;
      x += 30;
    }
    return squares;
  };

  Shape.rightL = function(x,y){
    var squares = [];
    for(var i=0; i<3; i++){
      squares.push(new Tetris.Square(x, y, "orange"))
      x += 30
    }
    squares.push(new Tetris.Square(x-90, y+30, "orange"))
    return squares;
  };

  Shape.leftL = function(x,y,orientation){
    squares = [];
    for(var i=0; i<3; i++){
      squares.push(new Tetris.Square(x, y, "purple"))
      x += 30
    }  
    squares.push(new Tetris.Square(x-30, y+30, "purple"));
    return squares;
  };

  //makes adjustments when piece collided with the wall
  Shape.prototype.moveOver = function(){
    var min = 250;
    var max = 520;
    for(i=0; i<this.squares.length; i++){
      if (this.squares[i].xpos < min){min = this.squares[i].xpos}
      if (this.squares[i].xpos > max){max = this.squares[i].xpos}  
    };
     for(i=0; i<this.squares.length; i++){
      if (this.squares[i].xpos <= 350){
        this.squares[i].xpos += 250 - min;
      } else {
        this.squares[i].xpos -= max - 520;
      }
      this.direction = "down";
     }
   };

  Shape.prototype.move = function(ctx){
    var dir = this.direction;

    if (this.squares.length == 0){
      return null;
    };

    if (dir == "still"){
      return this
    };
    
    //check if on bottom
    for(i=0; i<this.squares.length; i++){
      if (this.squares[i].ypos >= 620){
          this.direction = "still"
          return false 
        }
      if (this.squares[i].ypos >= 590 && this.speed == "fast"){
        this.speed = "normal";
      }
    }
    
    //check if on edges and moving off board
    for(i=0; i<this.squares.length; i++){
      if ((this.squares[i].xpos >= 520 && this.direction == "right") || 
        (this.squares[i].xpos <= 250 && this.direction == "left")){
        dir = "down";
      }

      if (this.squares[i].xpos >= 520){
        this.moveOver()
        break
      }

      if (this.squares[i].xpos <= 250){
        this.moveOver()
        break
      }
    }

    for(i=0; i<this.squares.length; i++){
      if (dir == "right"){
        this.squares[i].xpos += 30
        this.direction = "down"
      }
      if (dir == "left"){
        this.squares[i].xpos -= 30
        this.direction = "down"
      }
      if (dir == "down"){
        this.squares[i].ypos += 30
      }

      if (this.speed == "fast"){
        this.squares[i].ypos += 30
      } 
    }
    this.speed = "normal";
  }; 

  Shape.prototype.top = function(){
    var min = 1000; //arbitrary high number
    this.squares.forEach(function(square){square.ypos < min ? min = square.ypos : 0})
    return min;
  };

  Shape.prototype.flip = function(){
    var pivot = this.pivot;
    var px = pivot.xpos;
    var py = pivot.ypos;
    this.squares.forEach(function(square){
      if (square != pivot){
        square.ypos = (square.xpos + py - px);
        square.xpos = (px + py - square.ypos);
      }
    })
  };

  Shape.prototype.isCollided = function(otherPiece){
    var thisPiece = this;
    var collision = true; //flag for loop
    var collided = false; //flag for return value
    if (thisPiece == otherPiece){
      return false; 
    }
    //loop detects whether piece is collided and, if so, moves it up
    while (collision == true){
      collision = false
      otherPiece.squares.forEach(function(square){
        thisPiece.squares.forEach(function(thisSquare){
          if (square.isCollided(thisSquare)) {
            collision = true;
            collided = true; 
            otherPiece.moveUp();
          }
        })
      }) 
    }
    return collided;
  };

  Shape.prototype.moveUp = function(){
    this.squares.forEach(function(square){square.ypos -= 30})
  };
  
})(this);