const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const COLS = 6;
const ROWS = 13;
const BLOCK_SIZE = 32;
const COLORS = ["red", "blue", "yellow", "green", "purple"];
const DROP_INTERVAL = 500;
const MOVE_INTERVAL = 50;
const MATCH_ANIMATION_DURATION = 300;

let board = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
let currentPiece = null;
let nextPiece = null;
let score = 0;
let chainCount = 0; // 連鎖数を追跡するための変数
let gameOver = false;
let lastDropTime = 0;
let lastMoveTime = 0;
let isAnimating = false;

document.addEventListener("keydown", handleKeyPress);

function handleKeyPress(event) {
    if (isAnimating) return;

    switch (event.key) {
        case "ArrowLeft":
            if (Date.now() - lastMoveTime > MOVE_INTERVAL) {
                movePiece(-1, 0);
                lastMoveTime = Date.now();
            }
            break;
        case "ArrowRight":
            if (Date.now() - lastMoveTime > MOVE_INTERVAL) {
                movePiece(1, 0);
                lastMoveTime = Date.now();
            }
            break;
        case "ArrowDown":
            if (Date.now() - lastMoveTime > MOVE_INTERVAL) {
                movePiece(0, 1);
                lastMoveTime = Date.now();
            }
            break;
        case "z":
            if (Date.now() - lastMoveTime > MOVE_INTERVAL) {
                rotatePiece(1);
                lastMoveTime = Date.now();
            }
            break;
        case "x":
            if (Date.now() - lastMoveTime > MOVE_INTERVAL) {
                rotatePiece(-1);
                lastMoveTime = Date.now();
            }
            break;
    }
}

let gameRunning = false;

function startGame() {
    if (gameRunning) {
        return;
    }

    gameRunning = true;
    setInterval(checkwin, 1000);

    score = 0;
    chainCount = 0; // 連鎖数をリセット
    gameOver = false;
    board = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
    currentPiece = createPiece();
    nextPiece = createPiece();
    lastDropTime = Date.now();
    lastMoveTime = Date.now();
    gameLoop();
}

function gameLoop() {
    if (gameOver) return;

    const now = Date.now();

    if (!isAnimating && now - lastDropTime > DROP_INTERVAL) {
        if (!movePiece(0, 1)) {
            mergePieceToBoard();
            checkForMatches();
        }
        lastDropTime = now;
    }

    drawBoard();
    drawPiece();
    requestAnimationFrame(gameLoop);
}

function createPiece() {
    const color1 = COLORS[Math.floor(Math.random() * COLORS.length)];
    const color2 = COLORS[Math.floor(Math.random() * COLORS.length)];
    return {
        blocks: [
            { x: Math.floor(COLS / 2), y: 0, color: color1 },
            { x: Math.floor(COLS / 2), y: 1, color: color2 },
        ],
        rotation: 0,
    };
}

function drawBoard() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            if (board[row][col]) {
                drawBlock(col, row, board[row][col]);
            }
        }
    }

    // 連鎖数をキャンバスに表示する
    ctx.fillStyle = "black";
    ctx.font = "16px Arial";
    ctx.fillText(`Chain Count: ${chainCount}`, 10, 20);
    ctx.fillText(`Score: ${score}`, 10, 40);
}

function drawPiece() {
    if (currentPiece) {
        currentPiece.blocks.forEach((block) => {
            drawBlock(block.x, block.y, block.color);
        });
    }
}

function drawBlock(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
    ctx.strokeRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
}

function movePiece(dx, dy) {
    const newBlocks = currentPiece.blocks.map((block) => ({
        x: block.x + dx,
        y: block.y + dy,
        color: block.color,
    }));
    if (isValidMove(newBlocks)) {
        currentPiece.blocks = newBlocks;
        return true;
    } else if (dy > 0) {
        return false;
    }
    return true;
}

