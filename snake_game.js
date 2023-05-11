// GAME CONSTANTS
const GAME_BLOCKS_WIDTH = 20;
const GAME_BLOCKS_HEIGHT = 20;
const BLOCK_DIM = 30; //px
const FPS = 5;

const backgroundColor = "black";
const snakeColor = "#A020F0";
const foodColor = "#32CD30";

const Direction = {
    Up: "Up",
    Down: "Down",
    Left: "Left",
    Right: "Right",
};

// DOCUMENT ELEMENTS
const canvas = document.getElementById("gameCanvas");
const canvasCtx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");
const snakeHeadImg = document.getElementById("snakeHead");

// GAME VARIABLES
let board = []; // 0: empty, 1: snake, 2: food
let snakeDirection = Direction.Right;
let snakeBody = [];
let score = 0;
let gameOver = false;

const setup = () => {
    // Reset board
    board = [];
    for (let y = 0; y < GAME_BLOCKS_HEIGHT; y++) {
        const row = [];
        for (let x = 0; x < GAME_BLOCKS_WIDTH; x++) {
            row.push(0);
        }
        board.push(row);
    }

    // Recreate Snake
    snakeBody = [
        { x: 5, y: 10 },
        { x: 4, y: 10 },
        { x: 3, y: 10 },
    ];
    board[5][10] = 1;
    board[4][10] = 1;
    board[3][10] = 1;
    snakeDirection = Direction.Right;

    generateNewFood();

    // Reset score
    score = 0;
    gameOver = false;
};

window.addEventListener("keydown", (event) => {
    if (gameOver) {
        if (event.keyCode == 32) {
            setup();
        }
        return;
    }

    if (
        (event.keyCode == 39 || event.keyCode == 68) &&
        snakeDirection != Direction.Left
    ) {
        snakeDirection = Direction.Right;
    } else if (
        (event.keyCode == 38 || event.keyCode == 87) &&
        snakeDirection != Direction.Down
    ) {
        snakeDirection = Direction.Up;
    } else if (
        (event.keyCode == 37 || event.keyCode == 65) &&
        snakeDirection != Direction.Right
    ) {
        snakeDirection = Direction.Left;
    } else if (
        (event.keyCode == 40 || event.keyCode == 83) &&
        snakeDirection != Direction.Up
    ) {
        snakeDirection = Direction.Down;
    }
});

/*
 * DRAWING FUNCTIONS
 */
const draw = () => {
    drawBoard();
    drawElements();
    drawSnakeHead();
    if (gameOver) {
        drawGameOver();
    }
};

const drawRect = (x, y, width, height, color) => {
    canvasCtx.fillStyle = color;
    canvasCtx.fillRect(x, y, width, height);
};

const getRotationAngle = () => {
    switch (snakeDirection) {
        case Direction.Up:
            return 0;
        case Direction.Down:
            return (180 * Math.PI) / 180;
        case Direction.Left:
            return (-90 * Math.PI) / 180;
        case Direction.Right:
            return (90 * Math.PI) / 180;
        default:
            return 0;
    }
};

const getHeadXLocation = () => {
    switch (snakeDirection) {
        case Direction.Up:
            return 0;
        case Direction.Down:
            return 1;
        case Direction.Left:
            return 0;
        case Direction.Right:
            return 1;
        default:
            return 0;
    }
};

const getHeadYLocation = () => {
    switch (snakeDirection) {
        case Direction.Up:
            return 0;
        case Direction.Down:
            return 1;
        case Direction.Left:
            return 1;
        case Direction.Right:
            return 0;
        default:
            return 0;
    }
};

const drawSnakeHead = () => {
    const snakeHead = snakeBody[0];
    const rotationAngle = getRotationAngle();
    const newX = snakeHead.x + getHeadXLocation();
    const newY = snakeHead.y + getHeadYLocation();
    canvasCtx.save();
    canvasCtx.translate(newX * BLOCK_DIM, newY * BLOCK_DIM);
    canvasCtx.rotate(rotationAngle);
    canvasCtx.drawImage(snakeHeadImg, 0, 0, BLOCK_DIM, BLOCK_DIM);
    canvasCtx.restore();
};

