function loadGame() {
    ctx = elemCanvas.getContext("2d"), WIDTH = elemCanvas.width, HEIGHT = elemCanvas.height, spriteBackground.src = "/assets/games/dodger/background.png", spriteRock.src = "/assets/games/dodger/rock_2.png", spritePlayer.src = "/assets/games/dodger/player_2.png", elemGameInfo.innerHTML = "Connexion en cours...", window.addEventListener("keydown", onKeyDown), window.addEventListener("keyup", onKeyUp), patate = patate.replace(/545678/g, "."), patate = patate.replace(/876543/g, ":"), socket = io.connect(patate, {reconnection: !1}), avgPing = 0, mBalls = [], mBallsRotation = [], requestAnimFrame(render)
}
function onKeyDown(e) {
    if (37 == e.keyCode)leftPress = !0; else {
        if (39 != e.keyCode)return;
        rightPress = !0
    }
    setupPress()
}
function onKeyUp(e) {
    if (37 == e.keyCode)leftPress = !1; else {
        if (39 != e.keyCode)return;
        rightPress = !1
    }
    setupPress()
}
function setupPress() {
    newDir = 0, leftPress || rightPress ? !leftPress && rightPress ? newDir = 1 : leftPress && !rightPress && (newDir = -1) : newDir = 0, lastNewDir != newDir && (socket.emit("commande", newDir), lastNewDir = newDir)
}
function pingServer() {
    lastPing = Date.now(), socket.emit("ping")
}
function insertMBalls(e, n) {
    if (!n)for (var t = 0; t < mBalls.length; t++)mBalls[t][0] = e[t][0], mBalls[t][1] = e[t][1], mBalls[t][2] = e[t][2], mBalls[t][3] = e[t][3], mBalls[t][4] = e[t][4];
    for (var a = mBalls.length; mBalls.length < e.length;) {
        var s = [];
        s[0] = e[a][0], s[1] = e[a][1], s[2] = e[a][2], s[3] = e[a][3], s[4] = e[a][4], mBalls.push(s), a++
    }
    for (; mBallsRotation.length < mBalls.length;)mBallsRotation.push(0)
}
function updateBalls(e, n) {
    for (var t = 0; t < n.length; t++)n[t][0] += n[t][2] * e, n[t][1] += -1.1 * e * e / 2 + n[t][3] * e, n[t][3] += -1.1 * e, n[t][0] < BALL_SIZE / 2 && n[t][2] < 0 && (n[t][2] = -n[t][2]), n[t][0] > 1 - BALL_SIZE / 2 && n[t][2] > 0 && (n[t][2] = -n[t][2]), n[t][1] < BALL_SIZE / 2 && (n[t][3] = n[t][4], n[t][1] = BALL_SIZE / 2), n[t][0] < serverPlayerPosX + .7 * (BALL_SIZE / 2 + PLAYER_SIZE / 2) && n[t][0] > serverPlayerPosX - .7 * (BALL_SIZE / 2 + PLAYER_SIZE / 2) && n[t][1] < 1.7 * PLAYER_SIZE && (maybeFinish = !0), n[t][2] > 0 && (mBallsRotation[t] += 100 * e, mBallsRotation[t] > 360 && (mBallsRotation[t] -= 360)), n[t][2] < 0 && (mBallsRotation[t] -= 100 * e, mBallsRotation[t] < 0 && (mBallsRotation[t] += 360))
}
function render() {
    requestAnimFrame(render), Date.now() - timeLastPacket > 1e3 || (delay = (Date.now() - lastUpdate) / 1e3, lastUpdate = Date.now(), 1 != mGameStatus || maybeFinish || (0 == serverPosXReached ? serverPlayerPosX > mPlayerPosX ? (mPlayerPosX += (1 + 2 * Math.abs(mPlayerPosX - serverPlayerPosX)) * delay, mPlayerPosX > serverPlayerPosX && (mPlayerPosX = serverPlayerPosX, serverPosXReached = !0)) : mPlayerPosX > serverPlayerPosX && (mPlayerPosX -= (1 + 2 * Math.abs(mPlayerPosX - serverPlayerPosX)) * delay, serverPlayerPosX > mPlayerPosX && (mPlayerPosX = serverPlayerPosX, serverPosXReached = !0)) : Date.now() - timeLastPacket < 300 && (mPlayerPosX += 1 * lastServerDir * delay), mPlayerPosX > 1 - PLAYER_SIZE / 2 && (mPlayerPosX = 1 - PLAYER_SIZE / 2), PLAYER_SIZE / 2 > mPlayerPosX && (mPlayerPosX = PLAYER_SIZE / 2), updateBalls(delay, mBalls)), mGameStatus >= 0 && (renderBackground(), renderPlayer(mPlayerPosX), renderBalls(mBalls)), mGameStatus >= 0 && (0 == socket.connected || 2 == mGameStatus) && (void 0 == alphaFinish && (alphaFinish = 0), alphaFinish += .3 * delay, alphaFinish > .3 && (alphaFinish = .3), renderBlackFinish(alphaFinish)))
}
function renderBackground() {
    ctx.drawImage(spriteBackground, 0, 0, 400, 400)
}
function renderBlackFinish(e) {
    ctx.fillStyle = "rgba(0, 0, 0," + e + ")", ctx.fillRect(0, 0, 400, 400)
}
function renderBalls(e) {
    for (var n = WIDTH * BALL_SIZE, t = 0; t < e.length; t++)ctx.save(), ctx.translate(e[t][0] * WIDTH, .8 * HEIGHT - e[t][1] * WIDTH), ctx.rotate(mBallsRotation[t] * Math.PI / 180), ctx.translate(-(e[t][0] * WIDTH), -(.8 * HEIGHT - e[t][1] * WIDTH)), ctx.drawImage(spriteRock, e[t][0] * WIDTH - n / 2, .8 * HEIGHT - e[t][1] * WIDTH - n / 2, n, n), ctx.restore()
}
function renderPlayer(e) {
    var n = WIDTH * PLAYER_SIZE;
    ctx.drawImage(spritePlayer, e * WIDTH - n / 2, .8 * HEIGHT - 2 * n, n, 2 * n)
}
function renderGameInfo(e, n, t) {
    0 == t ? (elemGameInfo.style.textAlign = "center", elemGameInfo.innerHTML = "Appuyez sur une direction pour commencer") : 1 == t ? (elemGameInfo.style.textAlign = "center", elemGameInfo.innerHTML = "►") : 2 == t && (elemContinue.style.display = "inline-block", elemContinueDisabled.style.display = "none", elemGameInfo.style.textAlign = "left", elemGameInfo.innerHTML = "TERMINÉ ! Balles : " + e + " - Temps : " + n / 1e3 + "s")
}
var socket, lastPing, avgPing, elemGameInfo = document.getElementById("gameInfo"), elemContinue = document.getElementById("continue"), elemContinueDisabled = document.getElementById("continue-disabled"), elemCanvas = document.getElementById("canvas"), elemPing = document.getElementById("ping"), spriteBackground = new Image, spriteRock = new Image, spritePlayer = new Image, ctx, WIDTH, HEIGHT, leftPress, rightPress, lastNewDir, lastServerDir, serverPosXReached, mBalls, mBallsRotation, mPlayerPosX, serverPlayerPosX, mGameStatus, BALL_SIZE = .105, PLAYER_SIZE = .075, delay, lastUpdate, alphaFinish, timeLastPacket, timeServerLastPacket;
window.requestAnimFrame = function () {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function (e) {
        window.setTimeout(e, 1e3 / 60)
    }
}(), window.onbeforeunload = function () {
    socket.disconnect()
}, loadGame(), window.addEventListener("keydown", function (e) {
    [32, 37, 38, 39, 40, 90, 81, 83, 68].indexOf(e.keyCode) > -1 && e.preventDefault()
}, !1), socket.on("connect", function () {
    pingServer(), socket.emit("yolo", poivron)
}), socket.on("alert", function (e) {
    elemGameInfo.innerHTML = e, elemGameInfo.style.textAlign = "center"
}), socket.on("disconnect", function () {
    elemPing.innerHTML = "Déconnecté"
}), socket.on("update", function (e) {
    var n = !1, t = e[2];
    if (void 0 != timeServerLastPacket) {
        var a = t - timeServerLastPacket, s = Date.now() - timeLastPacket;
        s > a + 10 ? n = !0 : a > s && (n = !0)
    }
    mGameStatus != e[0] && renderGameInfo(e[3].length, e[2], e[0]), mGameStatus = e[0], insertMBalls(e[3], n), serverPlayerPosX = e[4], (void 0 == mPlayerPosX || 2 == mGameStatus) && (mPlayerPosX = serverPlayerPosX), 2 != mGameStatus && (maybeFinish = !1), lastServerDir = e[1], serverPosXReached = !1, timeLastPacket = Date.now(), timeServerLastPacket = t
}), socket.on("pong", function () {
    var e = Date.now() - lastPing;
    avgPing = Math.round((avgPing + e) / 2), hslPingColor = 50 > e ? 110 : 75 > e ? 95 : 100 > e ? 40 : 125 > e ? 25 : 175 > e ? 10 : 0, elemPing.innerHTML = "ping: " + avgPing + "ms" + "<span class='puce' style='color:hsl(" + hslPingColor + ", 95%, 48%);'> •</span>", setTimeout(pingServer, 2e3)
}), socket.on("disconnect", function () {
    elemPing.innerHTML = "Déconnecté", -1 != mGameStatus && 2 != mGameStatus && (elemContinue.style.display = "inline-block", elemContinueDisabled.style.display = "none")
}), socket.on("connect_error", function () {
    elemGameInfo.innerHTML = "Connexion impossible. Réessayez plus tard.", elemGameInfo.style.textAlign = "center", elemCanvas.style.background = "url('/assets/logo_deco.png')", elemCanvas.style.backgroundColor = "#000", elemCanvas.style.backgroundPosition = "center center", elemCanvas.style.backgroundRepeat = "no-repeat", elemContinue.style.display = "inline-block", elemContinueDisabled.style.display = "none"
});