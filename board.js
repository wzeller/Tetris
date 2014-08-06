(function(root){
  var Tetris = root.Tetris = (root.Tetris || {});

  var Board = Tetris.Board = function (upperLeftx, upperLefty, height, width, game){
    this.upperLefty = upperLefty;
    this.upperLeftx = upperLeftx;
    this.height = height;
    this.width = width;
    this.gameWidth = game.xDim;
    this.gameLength = game.yDim;
    this.squareWidth = width/10;
  };

  Board.prototype.renderGrid = function(ctx){
    ctx.clearRect(0, 0, this.gameWidth, this.gameLength);
    ctx.strokeRect(this.upperLeftx, this.upperLefty, this.width, this.height);
  };

  Board.prototype.renderScore = function(ctx, score, level){
    ctx.font = "25px Arial";
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
    var board = this;
    if (nextPiece != undefined){
      nextPiece.squares.forEach(function(square){
        //dup next piece and render each square in preview area to avoid changing piece
        var newSquare = square.dup();
        newSquare.adjustForDisplay(board);
        newSquare.render(ctx);
      });
    };
  };

  Board.prototype.render = function(ctx, score, level, fallingPiece) {
    this.renderGrid(ctx);
    this.renderScore(ctx, (score || 0), (level || 1));
    this.renderNextPiecePreview(ctx, fallingPiece)
  };
  
})(this);