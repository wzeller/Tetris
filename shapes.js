(function(root){
  var Tetris = root.Tetris = (root.Tetris || {});

  var Shape = Tetris.Shape = function(type, ctx, x, y) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.squares = Shape[type](x, y);
    this.pivot = this.squares[1];
    this.direction = "down";
    this.render(ctx);
    this.speed = "normal";
  };

  Shape.prototype.render = function(ctx) {
    var squares = this.squares 
    if (squares.length == 0) {
      return null;
    };
    for(i=0; i<squares.length; i++) {
      if(squares[i].ypos >= 50 && squares[i].ypos < 650 && squares[i].xpos >= 250 && squares[i].xpos < 550) { 
        squares[i].render(ctx);
      }
    }
  };

  Shape.randomPiece = function() {
    var pieces = ["plus", "line", "square", "rightL", "leftL", "rightZ", "leftZ"]
    return pieces[Math.floor(Math.random() * pieces.length)];;
  };

  Shape.line = function(x,y) {
    y -= 30;
    var squares = [];
    for(var i=0; i<4; i++) {
      squares.push(new Tetris.Square(x, y, "blue"));
      y += 30;
    };
    return squares;
  };

  Shape.plus = function(x,y) {
    var squares = [];
    for(var i=0; i<3; i++) {
      squares.push(new Tetris.Square(x, y, "red"))
      x += 30
    }
    squares.push(new Tetris.Square(x-60, y+30, "red"))
    return squares;
  };

  Shape.square = function(x,y) {
    var squares = [];
    for(var i=0; i<2; i++) {
      squares.push(new Tetris.Square(x, y, "yellow"))
      squares.push(new Tetris.Square(x+30, y, "yellow"))
      y += 30;
    };
    return squares;
  };

  Shape.rightZ = function(x,y) {
    var squares = [];
    for(var i=0; i<2; i++) {
      squares.push(new Tetris.Square(x+30, y, "green"))
      squares.push(new Tetris.Square(x, y, "green"))
      y += 30;
      x -= 30;
    }
    return squares;
  };

  Shape.leftZ = function(x,y) {
    var squares = [];
    for(var i=0; i<2; i++) {
      squares.push(new Tetris.Square(x, y, "pink"))
      squares.push(new Tetris.Square(x+30, y, "pink"))
      y += 30;
      x += 30;
    }
    return squares;
  };

  Shape.rightL = function(x,y) {
    var squares = [];
    for(var i=0; i<3; i++) {
      squares.push(new Tetris.Square(x, y, "orange"))
      x += 30
    }
    squares.push(new Tetris.Square(x-90, y+30, "orange"))
    return squares;
  };

  Shape.leftL = function(x,y) {
    squares = [];
    for(var i=0; i<3; i++) {
      squares.push(new Tetris.Square(x, y, "purple"))
      x += 30
    }  
    squares.push(new Tetris.Square(x-30, y+30, "purple"));
    return squares;
  };

  Shape.prototype.onBottom = function() {
    var shape = this;
    var bottom = false;
    var overlap = 0; //moves up if below the bottom
    this.squares.forEach(function(square) {
      if (square.ypos >= 620) {
        overlap = square.ypos - 620;
        shape.direction = "still";
        bottom = true;
      }
      if (square.ypos >= 590 && shape.speed == "fast") {
        shape.speed = "normal";
      }
    })
    shape.squares.forEach(function(square){square.ypos -= overlap;})
    return bottom;
  };

  Shape.prototype.makeMove = function(dir) {
    var shape = this;
    shape.squares.forEach(function(square) {
      if (dir == "right") {
        square.xpos += 30;
      }
      if (dir == "left"){
        square.xpos -= 30;
      }
      square.ypos += 30; 
    });
    shape.direction = "down"; //return to defaults after move is made
  };

  //adjust pieces moving off the board and return a new direction
  Shape.prototype.offBoard = function(dir) {
    var shape = this;
    var moveShape = false;
    this.squares.forEach(function(square) {
      if ((square.xpos >= 520 && shape.direction == "right") || 
        (square.xpos <= 250 && shape.direction == "left")) {
        dir = "down";
      }
      if (square.xpos >= 520 || square.xpos <= 250) {
        moveShape = true;
      }
    })
    if (moveShape){shape.moveOver()}
    return dir;
  };

  Shape.prototype.move = function(ctx) {
    var dir = this.direction;
    //check if empty, still, or on bottom and, if so, return null
    if (this.squares.length == 0 || dir == "still" || this.onBottom()) {
      return null;
    };
    dir = this.offBoard(dir); //check if on edges and moving off board
    this.makeMove(dir);
  }; 

  Shape.prototype.top = function() {
    var min = 1000; //arbitrary high number
    this.squares.forEach(function(square) {square.ypos < min ? min = square.ypos : 0})
    return min;
  };

  Shape.prototype.flip = function() {
    var pivot = this.pivot;
    var px = pivot.xpos;
    var py = pivot.ypos;
    if (this.type == "square") {return 0;}
    this.squares.forEach(function(square) { //rotate 90 deg right about pivot
      if (square != pivot){
        var x1 = square.xpos;
        var y1 = square.ypos;
        square.ypos = (x1 + py - px);
        square.xpos = (px + py - y1);
      }
    })
  };

  Shape.prototype.isCollided = function(otherPiece) {
    var thisPiece = this;
    var collision = true; //flag for loop
    var collided = false; //flag for return value
    if (thisPiece == otherPiece) {
      return false; 
    }
    //loop detects whether piece is collided and, if so, moves it up
    while (collision == true) {
      collision = false;
      otherPiece.squares.forEach(function(square) {
        thisPiece.squares.forEach(function(thisSquare) {
          if (square.isCollided(thisSquare)) {
            collision = true;
            collided = true; 
            otherPiece.moveUp();
            otherPiece.moveOver(); //in case piece is off the board
          }
        })
      }) 
    }
    return collided;
  };

  Shape.prototype.moveUp = function() {
    this.squares.forEach(function(square){square.ypos -= 30})
  };
  
  //handles adjustments when collided with or over the wall
  Shape.prototype.moveOver = function() {
    var min = 250;
    var max = 520;
    this.squares.forEach(function(square) { //determine extent of overhang
      if (square.xpos < min){min = square.xpos;}
      if (square.xpos > max){max = square.xpos;}  
    });
    if (min !== 250 || max !== 520) { //make corrections if needed
      this.squares.forEach(function(square) {
        square.xpos = square.xpos + (250 - min) - (max - 520);
      })
      this.direction = "down";
    }
  };
})(this);