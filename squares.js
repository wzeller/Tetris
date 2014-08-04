(function(root){
  var Tetris = root.Tetris = (root.Tetris || {});

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
    ctx.stroke(); //draw gridlines on square
  };

  Square.prototype.dup = function(){
    var newXPos = this.xpos;
    var newYPos = this.ypos;
    var newColor = this.color;
    var newSquare = new Square(newXPos, newYPos, newColor);
    return newSquare;
  };

  Square.prototype.isCollided = function(otherSquare){
    if (this.xpos == otherSquare.xpos && this.ypos == otherSquare.ypos){
      return true
    } else {
      return false 
    }
  };
  
  //returns an array of all squares adjacent to a given square
  Square.prototype.neighbors = function(game){
    var x = this.xpos;
    var y = this.ypos;
    //duplicate a two-d array with two arrays, one for x coords and one for y coords,
    //of all potential neighbors
    var neighborXCoords = [x+30, x, x-30, x];
    var neighborYCoords = [y, y+30, y, y-30];
    var neighbors = [];
    //iterate through all squares; if they are potential neighbors, add to neighbors array 
    game.allSquares().forEach(function(square){
      var neighborx = square.xpos;
      var neighbory = square.ypos;
      var neighborxIndex = neighborXCoords.indexOf(neighborx); 
      var neighboryIndex = neighborYCoords.indexOf(neighbory); 
    //This is deceptively tricky.  We need both to find pair with duplicate vals, and we need the
    //final test for duplicate entries. E.g., if pot'l x coords were [1,1,2,3] and y were 
    //[2,4,5,6] and the square's coords were (1,5), it would falsely be classified as a 
    //neighbor by merely looking at inclusion in the two arrays.  Moreover, (1,4) would
    //be falsely EXCLUDED if we only checked whether the two indices were the same becuase
    //the first 1 is at index 0, and 4 is at index 1.  For this reason we use the last test,
    //as any pairs would either share one index or the other.
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
  
})(this);