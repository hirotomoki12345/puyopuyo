var socket = io();
var roomID = getRoomIDS();
let UsersCounter = 0;
function getRoomIDS() {
    const urlParams = new URLSearchParams(window.location.search);
    const ids = urlParams.get("ids");
    if (!ids) {
        window.location.href = "login.html";
    }
    console.log(ids);
    return ids;
}
socket.emit("join", roomID);
function sendMessage(message) {
    socket.emit("chat message", { message: message, room: roomID });
}
socket.on("chat message", function (data) {
    console.log(data.from + ": " + data.message);
    if (data.message === "start") {
        startGame();
    }
    if (data.message === "countstart") {
        startUsers();
        sendMessage("count");
    }
    if (data.message === "count") {
        UsersCounter++;
        console.log(`Current UsersCounter: ${UsersCounter}`);
    }
    if (data.message === "lose") {
        UsersCounter--;
        console.log(`Current UsersCounter: ${UsersCounter}`);
    }
});

function sendwhere(message) {
    socket.emit("where", { message: message, room: roomID });
}
// sendMessage("Hello, world!");

function startUsers() {
    setTimeout(function () {
        let count = 3;
        let interval = setInterval(function () {
            console.log(count);
            if (count === 0) {
                clearInterval(interval);
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                ctx.font = "30px Arial";
                ctx.fillStyle = "red";
                ctx.fillText("start!", 90, 200);
                sendMessage("start");
            }
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            ctx.font = "30px Arial";
            ctx.fillStyle = "red";
            ctx.fillText(count, 90, 200);
            count--;
        }, 1000);
    }, 3000);
}
//ここまで

//配置を取得
function getAllPuyosBoard() {
    let allPuyosBoard = Array.from({ length: ROWS }, () =>
        Array(COLS).fill(null),
    );

    // ボードに現在のぷよを追加
    currentPiece.blocks.forEach((block) => {
        allPuyosBoard[block.y][block.x] = block.color;
    });

    // ボードに固定されたぷよを追加
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            if (board[row][col]) {
                allPuyosBoard[row][col] = board[row][col];
            }
        }
    }

    return allPuyosBoard;
}

const randomNum = Math.floor(
    100000000000000000000 + Math.random() * 90000000000000000000,
); // 20桁のランダムな数字を生成

function sendwhere() {
    const message = randomNum.toString() + JSON.stringify(getAllPuyosBoard()); // 20桁の数字とすべてのぷよの配置を含むメッセージを生成
    socket.emit("where", { message: message, room: roomID }); // メッセージを送信
}

//勝利条件
var Allfinish = false;

function checkwin() {
    if (UsersCounter < 2) {
        if (gameOver === false) {
            if (Allfinish === false) {
                alert("You Win!");
                location.reload();
                Allfinish = true;
            }
        }
    }
}

//ここまで
setInterval(sendwhere, 100); //送信

function AllstartUsers() {
    sendMessage("countstart");
}
