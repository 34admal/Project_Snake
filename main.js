let scoreBlock;
let score = 0;

const config = {
  step: 0,
  maxStep: 6,
  sizeCell: 16,
  sizeBerry: 16 / 4,
};

const snake = {
  x: 160,
  y: 160,
  dx: config.sizeCell,
  dy: 0,
  tails: [],
  maxTails: 3,
};

let berry = {
  x: 0,
  y: 0,
};

const eat = new Audio();
eat.src = "sound/eat.mp3";

const game_over = new Audio();
game_over.src = "sound/game_over.mp3";

let canvas = document.querySelector("#game-canvas");
let context = canvas.getContext("2d");
scoreBlock = document.getElementById("windowScore");
drawScore();

function gameLoop() {
  anim = requestAnimationFrame(gameLoop);
  if (++config.step < config.maxStep) {
    return;
  }
  config.step = 0;

  context.clearRect(0, 0, canvas.width, canvas.height);

  drawBerry();
  drawSnake();
}

function drawSnake() {
  snake.x += snake.dx;
  snake.y += snake.dy;

  collisionBorder();

  snake.tails.unshift({ x: snake.x, y: snake.y });

  if (snake.tails.length > snake.maxTails) {
    snake.tails.pop();
  }

  snake.tails.forEach(function (el, index) {
    if (index == 0) {
      context.fillStyle = "#FA0556";
    } else {
      context.fillStyle = "#A00034";
    }
    context.fillRect(el.x, el.y, config.sizeCell, config.sizeCell);

    if (el.x === berry.x && el.y === berry.y) {
      snake.maxTails++;

      eat.play();
      incScore();
      randomPositionBerry();
    }

    for (let i = index + 1; i < snake.tails.length; i++) {
      if (el.x == snake.tails[i].x && el.y == snake.tails[i].y) {
        game_over.play();

        saveScore();

        cancelAnimationFrame(anim);

        refreshGame();
      }
    }
  });
}

function collisionBorder() {
  if (snake.x < 0) {
    snake.x = canvas.width - config.sizeCell;
  } else if (snake.x >= canvas.width) {
    snake.x = 0;
  }

  if (snake.y < 0) {
    snake.y = canvas.height - config.sizeCell;
  } else if (snake.y >= canvas.height) {
    snake.y = 0;
  }
}
function refreshGame() {
  alert(`Your result:${score}`);
  score = 0;
  drawScore();

  snake.x = 160;
  snake.y = 160;
  snake.tails = [];
  snake.maxTails = 3;
  snake.dx = config.sizeCell;
  snake.dy = 0;

  randomPositionBerry();
}
function saveScore() {
  if (localStorage.personsData) {
    const localPersonsData = JSON.parse(localStorage.personsData);

    localPersonsData.push({
      score,
    });

    localStorage["personsData"] = JSON.stringify(localPersonsData);
  } else {
    const personsDataArr = [];
    personsDataArr.push({
      score,
    });

    localStorage["personsData"] = JSON.stringify(personsDataArr);
  }
}
function getArrScores() {
  const arrScores = JSON.parse(localStorage.personsData);
  let result = arrScores.map((x) => x.score);

  let result1 = result.sort(function (a, b) {
    return b - a;
  });
  alert(`
TOP-5:
1 : ${result1[0]}
2 : ${result1[1]}
3 : ${result1[2]}
4 : ${result1[3]}
5 : ${result1[4]}
        `);
}

function drawBerry() {
  context.beginPath();
  context.fillStyle = "#A00034";
  context.arc(
    berry.x + config.sizeCell / 2,
    berry.y + config.sizeCell / 2,
    config.sizeBerry,
    0,
    2 * Math.PI
  );
  context.fill();
}

function randomPositionBerry() {
  berry.x = getRandomInt(0, canvas.width / config.sizeCell) * config.sizeCell;
  berry.y = getRandomInt(0, canvas.height / config.sizeCell) * config.sizeCell;
}

function incScore() {
  score++;
  drawScore();
}

function drawScore() {
  scoreBlock.innerHTML = score;
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

document.addEventListener("keydown", function (e) {
  if (e.code == "ArrowUp") {
    snake.dy = -config.sizeCell;
    snake.dx = 0;
  } else if (e.code == "ArrowLeft") {
    snake.dx = -config.sizeCell;
    snake.dy = 0;
  } else if (e.code == "ArrowDown") {
    snake.dy = config.sizeCell;
    snake.dx = 0;
  } else if (e.code == "ArrowRight") {
    snake.dx = config.sizeCell;
    snake.dy = 0;
  }
});
document.querySelector("#startGame").addEventListener("click", gameLoop);
document.querySelector("#bestRes").addEventListener("click", getArrScores);
document.querySelector("#arrowUP").addEventListener("click", () => {
  snake.dy = -config.sizeCell;
  snake.dx = 0;
});
document.querySelector("#arrowL").addEventListener("click", () => {
  snake.dx = -config.sizeCell;
  snake.dy = 0;
});
document.querySelector("#arrowDWN").addEventListener("click", () => {
  snake.dy = config.sizeCell;
    snake.dx = 0;
});
document.querySelector("#arrowR").addEventListener("click", () => {
  snake.dx = config.sizeCell;
    snake.dy = 0;
});