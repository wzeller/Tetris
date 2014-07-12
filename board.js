(function(root){
  var Tetris = root.Tetris = (root.Tetris || {});

  var Board = Tetris.Board = function (upperLeftx, upperLefty, width, height){
    this.upperLefty = upperLefty;
    this.upperLeftx = upperLeftx;
    this.height = height;
    this.width = width;
  };

  Board.prototype.render = function(ctx) {
    var board = this;
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
  }

  Shape.line = function(x,y,orientation){
    squares = [];
    var x = x;
    var y = y;
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
    }
  }; 

  var Game = Tetris.Game = function(xDim, yDim) {
    this.xDim = xDim;
    this.yDim = yDim;
    this.pieces = []
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

  Shape.ORIENTATIONS = {
    "up" : "right",
    "right" : "down",
    "down": "left",
    "left": "up"
  };

  Shape.prototype.flip = function(){
    var pivot = this.pivot;
    var px = pivot.xpos;
    var py = pivot.ypos;
    this.squares.forEach(function(square){
      if (square == pivot){
        console.log("pivot")
      } else {
      var x1 = square.xpos
      var y1 = square.ypos
      square.ypos = (x1 + py - px);
      square.xpos = (px + py - y1);
      }
    })
  };

  // Shape.prototype.minusRow = function() {
  //   this.direction = "down";
  //   var bottom = this.bottom();
  //   var length = this.squares.length; 
  //   if (length == 0){
  //     return null;
  //   }
  //   for(i=length-1; i >= 0; i--){
  //     if (length == 0){
  //       return null;
  //     }
  //     if (this.squares[i].ypos >= bottom){
  //       this.squares.splice(i,1)
  //       length -= 1
  //     }
  //   }
  // };

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

  // Array.prototype.remove = function(from, to) {
  //   var rest = this.slice((to || from) + 1 || this.length);
  //   this.length = from < 0 ? this.length + from : from;
  //   return this.push.apply(this, rest);
  // };

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
    //allows no blacklist; if one is passed, it is of the format [[x1, x2, ... xn], [y1, y2, ... yn]], with
    //each pair being a coordinate that has already been checked)
    // var blacklist = (blacklist || [[0],[0]])
    // var blacklistXCoords = blacklist[0]
    // var blacklistYCoords = blacklist[1]

    //iterate through all squares; if they are potential neighbors, check against blacklist; if not on it, 
    //add to neighbors array 
    game.allSquares().forEach(function(square){
      var neighborx = square.xpos;
      var neighbory = square.ypos;
      var neighborxIndex = neighborXCoords.indexOf(neighborx); 
      var neighboryIndex = neighborYCoords.indexOf(neighbory); //need both to find pair with duplicate vals
      // if (blacklistXCoords.contains(neighborx)){
      //   var blacklistxIndex = blacklistXCoords.indexOf(neighborx)
      // };
      // if (blacklistYCoords.contains(neighbory)){
      //   var blacklistyIndex = blacklistYCoords.indexOf(neighbory)
      // };

      //first test if x and y coords are both in potential neighbor coords and then if they have the same
      //index (need both tests because of duplicates)
      if (neighborXCoords.contains(neighborx) && neighborYCoords.contains(neighbory) 
        && ((neighborYCoords[neighborxIndex] == neighbory) || (neighborXCoords[neighboryIndex] == neighborx))){
    
        // //test if either number is NOT in blacklist or, if both are, they are not the same index
        // if (blacklistXCoords.indexOf(neighborx) == -1 || blacklistYCoords.indexOf(neighbory) == -1 || 
        //   ((blacklistYCoords[blacklistxIndex] !== neighbory) && (blacklistXCoords[blacklistyIndex] !== neighborx))){
            neighbors.push(square)
          // }
        }
    })
    return neighbors;
  };
  
  Square.prototype.isIsland = function(game){
    var group = [];
    group.push(this);
    // var xblacklist = [this.xpos];
    // var yblacklist = [this.ypos];
    var blacklist = [this.xpos * 1000 + this.ypos]
    while (group.length > 0){
      var last = group.shift();
      if (last.ypos == 620){
        return false
      }
      var neighbors = last.neighbors(game);

      // if (neighbors.length == 0){
      //   group.pop()
      // } else {
      // var newNeighbors = 0;
      var end = false; 
      neighbors.forEach(function(square){
        // var xBlacklistIndex = xblacklist.indexOf(square.xpos)
        // var yBlacklistIndex = yblacklist.indexOf(square.ypos)
        var index = square.xpos * 1000 + square.ypos 

        if (square.ypos == 620){
          end = true;
        }
        //checks to make sure the pairing of square.xpos, square.ypos is not in blacklist before adding to group
        // debugger;
        if (blacklist.indexOf(index) == -1){
        
          blacklist.push(index);
          group.push(square);
          // newNeighbors += 1;
        }
      })
      // if (neighbors.length == 0){
      //   group.pop()
      // }

      if (end == true){
        return false
      }
        console.log(group.length)
    }
    
    return true
  };

  Array.prototype.remove = function(from, to) {
    var rest = this.slice((to || from) + 1 || this.length);
    this.length = from < 0 ? this.length + from : from;
    return this.push.apply(this, rest);
  };

  Game.prototype.checkForRows = function(islands){
    var pieces = this.pieces;
    var rowHash = {};
    var total = 0;
    var game = this;
    var isolatedPiecesArray = [];
    var isolatedPieces = true;
    var islands = (islands || []);
    var squares = game.allSquares();

    //set up blank hash for each row
    for (i = 620; i > 50; i -= 30){
      rowHash[i] = 0;
    };
    
    //count squares in each row and hash total
    // pieces.forEach(function(piece){
    squares.forEach(function(square){
      if (square.ypos > 50){
        rowHash[square.ypos] = rowHash[square.ypos] + 1 
      }
    });
    // })

    //remove all rows with 10 elements in it
    Object.keys(rowHash).forEach(function(key){
      if (rowHash[key] == 10){
         pieces.forEach(function(piece){
          for (i = 0; i <= 4; i++){
            if (piece.squares[i] && piece.squares[i].ypos == key){
              piece.squares.remove(i)
              i -= 1
            }
          }
        })

        //every row that is removed above causes all squares above it to move down one
        // var isolatedPieces = true;
        squares.forEach(function(square){
          if (square.ypos < key){
            square.ypos += 30
          }
        })
        
        var floaters = true;

        // debugger;
        // while (floaters == true){
          
          // while (floaters == true){
            var islands = [];
            floaters = false
            var fallingPieces = game.pieces;
            fallingPieces.forEach(function(piece){
              piece.squares.forEach(function(square){
                if (square.ypos <= key && piece !== fallingPiece){ 
                  
            
                    if(square.isIsland(game)){
                      // console.log(fallingPiece)
  
                      // console.log("dropper")
                      // console.log(piece)
                      islands.push(square)
                      // fallingPieces.remove(square)
                      // square.ypos += 30;
                      floaters = true;
                    }
                  }
                  // game.checkForRows();
                })
              })
              console.log(islands);
              if (floaters == true){
                var collided = false;
                while (collided == false){
                  islands.forEach(function(square){
                    square.ypos += 30;
                    console.log(square)
                    //continue falling until isCollided with other square then clear from islands
                  })

                  islands.forEach(function(square){
                    game.allSquares().forEach(function(othersquare){
                      if (square.isCollided(othersquare) || square.ypos == 620){
                        collided = true;
                        
                      }
                    })
                  })
                }

                // debugger
                game.checkForRows();
                //need to clear board if falling piece completes row; how to wait?
               
                  
                
             }
          


      //   while (isolatedPieces){

      //     isolatedPieces = false;
      //     game.allSquares().forEach(function(square){
      //         if (square.isIsland(game) && square.ypos > 70){
      //           debugger
      //           console.log("in")
      //           console.log(square)
      //           console.log(key)
      //           console.log(square.isIsland(game));
      //           isolatedPieces = true;
               
      //           isolatedPiecesArray.push(square);
      //           console.log(square) 
      //         } else {
      //         if (square.ypos < key && piece !== fallingPiece){
      //           console.log(game.isSquare(square.xpos, square.ypos+30))
      //           while (game.isSquare(square.xpos, square.ypos+30) == false){
      //             square.ypos += 30
      //           }
      //         }
      //         console.log("out")
      //         console.log(square)
      //         }
      //     })
      //   }
      //   isolatedPiecesArray.forEach(function(square){
      //     square.ypos += 30;
      //   })
      //   console.log(isolatedPiecesArray);
      //   isolatedPiecesArray = [];
      }

    })
    
  };
  

  Game.prototype.start = function(canvasEl) {

    var ctx = canvasEl.getContext("2d");
    var game = this;
    var board = new Tetris.Board(250, 50, 600, 300);
    board.render(ctx);
    fallingPiece = new Tetris.Shape(Shape.randomPiece(), ctx, 400, -40, "down");
    game.pieces.push(fallingPiece);
   
    var gameInterval = window.setInterval(function () {

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
          break;

          case 32: //rotate
          fallingPiece.flip()
          $(document).unbind("keydown") //prevents multiple rotations in single keystroke
          $(document).keyup(function(e){
            $(document).keydown(function(e){fallingPiece.flip()}) //rebinds space so it
                                                                  //works on the next stroke
          })
          break;

          default: return; // exit this handler for other keys
        }
        e.preventDefault();
      });

      $(document).keyup(function(e) {
        $(document).bind("keydown")
      });
      
      board.render(ctx);
      // var moving = false;
      
      game.pieces.forEach(function(piece){
          // if (piece.direction !== "still"){
          //   moving = true;
          // }


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
      
      // game.pieces.forEach(function(piece){
      
      // })

      if (fallingPiece.direction == "still" && fallingPiece.top() <= 0)
        {
          console.log("you lose")
          clearInterval(gameInterval); //terminates the game by ending setInterval
        }
   
      if (fallingPiece.direction == "still"){   
         fallingPiece = new Tetris.Shape(Shape.randomPiece(), ctx, 400, -40, "down");
         game.pieces.push(fallingPiece);
         game.checkForRows();
      } //makes new random piece when all pieces are stationary
    }, 200);
  }

})(this);