function rotatePiece(dir) {
    const newBlocks = currentPiece.blocks.map((block, index) => {
        if (index === 0) return block;
        const relX = block.x - currentPiece.blocks[0].x;
        const relY = block.y - currentPiece.blocks[0].y;
        return {
            x: currentPiece.blocks[0].x + relY * dir,
            y: currentPiece.blocks[0].y - relX * dir,
            color: block.color,
        };
    });

    if (isValidMove(newBlocks)) {
        currentPiece.blocks = newBlocks;
    } else {
        const offset = dir > 0 ? -1 : 1;
        const wallKickBlocks = newBlocks.map((block) => ({
            x: block.x + offset,
            y: block.y,
            color: block.color,
        }));
        if (isValidMove(wallKickBlocks)) {
            currentPiece.blocks = wallKickBlocks;
        }
    }
}

function isValidMove(blocks) {
    return blocks.every((block) => {
        return (
            block.x >= 0 &&
            block.x < COLS &&
            block.y >= 0 &&
            block.y < ROWS &&
            !board[block.y][block.x]
        );
    });
}

function mergePieceToBoard() {
    currentPiece.blocks.forEach((block) => {
        board[block.y][block.x] = block.color;
    });
    dropBlocks();
}

function checkForMatches() {
    let matches = [];
    let visited = Array.from({ length: ROWS }, () => Array(COLS).fill(false));

    function dfs(x, y, color) {
        let stack = [{ x, y }];
        let match = [];
        while (stack.length > 0) {
            let { x, y } = stack.pop();
            if (
                x < 0 ||
                x >= COLS ||
                y < 0 ||
                y >= ROWS ||
                visited[y][x] ||
                board[y][x] !== color
            )
                continue;
            visited[y][x] = true;
            match.push({ x, y });
            stack.push({ x: x + 1, y });
            stack.push({ x: x - 1, y });
            stack.push({ x, y: y + 1 });
            stack.push({ x, y: y - 1 });
        }
        return match;
    }

    for (let y = 0; y < ROWS; y++) {
        for (let x = 0; x < COLS; x++) {
            if (board[y][x] && !visited[y][x]) {
                let match = dfs(x, y, board[y][x]);
                if (match.length >= 4) {
                    matches.push(match);
                }
            }
        }
    }

    if (matches.length > 0) {
        clearMatches(matches);
    } else {
        chainCount = 0; // 連鎖数をリセット
        generateNextPiece();
    }
}

function clearMatches(matches) {
    isAnimating = true;
    let clearedBlocks = new Set();
    matches.forEach((match) => {
        match.forEach(({ x, y }) => {
            clearedBlocks.add(`${x},${y}`);
        });
    });
    clearedBlocks.forEach((key) => {
        let [x, y] = key.split(",").map(Number);
        board[y][x] = null;
    });
    dropBlocks();

    let numClearedBlocks = clearedBlocks.size;
    let additionalScore = numClearedBlocks > 0 ? numClearedBlocks - 1 : 0;
    if (numClearedBlocks > 0) {
        score += additionalScore;
        chainCount++; // 連鎖数を増加
    } else {
        chainCount = 0; // 連鎖が途切れたらリセット
    }

    // スコアと連鎖数を表示する処理を追加
    console.log(`Score: ${score}`);
    console.log(`Chain Count: ${chainCount}`);

    setTimeout(() => {
        isAnimating = false;
        checkForMatches();
    }, MATCH_ANIMATION_DURATION);
}

function dropBlocks() {
    for (let x = 0; x < COLS; x++) {
        for (let y = ROWS - 1; y >= 0; y--) {
            if (board[y][x] === null) {
                for (let k = y - 1; k >= 0; k--) {
                    if (board[k][x] !== null) {
                        board[y][x] = board[k][x];
                        board[k][x] = null;
                        break;
                    }
                }
            }
        }
    }
}

function generateNextPiece() {
    currentPiece = nextPiece;
    nextPiece = createPiece();
    if (!isValidMove(currentPiece.blocks)) {
        gameOver = true;
        console.log("Game Over");
    }
}

function checkwin() {
    for (let i = 0; i < board.length; i++) {
        let count = 0;
        for (let j = 0; j < board[i].length; j++) {
            if (board[i][j] !== null) {
                count++;
            }
        }
        if (count == 6) {
            console.log("win");
            alert("win");
            location.reload();
        }
    }
}
