(function(root){
  var Tetris = root.Tetris = (root.Tetris || {});

  var Game = Tetris.Game = function(xDim, yDim) {
    this.xDim = xDim;
    this.yDim = yDim;
    this.pieces = []
    this.totalRows = 0;
    this.level = 1;
    this.interval = 300;
  };

  Array.prototype.remove = function(from, to) {
    var rest = this.slice((to || from) + 1 || this.length);
    this.length = from < 0 ? this.length + from : from;
    return this.push.apply(this, rest);
  };
  
  Game.prototype.allSquares = function() {
    var squares = [];
    this.pieces.forEach(function(piece) {
      piece.squares.forEach(function(square) {
        squares.push(square);
      })
    })
    return squares;
  };

  Game.prototype.deleteCompletedRows = function() {
    var pieces = this.pieces;
    var squares = this.allSquares();
    var rowHash = {};
    var game = this;
    //set up blank hash for each row
    for (i = 620; i > 50; i -= 30) {
      rowHash[i] = 0;
    };
    
    //count squares in each row and hash total
    squares.forEach(function(square) {
      if (square.ypos > 50) { //exclude fallingPiece above the board
        rowHash[square.ypos] += 1; 
      }
    });

    //remove all rows with 10 elements in it and increment score
    Object.keys(rowHash).forEach(function(key) {
      if (rowHash[key] >= 10) {
        game.totalRows += 1;
        //first, remove all squares in that row
        pieces.forEach(function(piece) {
          for (i = 0; i < 4; i++) {
            if (piece.squares[i] && piece.squares[i].ypos == key) {
              piece.squares.remove(i)
              i -= 1
            }
          }
        })

        //every row that is removed above causes all squares above it to move down one
        squares.forEach(function(square) {
          if (square.ypos < key) {
            square.ypos += 30
          }
        })
      }
    })
  };

  Game.prototype.testForIslands = function(fallingPiece) {
    //see whether any squares are on "islands" and, if so, 
    //move each island down till no islands remain
    var islands = [];
    var floaters = false;//flag to tell whether there are any islands
    var fallingPieces = this.pieces;
    var game = this;

    //test each square for whether it's an island (and not the falling piece)
    fallingPieces.forEach(function(piece) {
      piece.squares.forEach(function(square) {
        //check all squares for islands
        if (piece !== fallingPiece) { 
          if(square.isIsland(game)) {
            islands.push(square);
            floaters = true;
          }
        }
      })
    })

    if (floaters == true) { //if islands exist, keep dropping them until they collide/hit bottom
      var rest = false; //flag to continue until island comes to rest
      var adjust = false; //flag to keep track of islands that collide
      while (rest == false) {
        //move entire island first
        islands.forEach(function(square) {
          square.ypos += 30;
        })

        //then check if collided or at the bottom
        islands.forEach(function(square) {
          game.allSquares().forEach(function(othersquare) {
            //first make sure that the othersquare is not in the islands array
            if (islands.indexOf(othersquare) == -1) {
              if (square.isCollided(othersquare) || square.ypos == 620) { 
                rest = true;
              }
              if (square.isCollided(othersquare)) {adjust = true;}
            }
          })
        })
        if (adjust == true) { //if collided, move all pieces up one square
          islands.forEach(function(square) {
            square.ypos -= 30;
          })
        }
      }
      game.deleteCompletedRows();       //delete any new rows that may have formed
      game.testForIslands(fallingPiece); //recurse until all islands are at rest
    }
  };                                   
  
  Game.prototype.checkForRows = function(fallingPiece) {
    var game = this;
    game.deleteCompletedRows();
    game.testForIslands(fallingPiece);
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

  Game.prototype.setKeyBindings = function(event, fallingPiece) {
    window.onkeydown = function(event) {
        event.preventDefault();
    };
    $(document).keydown(function(event) { 
      switch(event.which) {

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
    });
  };

  Game.prototype.renderPieces = function(fallingPiece, ctx) {
    this.pieces.forEach(function(piece) {
      piece.render(ctx);
    })
  };

  Game.prototype.checkForCollisions = function(fallingPiece) {
    var collided = false;
    this.pieces.forEach(function(piece) {
      if (piece.isCollided(fallingPiece)) {
        collided = true;
        fallingPiece.direction = "down" ? fallingPiece.direction = "still" : 
          fallingPiece.direction = "down" //handles sideways collisions
      }
    })
    return collided;
  };

  Game.prototype.checkIfLost = function(fallingPiece, gameInterval, ctx) {
   if (fallingPiece.direction == "still" && fallingPiece.top() <= 0) {
      gameInterval.stop(); //terminates the game by ending variableInterval
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
  };

  Game.prototype.makeNewPiece = function(fallingPiece, fallingPieceArray, ctx) {
    $(document).unbind("keydown") //remove keybindings for old fallingpiece
     fallingPieceArray.unshift(new Tetris.Shape(Tetris.Shape.randomPiece(), ctx, 400, -40, "down"))
     fallingPiece = fallingPieceArray.pop();  
     fallingPiece.speed = "normal";
     this.pieces.push(fallingPiece);
     return fallingPiece;
  };

  Game.prototype.updateScore = function(fallingPiece) {
    this.checkForRows(fallingPiece); //this checks for completed rows and updates totalrows
    if (this.totalRows / 10 >= this.level && this.totalRows != 0) {
      this.level += 1;
      this.interval *= .9;
    }
  };

  Game.prototype.start = function(canvasEl) {
    //set up game and declare variables
    alert("Welcome to Tetris. Use the arrow keys to move around and the space bar to rotate the pieces.  Click ok to play!");
    var ctx = canvasEl.getContext("2d");
    var game = this;
    var board = new Tetris.Board(250, 50, 600, 300, game);
    var totalRows = game.totalRows; //completed rows
    var level = game.level;
    var fallingPieceArray = [new Tetris.Shape(Tetris.Shape.randomPiece(), ctx, 400, -40), new Tetris.Shape(Tetris.Shape.randomPiece(), ctx, 400, -40)]
    var fallingPiece = fallingPieceArray.pop();
    game.pieces.push(fallingPiece);
    board.render(ctx);

    //loop that continues until the game is over; setVariableInterval is setInterval with 
    //the ability to change interval from within, which is used as levels increase
    var gameInterval = game.setVariableInterval(function () {
      board.render(ctx, game.totalRows, game.level, fallingPieceArray[0]);
      game.setKeyBindings(event, fallingPiece);
      //move falling piece (twice if "fast") and render all pieces
      fallingPiece.move();
      if (fallingPiece.speed == "fast") {
        var collided = game.checkForCollisions(fallingPiece);
        if (collided == false) {fallingPiece.move()}; 
        fallingPiece.speed = "normal";
      }
      game.checkForCollisions(fallingPiece);
      game.renderPieces(fallingPiece, ctx);
      game.checkIfLost(fallingPiece, gameInterval, ctx); //end game if lost
      //make piece if falling piece at rest, check for completed rows, and update score
      if (fallingPiece.direction == "still") { 
         game.updateScore(fallingPiece); //check for completed rows and change score and interval
         fallingPiece = game.makeNewPiece(fallingPiece, fallingPieceArray, ctx); 
      } 
    return game.interval;
    }, 300);
  }

})(this);