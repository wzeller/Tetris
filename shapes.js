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

  //handles adjustments when collided with the wall
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

  Shape.prototype.bottom = function() {
    var max = this.squares[0].ypos
    var length = this.squares.length; 
    for(i=0; i<length; i++){
      if (this.squares[i].ypos >= max){
        max = this.squares[i].ypos
      }
    }
    return max;
  };

  Shape.prototype.top = function(){
    var min = this.squares[0].ypos;
    var length = this.squares.length; 
    for(i=0; i<length; i++){
      if (this.squares[i].ypos <= min){
        min = this.squares[i].ypos
      }
    }
    return min;
  };

  Shape.prototype.flip = function(){
    var pivot = this.pivot;
    var px = pivot.xpos;
    var py = pivot.ypos;
    this.squares.forEach(function(square){
      if (square != pivot){
        var x1 = square.xpos
        var y1 = square.ypos
        square.ypos = (x1 + py - px);
        square.xpos = (px + py - y1);
      }
    })
  };

  Shape.prototype.isCollided = function(otherPiece){
    var length = this.squares.length;
    var otherLength = otherPiece.squares.length;
    if (this == otherPiece){
      return false; 
    }
    var collision = true; 

    while (collision == true){
      collision = false 
      for (i = 0; i < length; i++){
        for (j = 0; j < otherLength; j++){
          if (this.squares[i].isCollided(otherPiece.squares[j])){
            
            // debugger
              otherPiece.squares.forEach(function(square){
                square.ypos -= 30;
              })
            

            if (this.direction == "right"){
              otherPiece.squares.forEach(function(square){
              square.xpos -= 30;
            })}
            if (this.direction == "left"){
              otherPiece.squares.forEach(function(square){
              square.xpos += 30;
            })}
            collision = true;
            var collided = true;
          }
        }
      }
    }

    if (collided == true){
      return true
    }
    return false 
  };

  Shape.prototype.isOnBottom = function(){
    var length = this.squares.length;
      for (i = 0; i < length; i++){
        if (this.squares[i].ypos >= 620){
          return true
        }
      }
    return false;
  };
  
})(this);