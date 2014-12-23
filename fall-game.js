var answer = function () {
    socket.emit("commande", mGlyphChoose.indexOf(mGlyph));
}

socket = {
    emit: function (a,e) {
        console.log(a);
        console.log(e);
    },
    okglyph: function (a) {
        console.log(a);
        mOkGlyph = !0, mGlyphCpt++;
    },
    glyph: function (e) {
        console.log(e);
        mGameTime = e[0], mGlyphCpt = e[1], mGlyph = e[2], mGlyphChoose = e[3], mGlyphProgress = 0, mGlyphProgressVel = 0, mGlyphX = .4 * Math.random() + .3, alphaGlyph = 1, mGlyphScale = 0, mOkGlyph = !1, lastChoose = -1;
    },
    "update": function (e) {
        console.log(e)
        mGameStatus = e[0], mGameTime = e[1];
    }
}


function loadGame() {
    canvas = document.getElementById("canvas"), ctx = canvas.getContext("2d"), WIDTH = document.getElementById("canvas").width, HEIGHT = document.getElementById("canvas").height, spriteBackground.src = "fall-background.png", spriteGlyphs.src = "fall-glyphs.png", spriteTuto.src = "fall-tuto.png", elemGameInfo.innerHTML = "Connexion en cours...", canvas.addEventListener("click", onClickDown, !1),
//        patate = patate.replace(/545678/g, "."), patate = patate.replace(/876543/g, ":"),
//        socket = io.connect(patate, {reconnection: !1}),
        avgPing = 0, mGlyphProgress = 0, mGlyphProgressVel = 0, mGlyphCpt = 0, alphaTuto = 1, requestAnimFrame(render)
}
function onClickDown(e) {
    if (0 == mOkGlyph && -1 == lastChoose) {
        var n = canvas.getBoundingClientRect(), t = Math.round(e.clientX - n.left), a = Math.round(e.clientY - n.top), l = -1;
        a > .7 * HEIGHT && (size = GLYPH_BUTTON_SIZE * HEIGHT, t > .5 * HEIGHT - 2 * size * GLYPH_BUTTON_PADDING && .5 * HEIGHT - 1 * size * GLYPH_BUTTON_PADDING >= t && (l = 0), t > .5 * HEIGHT - 1 * size * GLYPH_BUTTON_PADDING && .5 * HEIGHT >= t && (l = 1), t > .5 * HEIGHT && .5 * HEIGHT + 1 * size * GLYPH_BUTTON_PADDING >= t && (l = 2), t > .5 * HEIGHT + 1 * size * GLYPH_BUTTON_PADDING && .5 * HEIGHT + 2 * size * GLYPH_BUTTON_PADDING >= t && (l = 3), l >= 0 && 3 >= l && (socket.emit("commande", l), lastChoose = l))
    } else 0 == mGameStatus && socket.connected && (socket.emit("commande"), 1 == alphaTuto && (alphaTuto = .999))
}
function pingServer() {
    lastPing = Date.now(), socket.emit("ping")
}
function render() {
    requestAnimFrame(render), Date.now() - timeLastPacket > 1e3 || (delay = (Date.now() - lastUpdate) / 1e3, lastUpdate = Date.now(), 1 == mGameStatus && (1 != mGlyphScale && (mGlyphScale += 5 * delay, mGlyphScale > 1 && (mGlyphScale = 1)), mGameTime += 1e3 * delay, 0 == mOkGlyph ? (mGlyphProgress += (.2 + mGameTime / 16e3) * delay * delay / 2 + mGlyphProgressVel * delay, mGlyphProgressVel += (.2 + mGameTime / 16e3) * delay) : (.5 >= mGlyphX ? mGlyphX -= 1 * delay : mGlyphX += 1 * delay, alphaGlyph -= 2 * delay, 0 > alphaGlyph && (alphaGlyph = 0)), mGlyphProgress > 1 && (mGlyphProgress = 1)), mGameStatus >= 0 && (renderBackground(), void 0 != mGlyph && renderGlyph(mGlyph, mGlyphX, mGlyphProgress, mGlyphScale), renderTuto(alphaTuto), renderForeground(), void 0 != mGlyph && renderGlyphChoose(mGlyphChoose), alertFinish || renderGameInfo(mGlyphCpt, mGameTime, mGameStatus)), mGameStatus >= 0 && (0 == socket.connected || 2 == mGameStatus) && (void 0 == alphaFinish && (alphaFinish = 0), alphaFinish += .3 * delay, alphaFinish > .3 && (alphaFinish = .3), renderBlackFinish(alphaFinish)), 1 != alphaTuto && 0 != alphaTuto && (alphaTuto -= 2 * delay, 0 > alphaTuto && (alphaTuto = 0)))
}
function renderBackground() {
    ctx.drawImage(spriteBackground, 0, 0, spriteBackground.width, .8 * spriteBackground.height, 0, 0, 400, .8 * HEIGHT)
}
function renderForeground() {
    ctx.drawImage(spriteBackground, 0, .8 * spriteBackground.height, spriteBackground.width, .2 * spriteBackground.height, 0, .8 * HEIGHT, 400, .2 * HEIGHT)
}
function renderTuto(e) {
    ctx.globalAlpha = e, ctx.drawImage(spriteTuto, WIDTH / 2 - spriteTuto.width / 2, .2 * HEIGHT), ctx.globalAlpha = 1
}
function renderBlackFinish(e) {
    ctx.fillStyle = "rgba(0, 0, 0," + e + ")", ctx.fillRect(0, 0, 400, 400)
}
function renderGlyph(e, n, t, a) {
    size = .16 * HEIGHT * a, ctx.globalAlpha = alphaGlyph, ctx.drawImage(spriteGlyphs, 2 + 66 * (e % 11), 2 + 66 * Math.floor(e / 11), 64, 64, n * WIDTH - size / 2, (.08 + .8 * t) * HEIGHT - size / 2, size, size), ctx.globalAlpha = 1
}
function renderGlyphChoose(e) {
    size = GLYPH_BUTTON_SIZE * HEIGHT, nbr = e.length;
    for (var n = 0; nbr > n; n++)-1 != lastChoose && lastChoose != n && (ctx.globalAlpha = .5), ctx.drawImage(spriteGlyphs, 2 + 66 * (e[n] % 11), 2 + 66 * Math.floor(e[n] / 11), 64, 64, .5 * WIDTH - nbr / 2 * size * GLYPH_BUTTON_PADDING + n * size * GLYPH_BUTTON_PADDING + (GLYPH_BUTTON_PADDING - 1) / 2 * size, .9 * HEIGHT - size / 2, size, size), ctx.globalAlpha = 1
}
function renderGameInfo(e, n, t) {
}
var socket, lastPing, avgPing, canvas, elemGameInfo = document.getElementById("gameInfo"), elemContinue = document.getElementById("continue"), elemContinueDisabled = document.getElementById("continue-disabled"), elemCanvas = document.getElementById("canvas"), elemPing = document.getElementById("ping"), spriteBackground = new Image, spriteGlyphs = new Image, spriteTuto = new Image, ctx, WIDTH, HEIGHT, mGameStatus, mGlyphCpt, mGlyph, mGlyphX, mGlyphProgress, mGlyphProgressVel, mGlyphScale, mGlyphChoose, mOkGlyph, alphaGlyph, alphaTuto, delay, lastUpdate, alphaFinish, timeLastPacket, timeServerLastPacket, alertFinish, GLYPH_BUTTON_SIZE = .12, GLYPH_BUTTON_PADDING = 1.7, lastChoose;
window.requestAnimFrame = function () {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function (e) {
        window.setTimeout(e, 1e3 / 60)
    }
}(), window.onbeforeunload = function () {
    socket.disconnect()
}, loadGame(), window.addEventListener("keydown", function (e) {
    //[32, 37, 38, 39, 40, 90, 81, 83, 68].indexOf(e.keyCode) > -1 && e.preventDefault()
}, !1);

