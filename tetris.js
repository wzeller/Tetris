(function(root){
  var Tetris = root.Tetris = (root.Tetris || {});

  var Game = Tetris.Game = function(xDim, yDim) {
    this.xDim = xDim;
    this.yDim = yDim;
    this.pieces = []
    this.totalRows = 0;
    this.level = 1;
  };

  Game.prototype.isSquare = function(xpos, ypos){
    var isPiece = false;
<<<<<<< HEAD
=======
    // if (ypos >= 650){
    //   return true
    // }
>>>>>>> a6a85cc7b95f76aba1aba332354b566c0e5441b2
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
            //check all squares for islands
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
    var board = new Tetris.Board(250, 50, 600, 300, game);
    var totalRows = this.totalRows;
    var level = this.level;
    var tempScrollTop = $(window).scrollTop();
   
    var down = 0
    board.render(ctx);
    fallingPieceArray = [new Tetris.Shape(Tetris.Shape.randomPiece(), ctx, 400, -40, "down"), new Tetris.Shape(Tetris.Shape.randomPiece(), ctx, 400, -40, "down")]
    fallingPiece = fallingPieceArray.pop();
    game.pieces.push(fallingPiece);
    
<<<<<<< HEAD
    window.onkeydown = function (event) {
      if (event.keyCode === 32) {
        event.preventDefault();
      }
    };
    
    var gameInterval = this.setVariableInterval(function () {
     // $(window).scrollTop(tempScrollTop); 

=======
    var gameInterval = this.setVariableInterval(function () {
     $(window).scrollTop(tempScrollTop); 
>>>>>>> a6a85cc7b95f76aba1aba332354b566c0e5441b2
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
      
      board.render(ctx, totalRows, game.level, fallingPieceArray[0]);

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
         fallingPieceArray.unshift(new Tetris.Shape(Tetris.Shape.randomPiece(), ctx, 400, -40, "down"))
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
<<<<<<< HEAD
    }, 300);
=======
    }, 200);
>>>>>>> a6a85cc7b95f76aba1aba332354b566c0e5441b2
  }

})(this);