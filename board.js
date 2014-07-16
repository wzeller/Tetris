(function(root){
  var Tetris = root.Tetris = (root.Tetris || {});

  var Board = Tetris.Board = function (upperLeftx, upperLefty, width, height){
    this.upperLefty = upperLefty;
    this.upperLeftx = upperLeftx;
    this.height = height;
    this.width = width;
  };

  Board.prototype.render = function(ctx, score, level, fallingPieceArray) {
    var board = this;
    var score = score || 0;
    var level = level;
    var nextPieceArray = (fallingPieceArray || []);
    var nextPiece = nextPieceArray[0]
    ctx.clearRect(0, 0, 800, 800);
    ctx.strokeRect(this.upperLeftx, this.upperLefty, this.height, this.width)
    for (i=50; i < 650; i += 30) {
       ctx.moveTo(250,i);
       ctx.lineTo(550,i);
       ctx.stroke();
    }
    for (i=250; i < 550; i += 30) {
       ctx.moveTo(i,50);
       ctx.lineTo(i,650);
       ctx.stroke();
    }
    ctx.font = "25px Arial"
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    var message = "TETRIS!"
    ctx.fillText(message, 400, 25)
    ctx.textAlign = "right";
    var level = level || 0
    ctx.fillText("score: " + score, 700, 300)
    ctx.fillText("level: " + level, 700, 350)
    ctx.textAlign = "left";
    ctx.fillText("next piece", 100, 230)
    // ctx.strokeText("100", 720, 350)

    if (nextPiece != undefined){
      // debugger

      nextPiece.squares.forEach(function(square){
        var newxpos = (square.xpos - 250);
        var newYpos = (square.ypos + 300);
        var newColor = (square.color);
        if (newColor == "blue"){newYpos += 30}
        var newSquare = new Square(newxpos, newYpos, newColor)
        newSquare.render(ctx)});
    };

  };

  var Square = Tetris.Square = function(xpos, ypos, color) {
    this.xpos = xpos;
    this.ypos = ypos;
    this.color = color; 
  };

  Square.prototype.render = function(ctx) {
    var square = this;
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.moveTo(square.xpos, square.ypos);
    ctx.lineTo(square.xpos+30,square.ypos);
    ctx.lineTo(square.xpos+30,square.ypos+30);
    ctx.lineTo(square.xpos,square.ypos+30);
    ctx.lineTo(square.xpos, square.ypos);
    ctx.fillStyle = square.color;
    ctx.fill();
    ctx.stroke(); //draw gridlines
  }

  var Shape = Tetris.Shape = function(type, ctx, x, y, orientation, direction){
    this.x = x;
    this.y = y;
    this.type = type;
    this.orientation = orientation;
    this.squares = Shape[type](x, y, orientation);
    this.pivot = this.squares[1];
    this.direction = (direction || "down");
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

  Shape.line = function(x,y,orientation){
    squares = [];
    var x = x-30;
    var y = y-30;
    for(i=0; i<4; i++){
      squares.push(new Tetris.Square(x, y, "blue"))
      if (orientation == "right" || orientation == "left"){
        x += 30
      } else {
        y += 30
      };
    };
    return squares;
  };

  Shape.plus = function(x, y, orientation){
    squares = [];
    var startx = x;
    var starty = y;
    if (orientation == "right" || orientation == "left"){
      for(i=0; i<3; i++){
        squares.push(new Tetris.Square(x, y, "red"))
        y += 30
      }
      if (orientation == "right"){
        squares.push(new Tetris.Square(startx+30, starty+30, "red"))
      } else {
        squares.push(new Tetris.Square(startx-30, starty+30, "red"))
      }
    } else {
      y += 30
      x -= 30
      for(i=0; i<3; i++){
        squares.push(new Tetris.Square(x, y, "red"))
        x += 30
      }
      if (orientation == "down"){
        squares.push(new Tetris.Square(startx, starty+60, "red"))
      } else {
        squares.push(new Tetris.Square(startx, starty, "red"))
      }
    }
    return squares;
  }

  Shape.square = function(x,y){
    squares = [];
    var x = x;
    var y = y;
    for(i=0; i<2; i++){
      squares.push(new Tetris.Square(x, y, "yellow"))
      squares.push(new Tetris.Square(x+30, y, "yellow"))
      y += 30;
    };
    return squares;
  };

  Shape.rightZ = function(x,y,orientation){
    squares = [];
    var x = x;
    var y = y;
    if (orientation == "up" || orientation == "down"){
      for(i=0; i<2; i++){
        squares.push(new Tetris.Square(x, y, "green"))
        squares.push(new Tetris.Square(x+30, y, "green"))
        y += 30;
        x -= 30;
      };
    } else {
    for(i=0; i<2; i++){
      squares.push(new Tetris.Square(x, y, "green"))
      squares.push(new Tetris.Square(x, y+30, "green"))
      y += 30;
      x += 30;
    }};

    return squares;
  };

  Shape.leftZ = function(x,y,orientation){
    squares = [];
    var x = x;
    var y = y;
    if (orientation == "up" || orientation == "down"){
      for(i=0; i<2; i++){
        squares.push(new Tetris.Square(x, y, "pink"))
        squares.push(new Tetris.Square(x+30, y, "pink"))
        y += 30;
        x += 30;
      };
    } else {
    for(i=0; i<2; i++){
      squares.push(new Tetris.Square(x, y, "pink"))
      squares.push(new Tetris.Square(x, y+30, "pink"))
      y -= 30;
      x += 30;
    }};

    return squares;
  };

  Shape.rightL = function(x,y,orientation){
    squares = [];
    var startx = x;
    var starty = y;
    if (orientation == "right" || orientation == "left"){
      for(i=0; i<3; i++){
        squares.push(new Tetris.Square(x, y, "orange"))
        y += 30
      }
      if (orientation == "right"){
        squares.push(new Tetris.Square(startx+30, starty+60, "orange"))
      } else {
        squares.push(new Tetris.Square(startx-30, starty, "orange"))
      }
    } else {
      y += 30
      x -= 30
      for(i=0; i<3; i++){
        squares.push(new Tetris.Square(x, y, "orange"))
        x += 30
      }
      if (orientation == "down"){
        squares.push(new Tetris.Square(startx-30, starty+60, "orange"))
      } else {
        squares.push(new Tetris.Square(startx+30, starty, "orange"))
      }
    }
    return squares;
  };

  Shape.leftL = function(x,y,orientation){
    squares = [];
    var startx = x;
    var starty = y;
    if (orientation == "right" || orientation == "left"){
      for(i=0; i<3; i++){
        squares.push(new Tetris.Square(x, y, "purple"))
        y += 30
      }
      if (orientation == "right"){
        squares.push(new Tetris.Square(startx+30, starty, "purple"))
      } else {
        squares.push(new Tetris.Square(startx-30, starty+60, "purple"))
      }
    } else {
      y += 30
      x -= 30
      for(i=0; i<3; i++){
        squares.push(new Tetris.Square(x, y, "purple"))
        x += 30
      }
      if (orientation == "down"){
        squares.push(new Tetris.Square(startx+30, starty+60, "purple"))
      } else {
        squares.push(new Tetris.Square(startx-30, starty, "purple"))
      }
    }
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


  var Game = Tetris.Game = function(xDim, yDim) {
    this.xDim = xDim;
    this.yDim = yDim;
    this.pieces = []
    this.totalRows = 0;
    this.level = 1;
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

  Square.prototype.isCollided = function(otherSquare){
    if (this.xpos == otherSquare.xpos && this.ypos == otherSquare.ypos){
      return true
    } else {
      return false 
    }
  };

  Shape.prototype.isCollided = function(otherPiece){
    var length = this.squares.length;
    var otherLength = otherPiece.squares.length;
    if (this == otherPiece){
      return false 
    }
    var collision = true 

    while (collision == true){
      collision = false 
      for (i = 0; i < length; i++){
        for (j = 0; j < otherLength; j++){
          if (this.squares[i].isCollided(otherPiece.squares[j])){
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

  Game.prototype.isSquare = function(xpos, ypos){
    var isPiece = false;
    if (ypos >= 650){
      return true
    }
    this.pieces.forEach(function(piece){
      piece.squares.forEach(function(square){
        if(xpos == square.xpos && ypos == square.ypos){
          isPiece = true;
        }
      })
    })
    return isPiece;
  };

  Game.prototype.allSquares = function(){
    var squares = [];
    this.pieces.forEach(function(piece){
      piece.squares.forEach(function(square){
        squares.push(square);
      })
    })
    return squares;
  };

  Array.prototype.contains = function(k) {
    for(var i=0; i < this.length; i++){
      if(this[i] == k){
        return true;
      }
    }
    return false;
  };

  Square.prototype.neighbors = function(game){
    var x = this.xpos;
    var y = this.ypos;
    //duplicate a two-d array with two arrays, one for x and one for y coords
    var neighborXCoords = [x+30, x, x-30, x]
    var neighborYCoords = [y, y+30, y, y-30]
    var neighbors = []
  
    //iterate through all squares; if they are potential neighbors, add to neighbors array 
    game.allSquares().forEach(function(square){
      var neighborx = square.xpos;
      var neighbory = square.ypos;
      var neighborxIndex = neighborXCoords.indexOf(neighborx); 
      var neighboryIndex = neighborYCoords.indexOf(neighbory); //need both to find pair with duplicate vals
    //final test is for duplicate entries
      if (neighborXCoords.contains(neighborx) && neighborYCoords.contains(neighbory) 
        && ((neighborYCoords[neighborxIndex] == neighbory) || (neighborXCoords[neighboryIndex] == neighborx))){
          neighbors.push(square)
        }
    })
    return neighbors;
  };
  
  //This function takes a square and returns true if it is an "island" -- i.e., part of a structure that is 
  //not connected on any side -- and false if it is not (i.e., it is part of a group of squares that connect
  //to the bottom).  This function is performed using DFS.
  Square.prototype.isIsland = function(game){
    var group = [];
    group.push(this);
    //encode each x and y coord to a unique value to store in blacklist and avoid repeating
    var blacklist = [this.xpos * 1000 + this.ypos]

    while (group.length > 0){
      //depth-first search is slightly faster than breadth-first because we are testing for connection with bottom
      var last = group.pop();
      if (last.ypos == 620){
        return false
      }
      //get all neighbors from top square in the stack
      var neighbors = last.neighbors(game);
      var end = false; 
      //check against blacklist; if not on it, add to it and to stack of squares; if on it, do not; if
      //square touches bottom, change flag (end) to true, which will return false after loop is over
      neighbors.forEach(function(square){
        var index = square.xpos * 1000 + square.ypos 
        if (square.ypos == 620){
          end = true;
        }
        if (blacklist.indexOf(index) == -1){ //when blacklist.indexOf(index) == -1, square is not in it
          blacklist.push(index);
          group.push(square);
        }
      })
      
      //flag needed because forEach cannot be returned from
      if (end == true){
        return false
      }
    }
    return true
  };

  Array.prototype.remove = function(from, to) {
    var rest = this.slice((to || from) + 1 || this.length);
    this.length = from < 0 ? this.length + from : from;
    return this.push.apply(this, rest);
  };

  Game.prototype.checkForRows = function(){
    var pieces = this.pieces;
    var rowHash = {};
    var total = 0;
    var game = this;
    var isolatedPiecesArray = [];
    var isolatedPieces = true;
    var squares = game.allSquares();
    var completeRows = 0;

    //set up blank hash for each row
    for (i = 620; i > 50; i -= 30){
      rowHash[i] = 0;
    };
    
    //count squares in each row and hash total
    squares.forEach(function(square){
      if (square.ypos > 50){
        rowHash[square.ypos] = rowHash[square.ypos] + 1 
      }
    });

    //remove all rows with 10 elements in it
    Object.keys(rowHash).forEach(function(key){

      if (rowHash[key] >= 10){
        completeRows += 1;
        //first, remove all squares in that row
        pieces.forEach(function(piece){
          for (i = 0; i <= 4; i++){
            if (piece.squares[i] && piece.squares[i].ypos == key){
              piece.squares.remove(i)
              i -= 1
            }
          }
        })

        //every row that is removed above causes all squares above it to move down one
        squares.forEach(function(square){
          if (square.ypos < key){
            square.ypos += 30
          }
        })
        
        //see whether any squares are on "islands" and, if so: group into separate islands,
        //move each island down till it's either collided with another piece or touching
        //the ground, and after all islands are settled, check again for rows to remove.
        var islands = [];
        var floaters = false;//flag to tell whether there are any islands
        var fallingPieces = game.pieces;

        //test each square for whether it's on an island (and not the falling piece)
        fallingPieces.forEach(function(piece){
          piece.squares.forEach(function(square){
            //check all squares for islands?
            if (piece !== fallingPiece){ 
              if(square.isIsland(game)){
                islands.push(square)
                floaters = true;
              }
            }
          })
        })
        
        //if there are islands, continue moving each down by 30 until collided or at bottom
        if (floaters == true){
          var collided = false; //flag to continue until island comes to rest
          while (collided == false){
            //move entire island first
            islands.forEach(function(square){
              square.ypos += 30;
            })
            
            //then check if collided or at the bottom
            islands.forEach(function(square){
              game.allSquares().forEach(function(othersquare){
                //first make sure that the othersquare is not in the islands
                if (islands.indexOf(othersquare) == -1){
                  if (square.isCollided(othersquare) || square.ypos == 620){
                    collided = true;
                  }
                }
              })
            })
          }
          //after island has come to rest, recursively check for rows again to remove new rows
          game.checkForRows();
        }
      }
    })
    return completeRows;
  };

  //timer object that allows interval to be changed from within callback function;
  Game.prototype.setVariableInterval = function(callbackFunc, timing) {
    var variableInterval = {
      interval: timing,
      callback: callbackFunc,
      stopped: false,
      runLoop: function() {
        if (variableInterval.stopped) return;
        var result = variableInterval.callback.call(variableInterval);
        if (typeof result == 'number')
        {
          if (result === 0) return;
          variableInterval.interval = result;
        }
        variableInterval.loop();
      },
      stop: function() {
        this.stopped = true;
        window.clearTimeout(this.timeout);
      },
      start: function() {
        this.stopped = false;
        return this.loop();
      },
      loop: function() {
        this.timeout = window.setTimeout(this.runLoop, this.interval);
        return this;
      }
    };
    return variableInterval.start();
  };

  
  Game.prototype.start = function(canvasEl) {

    alert("Welcome to Tetris. Use the arrow keys to move around and the space bar to rotate the pieces.  Click ok to play!");

    var ctx = canvasEl.getContext("2d");
    var game = this;
    var board = new Tetris.Board(250, 50, 600, 300);
    var totalRows = this.totalRows;
    var speedUp = 0;
    var level = this.level;
   
    var down = 0
    board.render(ctx);
    fallingPieceArray = [new Tetris.Shape(Shape.randomPiece(), ctx, 400, -40, "down"), new Tetris.Shape(Shape.randomPiece(), ctx, 400, -40, "down")]
    fallingPiece = fallingPieceArray.pop();
    game.pieces.push(fallingPiece);
    
    var gameInterval = this.setVariableInterval(function () {
     var newRows = 0;
     var count = 0;
     var interval = this.interval;

      $(document).keydown(function(e){ 

          switch(e.which) {

          case 37: // left
          fallingPiece.direction = "left"
          break;

          case 39: // right
          fallingPiece.direction = "right"
          break;

          case 40: // down
          fallingPiece.direction = "down"
          fallingPiece.speed = "fast"
          break;
     
          case 32: //rotate
          fallingPiece.flip()
          $(document).unbind("keydown") //prevents multiple rotations in single keystroke
          break;

          default: return; // exit this handler for other keys
        }
        e.preventDefault();
      });
      
      board.render(ctx, totalRows, game.level, fallingPieceArray);

      //move and render all pieces
      game.pieces.forEach(function(piece){
        piece.render(ctx);
        piece.move(ctx);
        if (piece.isCollided(fallingPiece)){
          if (fallingPiece.direction = "down"){
            fallingPiece.direction = "still"
          } else {
            fallingPiece.direction = "down"
          }
        }
      })
      
      if (fallingPiece.direction == "still" && fallingPiece.top() <= 0){
          gameInterval.stop(); //terminates the game by ending setInterval
          var answer = confirm("Sorry... You lose.  Play again?")
          if (answer){
            window.location.reload();
          } else {
            ctx.fillStyle = "black";
            ctx.textAlign = "center";
            ctx.font = "bold 38px Helvetica"
            ctx.fillText("Thanks for playing!", 400, 300)
          }
          
      }

      //makes new random piece when all pieces are stationary and checks for complete rows
      if (fallingPiece.direction == "still"){ 
         fallingPieceArray.unshift(new Tetris.Shape(Shape.randomPiece(), ctx, 400, -40, "down"))
         fallingPiece = fallingPieceArray.pop();  
         fallingPiece.speed = "normal";
         game.pieces.push(fallingPiece);
         var turn = game.checkForRows();
         newRows = newRows + turn;
         totalRows += newRows;
         if (totalRows / 10 >= game.level && totalRows != 0 && newRows != 0){
          game.level += 1;
          interval *= .9
         }
      } 

    return interval;
    }, 200);
  }

})(this);