/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */



class Game {
  constructor(width=7, height=6, player1, player2, p2type) {
    this.width = width;
    this.height = height;
    this.p2type = p2type;
    this.players = [player1, player2];
    this.currPlayer = player1;
    this.board=[];
    this.makeBoard();
    this.makeHtmlBoard();
    this.gameOver=false;
  }

  makeBoard() {
    for (let y = 0; y < this.height; y++) {
      this.board.push(Array.from({ length: this.width }));
    }
  }

  makeHtmlBoard() {
    const board = document.getElementById('board');

    this.handleGameClick = this.handleClick.bind(this);
  
    // make column tops (clickable area for adding a piece to that column)
    const top = document.createElement('tr');
    top.setAttribute('id', 'column-top');
    /* add code to change hover div to circle and the right color based on player*/


    top.addEventListener('click', this.handleGameClick);
  
    for (let x = 0; x < this.width; x++) {
      const headCell = document.createElement('td');
      headCell.setAttribute('id', x);
      top.append(headCell);
    }
  
    board.append(top);
  
    // make main part of board
    for (let y = 0; y < this.height; y++) {
      const row = document.createElement('tr');
  
      for (let x = 0; x < this.width; x++) {
        const cell = document.createElement('td');
        cell.setAttribute('id', `${y}-${x}`);
        row.append(cell);
      }
  
      board.append(row);
    }
  }

  findSpotForCol(x) {
    for (let y = this.height - 1; y >= 0; y--) {
      if (!this.board[y][x]) {
        return y;
      }
    }
    return null;
  }

  placeInTable(y, x) {
    const piece = document.createElement('div');
    piece.classList.add('piece');
    piece.classList.add('fallingPiece');
    piece.style.backgroundColor = this.currPlayer.playerColor;
    piece.style.top = -50 * (y + 2);
  
    const spot = document.getElementById(`${y}-${x}`);
    spot.append(piece);
  }

  endGame(msg) {
    alert(msg);
  }

  handleClick(evt) {
    // get x from ID of clicked cell
    if (this.gameOver) {
      return;
    }

    let x=null;

    const getComputerX = () => {
      let x=null;
      let randomXIsValid = null;
      while (!randomXIsValid) {
        x = this.players[1].pickRandomColumn();
        randomXIsValid = this.findSpotForCol(this.players[1].pickRandomColumn());
        }
        return x;
    };

    if (this.currPlayer===this.players[1] && this.players[1].p2Type==='computer') {
        x = getComputerX();
        } else {
      x = +evt.target.id;
    }
  
    // get next spot in column (if none, ignore click)
    const y = this.findSpotForCol(x);
    if (y === null) {
      return;
    }
  
    // place piece in board and add to HTML table
    this.board[y][x] = this.currPlayer;
    this.placeInTable(y, x);
    
    // check for win
    if (this.checkForWin()) {
      return this.endGame(`${this.currPlayer.playerColor} player won!`);
    }
    
    // check for tie
    if (this.board.every(row => row.every(cell => cell))) {
      return this.endGame('Tie!');
    }
      
    // switch players
    this.currPlayer = this.currPlayer === this.players[0] ? this.players[1]: this.players[0];
  }

  checkForWin() {
    
    const _win = (cells) =>
      // Check four cells to see if they're all color of current player
      //  - cells: list of four (y, x) cells
      //  - returns true if all are legal coordinates & all match currPlayer

      cells.every(
        
        ([y, x]) =>
          y >= 0 &&
          y < this.height &&
          x >= 0 &&
          x < this.width &&
          this.board[y][x] === this.currPlayer
      );
    


    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        // get "check list" of 4 cells (starting here) for each of the different
        // ways to win
        const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
        const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
        const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
        const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];
  
        // find winner (only checking each win-possibility as needed)
        if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
          this.gameOver = true;
          return true;
        }
      }
    }
  }


/*END OF GAME CLASS*/
}

class Player {
  constructor(playerColor) {
    this.playerColor = playerColor;
  }
}

class ComputerPlayer extends Player {
  constructor(playerColor) {
    super(playerColor);
    this.p2Type='computer';
  }

  pickRandomColumn() {
    return Math.floor(Math.random()*7);   // need to make the *7 dynamic to adjust to different board sizes
  }
}

const startButton = document.querySelector('#startBtn');
startButton.addEventListener('click',() =>{
  const p1 = new Player(document.querySelector("#p1color").value);
  let p2 = {};
  
  const p2type = document.querySelector('#p2type').value;


   if (p2type==="human") {
      p2 = new Player(document.querySelector("#p2color").value);

  } else {
      // const p2 = new ComputerPlayer(document.querySelector("#p2color").value,'computer');
      p2 = new ComputerPlayer(document.querySelector("#p2color").value);
      alert('When playing against the computer, click a random top-row square on the computer\'s turn to make it place a piece');
  }


  
  document.querySelector('#game #board').innerHTML='';
  new Game(7,6, p1, p2, p2type);
});

/*function startGame() {
  const p1 = new Player(document.querySelector("#p1color").value);
  const p2 = new Player(document.querySelector("#p2color").value);
  document.querySelector('#game #board').innerHTML='';
  new Game(7,6, p1, p2);
}*/

