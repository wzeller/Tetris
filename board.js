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
    var level = level || 1;
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
    ctx.fillText("TETRIS!", 400, 25)
    ctx.textAlign = "right";
    ctx.fillText("score: " + score, 700, 230)
    ctx.fillText("level: " + level, 700, 280)
    ctx.textAlign = "left";
    ctx.fillText("next piece", 100, 230)

    if (nextPiece != undefined){
      nextPiece.squares.forEach(function(square){
        //dup next piece and render each square to avoid
        //changing the actual next piece
        var newxpos = (square.xpos - 250);
        var newYpos = (square.ypos + 300);
        var newColor = (square.color);
        if (newColor == "blue"){newYpos += 30; newxpos += 30}
        if (newColor == "pink"){newxpos -= 30}
        if (newColor == "yellow"){newxpos -= 30}  
        if (newColor == "red" || newColor == "purple" || newColor == "orange"){newYpos -= 30}
        var newSquare = new Tetris.Square(newxpos, newYpos, newColor)
        newSquare.render(ctx)});
    };

  };
})(this);