const cells = document.querySelectorAll(".cell") as NodeListOf<HTMLDivElement>;
const info = document.getElementById("info") as HTMLDivElement;
const restart = document.getElementById("restart") as HTMLButtonElement;
const computer = document.getElementById("computer") as HTMLButtonElement;
const players = document.getElementById("players") as HTMLButtonElement;
let board: (typeof x | typeof o | null)[] = Array(9).fill(null);
const x = {
  symbol: "X",
  color: "red",
};
const o = {
  symbol: "O",
  color: "blue",
};
let player: typeof x | typeof o = x;
let moves = 0;
let isComputerPlayer: boolean;
let isMakingMove = false;

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
  info.style.color = player.color;
  if (isComputerPlayer === false)
    return (info.innerText = `Player ${player.symbol}'s turn`);
  if (isComputerPlayer === true && player === x)
    return (info.innerText = `Your turn ${player.symbol}`);
  if (isComputerPlayer === true && player === o)
    return (info.innerText = `${player.symbol} is thinking`);
};

const cellClicked = (e: Event) => {
  const target = e.target as HTMLDivElement;
  const id = parseInt(target.id);
  if (!board[id] && !isMakingMove) {
    moves++;
    board[id] = player;
    target.innerText = player.symbol;
    target.style.color = player.color;
    logic();
  }
};

const logic = () => {
  if (playerWon() !== false) {
    cells.forEach((cell) => cell.removeEventListener("click", cellClicked));
    info.innerText = `Player ${player.symbol} won`;
    info.style.color = player.color;
    return;
  }
  if (moves === 9) {
    info.innerText = "Draw";
    info.style.color = "black";
    return;
  }
  player = player === x ? o : x;
  info.innerText = `Player ${player.symbol}'s move`;
  info.style.color = player.color;

  if (player === o && isComputerPlayer === true) {
    info.innerText = `${player.symbol} is thinking`;
    info.style.color = player.color;
    makeMove();
    return;
  }
  if (player === x && isComputerPlayer === true) {
    info.innerText = `Your turn ${player.symbol}`;
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
    board[move] = player;
    cells[move].innerText = player.symbol;
    cells[move].style.color = player.color;
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
  const winnerClass = player.symbol.toLowerCase() + "-winner";
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
    player = x;
    startGame();
  });
};

restart.addEventListener("click", restartGame);
