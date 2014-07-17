(function(root){
  var Tetris = root.Tetris = (root.Tetris || {});

  var Board = Tetris.Board = function (upperLeftx, upperLefty, height, width, game){
    this.upperLefty = upperLefty;
    this.upperLeftx = upperLeftx;
    this.height = height;
    this.width = width;
    this.gameWidth = game.xDim;
    this.gameLength = game.yDim;
    this.squareWidth = width/10
  };

  Board.prototype.renderGrid = function(ctx){
    ctx.clearRect(0, 0, this.gameWidth, this.gameLength);
    ctx.strokeRect(this.upperLeftx, this.upperLefty, this.width, this.height);
    for (i=this.upperLefty; i < this.upperLefty + this.height; i += this.squareWidth) {
       ctx.moveTo(this.upperLeftx,i);
       ctx.lineTo(this.upperLeftx + this.width,i);
       ctx.stroke();
    }
    for (i=this.upperLeftx; i < this.upperLeftx + this.width; i += this.squareWidth) {
       ctx.moveTo(i,this.upperLefty);
       ctx.lineTo(i,this.upperLefty + this.height);
       ctx.stroke();
    }
  };

  Board.prototype.renderScore = function(ctx, score, level){
    ctx.font = "25px Arial"
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.fillText("TETRIS!", this.gameWidth/2, this.upperLefty/2)
    ctx.textAlign = "right";
    ctx.fillText("score: " + score, this.gameWidth*(7/8), this.upperLefty + this.height*.3)
    ctx.fillText("level: " + level, this.gameWidth*(7/8), this.upperLefty + this.height*.36)
  };

  Board.prototype.renderNextPiecePreview = function(ctx, nextPiece){
    ctx.textAlign = "left";
    ctx.fillText("next piece", this.gameWidth*(1/8), this.upperLefty + this.height*.3);
    var that = this;
    if (nextPiece != undefined){
      nextPiece.squares.forEach(function(square){
        //dup next piece and render each square in preview area to avoid
        //changing the actual next piece
        var newSquare = square.dup();
        newSquare.xpos -= that.upperLeftx;
        newSquare.ypos += that.height/2;
        if (newSquare.color == "blue"){
          newSquare.xpos += that.squareWidth; 
          newSquare.ypos += that.squareWidth;
        }
        if (newSquare.color == "pink" || newSquare.color == "yellow"){
          newSquare.xpos -= that.squareWidth;
        } 
        if (newSquare.color == "red" || newSquare.color == "purple" || newSquare.color == "orange"){
          newSquare.ypos -= that.squareWidth;
        }
        
        newSquare.render(ctx);
      });
    };
  };

  Board.prototype.render = function(ctx, score, level, fallingPiece) {
    var board = this;
    var score = (score || 0);
    var level = (level || 1);
    var nextPiece = fallingPiece;
    this.renderGrid(ctx);
    this.renderScore(ctx, score, level);
    this.renderNextPiecePreview(ctx, nextPiece)
  };
  
})(this);