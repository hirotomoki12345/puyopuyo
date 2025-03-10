// 設定を記載しておくクラス
class Config {}
Config.puyoImgWidth = 40; // ぷよぷよ画像の幅
Config.puyoImgHeight = 40; // ぷよぷよ画像の高さ

Config.fontHeight = 33;

Config.stageCols = 6; // ステージの横の個数
Config.stageRows = 12; // ステージの縦の個数

// フィールドサイズ追加
// 高さが全部入るように調整
Config.puyoImgHeight = (window.innerHeight - Config.fontHeight) / Config.stageRows;
Config.puyoImgWidth = Config.puyoImgHeight;

Config.stageBackgroundColor = "#ffffff"; // ステージの背景色
Config.scoreBackgroundColor = "#24c0bb"; // スコアの背景色

Config.freeFallingSpeed = 10; // 自由落下のスピード
Config.erasePuyoCount = 4; // 何個以上揃ったら消えるか
Config.eraseAnimationDuration = 60; // 何フレームでぷよを消すか

Config.puyoColors = 3; // 何色のぷよを使うか
Config.playerFallingSpeed = 0.6; // プレイ中の自然落下のスピード
Config.playerDownSpeed = 12; // プレイ中の下キー押下時の落下スピード
Config.playerGroundFrame = 25; // 何フレーム接地したらぷよを固定するか
Config.playerMoveFrame = 8; // 左右移動に消費するフレーム数
Config.playerRotateFrame = 8; // 回転に消費するフレーム数

Config.zenkeshiDuration = 150; // 全消し時のアニメーションミリセカンド
Config.gameOverFrame = 3000; // ゲームオーバー演出のサイクルフレーム

Config.rate = 1;