//    , socket.on("alert", function (e) {
//    elemGameInfo.innerHTML = e, elemGameInfo.style.textAlign = "center", alertFinish = !0
//}), socket.on("disconnect", function () {
//    elemPing.innerHTML = "DÃ©connectÃ©"
//}), socket.on("update", function (e) {
//    mGameStatus = e[0], mGameTime = e[1]
//}), socket.on("glyph", function (e) {
//    mGameTime = e[0], mGlyphCpt = e[1], mGlyph = e[2], mGlyphChoose = e[3], mGlyphProgress = 0, mGlyphProgressVel = 0, mGlyphX = .4 * Math.random() + .3, alphaGlyph = 1, mGlyphScale = 0, mOkGlyph = !1, lastChoose = -1
//}), socket.on("okglyph", function () {
//    mOkGlyph = !0, mGlyphCpt++
//}), socket.on("pong", function () {
//    var e = Date.now() - lastPing;
//    avgPing = Math.round((avgPing + e) / 2), hslPingColor = 50 > e ? 110 : 75 > e ? 95 : 100 > e ? 40 : 125 > e ? 25 : 175 > e ? 10 : 0, elemPing.innerHTML = "ping: " + avgPing + "ms" + "<span class='puce' style='color:hsl(" + hslPingColor + ", 95%, 48%);'> â€¢</span>", setTimeout(pingServer, 2e3)
//}), socket.on("disconnect", function () {
//    elemPing.innerHTML = "DÃ©connectÃ©", -1 != mGameStatus && 2 != mGameStatus && (elemContinue.style.display = "inline-block", elemContinueDisabled.style.display = "none")
//}), socket.on("connect_error", function () {
//    elemGameInfo.innerHTML = "Connexion impossible. RÃ©essayez plus tard.", elemGameInfo.style.textAlign = "center", elemCanvas.style.background = "url('/assets/logo_deco.png')", elemCanvas.style.backgroundColor = "#000", elemCanvas.style.backgroundPosition = "center center", elemCanvas.style.backgroundRepeat = "no-repeat", elemContinue.style.display = "inline-block", elemContinueDisabled.style.display = "none"
//});



function playParty(orders) {
    var i =0;
    play();
    var time = 0;
    function play (){
        var c = orders[i++];
        console.log(c);
        var timeDelta = 0;
        if(c[0] == "glyph"){
            timeDelta = c[1][0] - time;
            time = c[1][0];
        }
        console.log(timeDelta)
        socket[c[0]](c[1]);
        setTimeout(function () {
            play();
        },timeDelta)
    }
}