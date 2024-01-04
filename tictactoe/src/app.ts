interface Player {
  symbol: string;
  color: string;
}

const cells = document.querySelectorAll<HTMLElement>(".cell");
const info: HTMLElement = document.getElementById("info");
const restart: HTMLElement = document.getElementById("restart");
const computer: HTMLElement = document.getElementById("computer");
const players: HTMLElement = document.getElementById("players");
let board: (Player | null)[] = Array(9).fill(null);

const x: Player = {
  symbol: "X",
  color: "red",
};
const o: Player = {
  symbol: "O",
  color: "blue",
};

let currentPlayer = x;
let moves: number = 0;
let isComputerPlayer: boolean;
let isMakingMove: boolean = false;

const winCombinations: number[][] = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const computerGame = () => {
  if (isMakingMove === false) {
    isComputerPlayer = true;
    computer.classList.add("header_item_active");
    players.classList.remove("header_item_active");
    restartGame();
    startGame();
  }
};

const playerGame = () => {
  if (isMakingMove === false) {
    isComputerPlayer = false;
    players.classList.add("header_item_active");
    computer.classList.remove("header_item_active");
    restartGame();
    startGame();
  }
};

const startGame = () => {
  cells.forEach((cell) => cell.addEventListener("click", cellClicked));
  info.style.color = currentPlayer.color;
  if (isComputerPlayer === false)
    return (info.innerText = `Player ${currentPlayer.symbol}'s turn`);
  if (isComputerPlayer === true && currentPlayer === x)
    return (info.innerText = `Your turn ${currentPlayer.symbol}`);
  if (isComputerPlayer === true && currentPlayer === o)
    return (info.innerText = `${currentPlayer.symbol} is thinking`);
};

const cellClicked = (e: Event) => {
  const target = <HTMLElement>e.target;
  const id = parseInt(target.id);
  if (!board[id] && !isMakingMove) {
    moves++;
    board[id] = currentPlayer;
    target.innerText = currentPlayer.symbol;
    target.style.color = currentPlayer.color;
    logic();
  }
};

const logic = () => {
  if (playerWon() !== false) {
    cells.forEach((cell) => cell.removeEventListener("click", cellClicked));
    info.innerText = `Player ${currentPlayer.symbol} won`;
    info.style.color = currentPlayer.color;
    return;
  }
  if (moves === 9) {
    info.innerText = "Draw";
    info.style.color = "black";
    return;
  }
  currentPlayer = currentPlayer === x ? o : x;
  info.innerText = `Player ${currentPlayer.symbol}'s move`;
  info.style.color = currentPlayer.color;

  if (currentPlayer === o && isComputerPlayer === true) {
    info.innerText = `${currentPlayer.symbol} is thinking`;
    info.style.color = currentPlayer.color;
    makeMove();
    return;
  }
  if (currentPlayer === x && isComputerPlayer === true) {
    info.innerText = `Your turn ${currentPlayer.symbol}`;
    return;
  }
};

const makeMove = () => {
  isMakingMove = true;
  setTimeout(() => {
    let emptyCells = [];
    for (let i = 0; i < board.length; i++) {
      if (!board[i]) emptyCells.push(i);
    }
    let randomIndex = Math.floor(Math.random() * emptyCells.length);
    let move = emptyCells[randomIndex];
    board[move] = currentPlayer;
    cells[move].innerText = currentPlayer.symbol;
    cells[move].style.color = currentPlayer.color;
    moves++;
    isMakingMove = false;
    logic();
  }, 1000);
};

const playerWon = () => {
  for (const combinations of winCombinations) {
    let [a, b, c] = combinations;
    if (board[a] && board[a] === board[b] && board[b] === board[c]) {
      paintCells(a, b, c);
      return [a, b, c];
    }
  }
  return false;
};

const paintCells = (a: number, b: number, c: number) => {
  const winnerClass = currentPlayer.symbol.toLowerCase() + "-winner";
  cells[a].classList.add(winnerClass);
  cells[b].classList.add(winnerClass);
  cells[c].classList.add(winnerClass);
};

const restartGame = () => {
  if (isMakingMove === false) restartBody();
};

const restartBody = () => {
  board.fill(null);
  cells.forEach((cell) => {
    cell.innerText = "";
    cell.classList.remove("x-winner");
    cell.classList.remove("o-winner");
    moves = 0;
    currentPlayer = x;
    startGame();
  });
};

restart.addEventListener("click", restartGame);
