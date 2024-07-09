const board = document.getElementById('gameBoard');
const startButton = document.getElementById('startButton');
const scoreDisplay = document.getElementById('score');
const boardSize = 400;
const tileSize = 20;
let scores = [];
const maxScores = 10; // Maximum number of scores to display
let snake = [{ x: tileSize * 2, y: 0 }];
let direction = { x: 1, y: 0 };
let food = { x: tileSize * 5, y: tileSize * 5 };
let gameInterval;
let score = 0;
const foodImage = '123431.png'; // Path to the food image

document.addEventListener('keydown', changeDirection);
startButton.addEventListener('click', startGame);

function startGame() {
    startButton.textContent = "Playing...";
    startButton.disabled = true;
    snake = [{ x: tileSize * 2, y: 0 }];
    direction = { x: 1, y: 0 };
    placeFood();
    clearInterval(gameInterval); // Clear any existing intervals
    score = 0;
    updateScore();
    gameInterval = setInterval(updateGame, 100);
}

function updateGame() {
    moveSnake();
    checkCollision();
    drawGame();
}

function moveSnake() {
    const newHead = { x: snake[0].x + direction.x * tileSize, y: snake[0].y + direction.y * tileSize };
    snake.unshift(newHead);

    if (newHead.x === food.x && newHead.y === food.y) {
        score++;
        updateScore();
        placeFood();
    } else {
        snake.pop();
    }
}

function checkCollision() {
    const head = snake[0];

    // Check wall collision
    if (head.x < 0 || head.x >= boardSize || head.y < 0 || head.y >= boardSize) {
        endGame();
    }

    // Check self collision
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === head.x && snake[i].y === head.y) {
            endGame();
        }
    }
}

function drawGame() {
    board.innerHTML = '';
    drawElement(food, 'food');
    snake.forEach(segment => drawElement(segment, 'snake'));
}

function drawElement(element, className) {
    const div = document.createElement('div');
    div.style.left = `${element.x}px`;
    div.style.top = `${element.y}px`;
    div.className = className;
    if (className === 'food') {
        div.style.backgroundImage = `url(${foodImage})`;
    }
    board.appendChild(div);
}

function changeDirection(event) {
    const key = event.key;

    if (key === 'ArrowUp' && direction.y === 0) {
        direction = { x: 0, y: -1 };
    } else if (key === 'ArrowDown' && direction.y === 0) {
        direction = { x: 0, y: 1 };
    } else if (key === 'ArrowLeft' && direction.x === 0) {
        direction = { x: -1, y: 0 };
    } else if (key === 'ArrowRight' && direction.x === 0) {
        direction = { x: 1, y: 0 };
    }
}

function placeFood() {
    food.x = Math.floor(Math.random() * (boardSize / tileSize)) * tileSize;
    food.y = Math.floor(Math.random() * (boardSize / tileSize)) * tileSize;
}

function endGame() {
    clearInterval(gameInterval);
    startButton.textContent = "Game Over";
    startButton.disabled = false;

    // Add current score to scores array
    scores.unshift(score);
    if (scores.length > maxScores) {
        scores.pop(); // Remove oldest score if array exceeds maxScores
    }

    updateScoreboard();
}
function updateScoreboard() {
    const scoreList = document.getElementById('scoreList');
    scoreList.innerHTML = ''; // Clear existing scores

    scores.forEach((score, index) => {
        const li = document.createElement('li');
        li.textContent = `Game ${index + 1}: ${score}`;
        scoreList.appendChild(li);
    });
}


function updateScore() {
    scoreDisplay.textContent = `Score: ${score}`;
}
