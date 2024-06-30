const puyoColors = {
    blue: "#0000FF",
    purple: "#800080",
    green: "#008000",
    red: "#FF0000",
    yellow: "#FFFF00",
    // 他の色も追加できます
};

socket.on("where", function (data) {
    const rawData = data.message;
    console.log("Received data:", rawData);

    // データを解析してユーザーIDと配置情報を分ける
    const userIdMatch = rawData.match(/^\d+/);
    if (!userIdMatch) {
        console.error("Invalid data format: cannot find userId", rawData);
        return;
    }

    const userId = userIdMatch[0];
    const positionsData = rawData.slice(userId.length);

    let puyoPositions;
    try {
        puyoPositions = JSON.parse(positionsData);
    } catch (e) {
        console.error(
            "Invalid data format: cannot parse positions data",
            positionsData,
        );
        return;
    }

    console.log(`${userId}:`, puyoPositions);

    // 新しいCanvasを作成する関数
    function createCanvas(id, width, height) {
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        canvas.id = `canvas-${id}`;
        document.getElementById("canvasContainer").appendChild(canvas);
        return canvas.getContext("2d");
    }

    // 既存のCanvasを取得するか新しいCanvasを作成する
    let canvas = document.getElementById(`canvas-${userId}`);
    let ctx;
    const blockSize = 40; // ぷよぷよのサイズ
    const canvasWidth = puyoPositions[0].length * blockSize;
    const canvasHeight = puyoPositions.length * blockSize;

    if (!canvas) {
        ctx = createCanvas(userId, canvasWidth, canvasHeight);
    } else {
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvasWidth, canvasHeight); // 以前の描画をクリア
    }

    // データが配列かどうかを確認する
    if (!Array.isArray(puyoPositions)) {
        console.error(
            "Invalid data format: puyoPositions is not an array",
            puyoPositions,
        );
        return;
    }

    // 描画関数
    function drawPuyo(ctx, positions) {
        positions.forEach((row, rowIndex) => {
            row.forEach((color, colIndex) => {
                if (color) {
                    ctx.fillStyle = puyoColors[color] || "#000";
                    ctx.fillRect(
                        colIndex * blockSize,
                        rowIndex * blockSize,
                        blockSize,
                        blockSize,
                    );
                }
            });
        });
    }

    drawPuyo(ctx, puyoPositions);
});
