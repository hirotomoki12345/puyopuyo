let currentPuyoX = 0;
let currentPuyoY = 0;
let currentPuyoColor = 0;
let liftCount = 0; // ターン開始時にリセットすること


function getStageStateAsJson() {
    const stageState = {
        board: [],
        puyoCount: Stage.puyoCount,
    };

    for (let y = 0; y < Config.stageRows; y++) {
        const row = [];
        for (let x = 0; x < Config.stageCols; x++) {
            if (Stage.board[y][x]) {
                row.push({ x, y, puyo: Stage.board[y][x].puyo });
            } else {
                row.push(null);
            }
        }
        stageState.board.push(row);
    }

    return JSON.stringify(stageState);
}

//console.log(getStageStateAsJson());


// 現在のぷよの座標と色を取得する関数
function getCurrentPuyoPositions() {
    if (!window.puyoStatus || typeof window.puyoStatus !== "object") {
        console.error("puyoStatus が定義されていない、または無効な値です。");
        return null;
    }

    const { x, y, dx, dy, centerPuyo, movablePuyo } = window.puyoStatus;

    if (centerPuyo === undefined || movablePuyo === undefined) {
        console.error("centerPuyo または movablePuyo が未定義です。", window.puyoStatus);
        return null;
    }

    return [
        { x, y, color: centerPuyo },  // 中心ぷよ
        { x: x + dx, y: y + dy, color: movablePuyo } // 可動ぷよ
    ];
}

// 関数を実行して確認
//console.log(getCurrentPuyoPositions());




function updateBoardWithCurrentPuyo() {
    const myBoard = JSON.parse(getStageStateAsJson());  // 現在のboardをJSONとして取得

    const currentPuyoPositions = getCurrentPuyoPositions();  // 現在のぷよの位置を取得

    if (!currentPuyoPositions) {
        console.error("ぷよの位置が取得できませんでした。");
        return;
    }

    // 現在のぷよの位置を反映
    currentPuyoPositions.forEach(puyo => {
        const { x, y, color } = puyo;

        if (y >= 0 && y < Config.stageRows && x >= 0 && x < Config.stageCols) {
            myBoard.board[y][x] = { x, y, puyo: color };
        }
    });

    // myBoardに反映された状態を確認
    console.log(JSON.stringify(myBoard));

    return myBoard;
}

// 関数を実行して確認
//updateBoardWithCurrentPuyo();





function placePuyoInRange(startX, startY, endX, endY, color) {
    // 範囲がステージ内かどうか確認
    if (startX < 0 || startX >= Config.stageCols || endX < 0 || endX >= Config.stageCols ||
        startY < 0 || startY >= Config.stageRows || endY < 0 || endY >= Config.stageRows) {
        console.error("無効な範囲です: startX =", startX, ", startY =", startY, ", endX =", endX, ", endY =", endY);
        return;
    }

    // 指定した範囲内でぷよを配置
    for (let y = startY; y <= endY; y++) {
        for (let x = startX; x <= endX; x++) {
            // すでにぷよが配置されている場合
            if (Stage.board[y][x]) {
                console.error("すでにぷよが配置されています: x =", x, ", y =", y);
                continue; // 次の位置に進む
            }

            // ぷよを配置
            Stage.setPuyo(x, y, color);
        }
    }
}
//placePuyoInRange(0,0,5,0,1)
