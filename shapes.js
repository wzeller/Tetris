(function(root){
  var Tetris = root.Tetris = (root.Tetris || {});

  var Shape = Tetris.Shape = function(type, ctx, x, y) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.squares = this.newSquares(x, y, type);
    this.pivot = this.squares[1];
    this.direction = "down";
    this.render(ctx);
    this.speed = "normal";
  };
  
  //all the data to make each shape
  var ShapeMatrix = {
    "line":   [0, -30, 0, 30, 0, 30, 0, 30, "blue"],
    "plus":   [0, 0, 30, 0, 30, 0, -30, 30, "red"],
    "square": [0, 0, 30, 0, -30, 30, 30, 0, "yellow"],
    "rightZ": [30, 0, -30, 0, 0, 30, -30, 0, "green"],
    "leftZ":  [0, 0, 30, 0, 0, 30, 30, 0, "pink"],
    "rightL": [0, 0, 30, 0, 30, 0, -60, 30, "orange"],
    "leftL":  [0, 0, 30, 0, 30, 0, 0, 30, "purple"]
  };

  Shape.prototype.newSquares = function(x, y, type) {
    var j = 0;
    var squares = [];
    var shapeMatrix = ShapeMatrix[type];
    var color = shapeMatrix[shapeMatrix.length-1];
    for(var i=0; i<4; i++) {
      x += shapeMatrix[j];
      y += shapeMatrix[j+1];
      squares.push(new Tetris.Square(x, y, color));
      j += 2;
    };
    return squares;
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

//todo fix correction if also collided below -- possibly make method (is y collided)
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
            if (otherPiece.direction == "down") {otherPiece.moveUp(); otherPiece.moveOver();}
            if (otherPiece.direction == "right") { otherPiece.moveLeft(); otherPiece.moveOver();}
            if (otherPiece.direction == "left") { otherPiece.moveRight(); otherPiece.moveOver();}
          }
        })
      }) 
      // otherPiece.direction = "down";
    }
    return collided;
  };

  Shape.prototype.moveUp = function() {
    this.squares.forEach(function(square){square.ypos -= 30})
  };

  Shape.prototype.moveLeft = function() {
    this.squares.forEach(function(square){square.xpos -= 30})
  };

  Shape.prototype.moveRight = function() {
    this.squares.forEach(function(square){square.xpos += 30})
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