function loadGame() {
    ctx = elemCanvas.getContext("2d"), WIDTH = elemCanvas.width, HEIGHT = elemCanvas.height, cellSize = HEIGHT / 20, spriteBackground.src = "/assets/games/snake/background.png", spriteSnakeBody.src = "/assets/games/snake/snake_body.png", spriteSnakeBodyBlack.src = "/assets/games/snake/snake_body_black.png", spriteFood.src = "/assets/games/snake/food.png", spriteWall.src = "/assets/games/snake/wall.png", spriteEnd.src = "/assets/games/snake/end.png", elemGameInfo.innerHTML = "Connexion en cours...", window.addEventListener("keydown", onKeyDown), patate = patate.replace(/545678/g, "."), patate = patate.replace(/876543/g, ":"), socket = io.connect(patate, {reconnection: !1}), avgPing = 0
}
function onKeyDown(e) {
    var n;
    if (e.keyCode >= 37 && e.keyCode <= 40)n = e.keyCode - 37; else if (90 == e.keyCode)n = e.keyCode - 89; else if (81 == e.keyCode)n = e.keyCode - 81; else if (83 == e.keyCode)n = e.keyCode - 80; else {
        if (68 != e.keyCode)return;
        n = e.keyCode - 66
    }
    socket.emit("commande", n)
}
function pingServer() {
    lastPing = Date.now(), socket.emit("ping")
}
function renderBackground() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT), ctx.drawImage(spriteBackground, 0, 0, 400, 400)
}
function renderBlackFinish() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.3)", ctx.fillRect(0, 0, 400, 400)
}
function renderSnake(e, n) {
    for (var l = .9, t = 0, a = 0, i = 0; i < e.length; i++){
        angle = 0;
        if(1 == e.length ) {
            (a = 180 + 90 * (tmpdir + 1), t = null)
        } else {
            (i > 0 && (t = Math.atan2(e[i][0] - e[i - 1][0], e[i - 1][1] - e[i][1]) * (180 / Math.PI)),i + 1 < e.length ? (a = Math.atan2(e[i][0] - e[i + 1][0], e[i + 1][1] - e[i][1]) * (180 / Math.PI), 0 == i && (t = null)) : (a = Math.atan2(e[i][0] - e[i - 1][0], e[i - 1][1] - e[i][1]) * (180 / Math.PI), t = null));
        }
        1 == n && ctx.translate(0, +cellSize * (1 - l) / 2);
        null != t && (ctx.save(), ctx.translate(e[i][0] * cellSize + cellSize / 2, e[i][1] * cellSize + cellSize / 2), ctx.rotate(t * Math.PI / 180), ctx.translate(-(e[i][0] * cellSize + cellSize / 2), -(e[i][1] * cellSize + cellSize / 2)), 0 == n ? ctx.drawImage(spriteSnakeBody, e[i][0] * cellSize, e[i][1] * cellSize, cellSize, cellSize) : 1 == n && ctx.drawImage(spriteSnakeBodyBlack, e[i][0] * cellSize, e[i][1] * cellSize, cellSize, cellSize), ctx.restore()), ctx.save(), ctx.translate(e[i][0] * cellSize + cellSize / 2, e[i][1] * cellSize + cellSize / 2), ctx.rotate(a * Math.PI / 180), ctx.translate(-(e[i][0] * cellSize + cellSize / 2), -(e[i][1] * cellSize + cellSize / 2)), 0 == n ? ctx.drawImage(spriteSnakeBody, e[i][0] * cellSize, e[i][1] * cellSize, cellSize, cellSize) : 1 == n && ctx.drawImage(spriteSnakeBodyBlack, e[i][0] * cellSize, e[i][1] * cellSize, cellSize, cellSize), ctx.restore(), 1 == n && ctx.translate(0, -cellSize * (1 - l) / 2)
    }
}
function renderFood(e) {
    for (var n = 0; n < e.length; n++)ctx.drawImage(spriteFood, e[n][0] * cellSize, e[n][1] * cellSize, cellSize, cellSize)
}
function renderWall(e) {
    for (var n = 0; n < e.length; n++)ctx.drawImage(spriteWall, e[n][0] * cellSize, e[n][1] * cellSize, cellSize, cellSize)
}
function renderEnd(e, n) {
    ctx.drawImage(spriteEnd, e * cellSize, n * cellSize, cellSize, cellSize)
}
function renderGameInfo(e, n, l, t) {
    0 == l ? (elemGameInfo.style.textAlign = "center", elemGameInfo.innerHTML = "Appuyez sur une direction pour commencer") : 1 == l ? (elemGameInfo.style.textAlign = "center", elemGameInfo.innerHTML = "â–º") : 2 == l && (elemContinue.style.display = "inline-block", elemContinueDisabled.style.display = "none", elemGameInfo.style.textAlign = "left", elemGameInfo.innerHTML = "TERMINÃ‰ ! Points : " + e + "/" + t + " - Temps : " + n / 1e3 + "s")
}
var socket, lastPing, avgPing, elemGameInfo = document.getElementById("gameInfo"), elemContinue = document.getElementById("continue"), elemContinueDisabled = document.getElementById("continue-disabled"), elemCanvas = document.getElementById("canvas"), elemPing = document.getElementById("ping"), spriteBackground = new Image, spriteSnakeBody = new Image, spriteSnakeBodyBlack = new Image, spriteFood = new Image, spriteWall = new Image, spriteEnd = new Image, ctx, WIDTH, HEIGHT, cellSize, mGameStatus, mWalls, mMax;
window.onbeforeunload = function () {
    socket.disconnect()
}, loadGame(), window.addEventListener("keydown", function (e) {
    [32, 37, 38, 39, 40, 90, 81, 83, 68].indexOf(e.keyCode) > -1 && e.preventDefault()
}, !1), socket.on("connect", function () {
    pingServer(), socket.emit("yolo", poivron)
}), socket.on("alert", function (e) {
    elemGameInfo.innerHTML = e, elemGameInfo.style.textAlign = "center"
}), socket.on("init", function (e) {
    mWalls = e[0], mMax = e[1]
}), socket.on("update", function (e) {
    mGameStatus != e[0] && renderGameInfo(e[2].length - 2, e[1], e[0], mMax), mGameStatus = e[0], renderBackground(), renderFood(e[3]), renderWall(mWalls), renderSnake(e[2], 1), renderSnake(e[2], 0), renderEnd(e[4][0], e[4][1]), 2 == mGameStatus && renderBlackFinish()
}), socket.on("pong", function () {
    var e = Date.now() - lastPing;
    avgPing = Math.round((avgPing + e) / 2), hslPingColor = 50 > e ? 110 : 75 > e ? 95 : 100 > e ? 40 : 125 > e ? 25 : 175 > e ? 10 : 0, elemPing.innerHTML = "ping: " + avgPing + "ms" + "<span class='puce' style='color:hsl(" + hslPingColor + ", 95%, 48%);'> â€¢</span>", setTimeout(pingServer, 2e3)
}), socket.on("disconnect", function () {
    elemPing.innerHTML = "DÃ©connectÃ©", -1 != mGameStatus && 2 != mGameStatus && (renderBlackFinish(), elemContinue.style.display = "inline-block", elemContinueDisabled.style.display = "none")
}), socket.on("connect_error", function () {
    elemGameInfo.innerHTML = "Connexion impossible. RÃ©essayez plus tard.", elemGameInfo.style.textAlign = "center", elemCanvas.style.background = "url('/assets/logo_deco.png')", elemCanvas.style.backgroundColor = "#000", elemCanvas.style.backgroundPosition = "center center", elemCanvas.style.backgroundRepeat = "no-repeat", elemContinue.style.display = "inline-block", elemContinueDisabled.style.display = "none"
});