const drawBoard = () => {
    drawRect(
        0,
        0,
        GAME_BLOCKS_HEIGHT * BLOCK_DIM,
        GAME_BLOCKS_HEIGHT * BLOCK_DIM,
        backgroundColor
    );
};

const drawElements = () => {
    for (let y = 0; y < GAME_BLOCKS_HEIGHT; y++) {
        let row = board[y];
        for (let x = 0; x < GAME_BLOCKS_WIDTH; x++) {
            switch (row[x]) {
                case 1:
                    drawRect(
                        y * BLOCK_DIM,
                        x * BLOCK_DIM,
                        BLOCK_DIM,
                        BLOCK_DIM,
                        snakeColor
                    );
                    break;
                case 2:
                    drawRect(
                        y * BLOCK_DIM,
                        x * BLOCK_DIM,
                        BLOCK_DIM,
                        BLOCK_DIM,
                        foodColor
                    );
                    break;
                default:
                    break;
            }
        }
    }
};

const drawGameOver = () => {};

/*
 * UPDATE FUNCTIONS
 */
const update = () => {
    if (!gameOver) {
        moveSnake();
    }
};

const moveSnake = () => {
    let snakeHead = snakeBody[0];
    switch (snakeDirection) {
        case Direction.Up:
            if (snakeHead.y == 0 || board[snakeHead.x][snakeHead.y - 1] == 1) {
                gameOver = true;
                return;
            }
            snakeBody.unshift({ x: snakeHead.x, y: snakeHead.y - 1 });
            break;
        case Direction.Down:
            if (
                snakeHead.y == GAME_BLOCKS_HEIGHT - 1 ||
                board[snakeHead.x][snakeHead.y + 1] == 1
            ) {
                gameOver = true;
                return;
            }
            snakeBody.unshift({ x: snakeHead.x, y: snakeHead.y + 1 });
            break;
        case Direction.Left:
            if (snakeHead.x == 0 || board[snakeHead.x - 1][snakeHead.y] == 1) {
                gameOver = true;
                return;
            }
            snakeBody.unshift({ x: snakeHead.x - 1, y: snakeHead.y });
            break;
        case Direction.Right:
            if (
                snakeHead.x == GAME_BLOCKS_WIDTH - 1 ||
                board[snakeHead.x + 1][snakeHead.y] == 1
            ) {
                gameOver = true;
                return;
            }
            snakeBody.unshift({ x: snakeHead.x + 1, y: snakeHead.y });
            break;
        default:
            break;
    }

    if (board[snakeBody[0].x][snakeBody[0].y] == 2) {
        score += 1;
        scoreElement.textContent = "Score: " + score;
        generateNewFood();
    } else {
        let tail = snakeBody.pop();
        board[tail.x][tail.y] = 0;
    }
    board[snakeBody[0].x][snakeBody[0].y] = 1;
};

const checkEat = () => {
    const snakeHead = snakeBody[0];
    if (board[snakeHead.x][snakeHead.y] == 2) {
        return true;
    }
    return false;
};

// const generateNewFood = () => {};

const generateNewFood = () => {
    let foodMade = false;
    while (!foodMade) {
        const x = Math.floor(Math.random() * GAME_BLOCKS_WIDTH);
        const y = Math.floor(Math.random() * GAME_BLOCKS_HEIGHT);
        if (board[x][y] == 0) {
            foodMade = true;
            board[x][y] = 2;
        }
    }
};

const gameLoop = () => {
    setInterval(update, 1000 / FPS);
    setInterval(draw, 1000 / FPS);
};

/*
 * Game proccess
 */
setup();
draw();
gameLoop();
