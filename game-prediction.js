X=0;
//BALL SUPPLEMENTAIRES, copie ajoutées
var ball1=true;
var ball2=false;
var ball3=false;
var ball4=true;
var ball5=true;

var t = Date.now();

serverPlayer2PosX=0.5;
function ballUpdate(){
    //ICI dans balls tu as un tableau avec toutes les balles disponibles.
    //Le but du jeux : faire bouger X (il peut aller de 0 à WIDTH=400) pour qu'il évite d'être en collision avec une ball.
    //Zone de collision: rectangle de hauteur 55 et largeur 30. Position sur le canvas : ctx.rect(0+X,265,30,55);
    //Le haut des boules est a 40
    //Le plus bas des boules est à 278
    //temps depuis dernier
    //Acceleration moyenne (avec y1 variant de 0->1) : -0.000018253172955523
//    var acceleration = -0.000018253172955523;
//    var dt = Date.now()-t;
//    t = Date.now();
//    dy = balls[0].y1-lastY;
//    var v=dy/dt;
//    var dv = v-lastV;
//    var a = dv/dt
    //Log les resultats pour afficher sous excel
    //console.log(dt+","+t+","+balls[0].x1+","+balls[0].y1);
    //Cacule les positions futures. On prend les position des 10 dt suivantes
    var dt = (Date.now()-t)/1000;
    t= Date.now();
    if(mBalls.length>0 && dt>0){
//        var dx = 0.0168;
//        var dt = 0.0168;
        var dx = dt;
        function move(x){
            serverPlayer2PosX += dx*x;
            //On ne peut pas dépasser
            serverPlayer2PosX = Math.max(PLAYER_SIZE/2,Math.min(serverPlayer2PosX, 1-PLAYER_SIZE));
            socket.emit("commande", x)
            setTimeout(function () {
                socket.emit("commande", 0)
            }, dx-2);
        }
//        if(mBalls[2]){
//            console.log("if(party1["+(a+55)+"]) party1["+(a+55)+"][1][3].push(["+mBalls[0][0]+","+mBalls[0][1]+","+mBalls[0][2]+","+mBalls[0][3]+","+mBalls[0][4]+"])")
//        }


        //Va essayer de detecter s'il y a une colision sur les X (i>X) deplacements à venir.
        //Si il y en a une, fait bouger pour s'en éloigner.
        function detectDanger (balls, i){
            var n = WIDTH * BALL_SIZE*1.1;
            if(i>20){
                return 0;
            }
            var nexPositions = [];
            var dangerZone = 0 ;
            for (var t = 0; t < balls.length; t++){
                var ball = $.extend(true, {}, balls[t]);
                nexPositions[t] = ball;
                updateBallPosition(dt*1.1, ball);
                var ballX = ball[0] * WIDTH - n / 2;
                var ballY = .8 * HEIGHT - ball[1] * WIDTH - n / 2;
                //console.log( n / 2)
                if(ballY>200){
//                    ctx.rect(ballX,ballY,n,n);
//                    ctx.stroke();
                    //Ca risque de toucher, on le pousse !
                    if(serverPlayer2PosX*WIDTH>ballX && serverPlayer2PosX*WIDTH<ballX+n){
                        var direction = Math.abs(ball[2])/ball[2];
                        //Si il est collé contre un coin, on essaye de le faire partir du coin
                        if(serverPlayer2PosX*WIDTH<PLAYER_SIZE*WIDTH*1.5 && direction == -1){
                            dangerZone = 1;
                        } else if(serverPlayer2PosX*WIDTH>WIDTH-PLAYER_SIZE*WIDTH*1.5 && direction == 1){
                            dangerZone = -1;
                        } else {
                            dangerZone = direction;
                        }
                    }lastNewDir
                }
                var n = WIDTH * PLAYER_SIZE;
                //console.log(serverPlayer2PosX)
                ctx.drawImage(spritePlayer2, serverPlayer2PosX * WIDTH - n / 2, .8 * HEIGHT - 2 * n, n, 2 * n)
                if(i == 0){
                    if(ball[0] < serverPlayer2PosX + .7 * (BALL_SIZE / 2 + PLAYER_SIZE / 2)
                        && ball[0] > serverPlayer2PosX - .7 * (BALL_SIZE / 2 + PLAYER_SIZE / 2)
                        && ball[1] < 1.7 * PLAYER_SIZE){
                        console.log("coooolision-------------------------------------------------------------------------")
                    }
                }
                //ctx.drawImage(spriteRock, ballX, ballY, n, n);
            }
            //RAS, on va regarder pour les 10 positions suivantes.
            if(dangerZone == 0){
                return detectDanger (nexPositions, ++i);
            } else {
                return dangerZone;
            }
        }
        var direction = detectDanger (mBalls, 0);
        if(direction != 0){
            move(direction);
        }
    }

}
function playParty(orders) {
    var i =0;
    play();
    var time = 0;
    function play (){
        var c = orders[i++];
        var timeDelta = c[1][2] - time;
        time = c[1][2];
        socket[c[0]](c[1]);
        setTimeout(function () {
            play();
        },timeDelta)
    }
}
lastCommand=0;
socket = {
    emit: function (a, arg) {
        var update = function () {
            X+=arg;
            if(lastCommand !=0){
                setTimeout(function () {update();}, 1);
            }
        }
        lastCommand = arg;
        console.log(a)
        console.log(arg)
        update();
    },
    disconnect: function () {

    },
    "update": function (e) {
        //ballUpdate();
        update(e);
//        var n = !1, t = e[2];
//        if (void 0 != timeServerLastPacket) {
//            var a = t - timeServerLastPacket, s = Date.now() - timeLastPacket;
//            s > a + 10 ? n = !0 : a > s && (n = !0)
//        }
    }
}
var patate = '77777777';

var elemCanvas = document.getElementById("canvas");

function loadGame() {
    ctx = elemCanvas.getContext("2d");
    WIDTH = elemCanvas.width;
    HEIGHT = elemCanvas.height;
    spriteBackground.src = "img/background.png";
    spriteRock.src = "img/rock_2.png";
    spritePlayer.src = "img/player_2.png";
    spritePlayer2.src = "img/player_2.png";
    //elemGameInfo.innerHTML = "Connexion en cours...";
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    patate = patate.replace(/545678/g, ".");
    patate = patate.replace(/876543/g, ":");
    //socket = io.connect(patate, {reconnection: !1});
    avgPing = 0;
    mBalls = [];
    mBallsRotation = [];
    requestAnimFrame(render);
}

function onKeyDown(e) {
    if (37 == e.keyCode){
        leftPress = !0;
    } else {
        if (39 != e.keyCode){
            return;
        }
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
    newDir = 0; leftPress || rightPress ? !leftPress && rightPress ? newDir = 1 : leftPress && !rightPress && (newDir = -1) : newDir = 0, lastNewDir != newDir && (socket.emit("commande", newDir), lastNewDir = newDir)
}

function pingServer() {
    lastPing = Date.now(), socket.emit("ping")
}

function insertMBalls(e, n) {
    if (!n) {
        for (var t = 0; t < mBalls.length; t++){
            mBalls[t][0] = e[t][0];
            mBalls[t][1] = e[t][1];
            mBalls[t][2] = e[t][2];
            mBalls[t][3] = e[t][3];
            mBalls[t][4] = e[t][4];
        }
    }
    for (var a = mBalls.length; mBalls.length < e.length;) {
        var s = [];
        s[0] = e[a][0];
        s[1] = e[a][1];
        s[2] = e[a][2];
        s[3] = e[a][3];
        s[4] = e[a][4];
        mBalls.push(s), a++
    }
    for (; mBallsRotation.length < mBalls.length;){
        mBallsRotation.push(0)
    }
}


function updateBallPosition(dt, ball) {
    ball[0] += ball[2] * dt;
    ball[1] += -1.1 * dt * dt / 2 + ball[3] * dt;
    ball[3] += -1.1 * dt; //vitesse
    ball[0] < BALL_SIZE / 2 && ball[2] < 0 && (ball[2] = -ball[2]);
    ball[0] > 1 - BALL_SIZE / 2 && ball[2] > 0 && (ball[2] = -ball[2]);
    ball[1] < BALL_SIZE / 2 && (ball[3] = ball[4], ball[1] = BALL_SIZE / 2);
//            ball[2] > 0 && (mBallsRotation[t] += 100 * dt, mBallsRotation[t] > 360 && (mBallsRotation[t] -= 360));
//        ball[2] < 0 && (mBallsRotation[t] -= 100 * dt, mBallsRotation[t] < 0 && (mBallsRotation[t] += 360))
}


function updateBalls(dt, balls) {
//    console.log(dt)
    for (var t = 0; t < balls.length; t++){
        balls[t][0] += balls[t][2] * dt;
        balls[t][1] += -1.1 * dt * dt / 2 + balls[t][3] * dt;
        balls[t][3] += -1.1 * dt; //vitesse
        balls[t][0] < BALL_SIZE / 2 && balls[t][2] < 0 && (balls[t][2] = -balls[t][2]);
        balls[t][0] > 1 - BALL_SIZE / 2 && balls[t][2] > 0 && (balls[t][2] = -balls[t][2]);
        balls[t][1] < BALL_SIZE / 2 && (balls[t][3] = balls[t][4], balls[t][1] = BALL_SIZE / 2);
        balls[t][0] < serverPlayerPosX + .7 * (BALL_SIZE / 2 + PLAYER_SIZE / 2)
            && balls[t][0] > serverPlayerPosX - .7 * (BALL_SIZE / 2 + PLAYER_SIZE / 2)
            && balls[t][1] < 1.7 * PLAYER_SIZE && (maybeFinish = !0),
            balls[t][2] > 0 && (mBallsRotation[t] += 100 * dt, mBallsRotation[t] > 360 && (mBallsRotation[t] -= 360));
        balls[t][2] < 0 && (mBallsRotation[t] -= 100 * dt, mBallsRotation[t] < 0 && (mBallsRotation[t] += 360))
    }
}

function render() {
    requestAnimFrame(render);

    if (Date.now() - timeLastPacket > 1e3) return;

    delay = (Date.now() - lastUpdate) / 1e3;
    lastUpdate = Date.now();

    if (1 != mGameStatus) return;
    if (maybeFinish) return;

    ((0 == serverPosXReached
        ? serverPlayerPosX > mPlayerPosX
        ? (mPlayerPosX += (1 + 2 * Math.abs(mPlayerPosX - serverPlayerPosX)) * delay, mPlayerPosX > serverPlayerPosX && (mPlayerPosX = serverPlayerPosX, serverPosXReached = !0))
        : mPlayerPosX > serverPlayerPosX && (mPlayerPosX -= (1 + 2 * Math.abs(mPlayerPosX - serverPlayerPosX)) * delay, serverPlayerPosX > mPlayerPosX && (mPlayerPosX = serverPlayerPosX, serverPosXReached = !0))
        : Date.now() - timeLastPacket < 300 && (mPlayerPosX += 1 * lastServerDir * delay), mPlayerPosX > 1 - PLAYER_SIZE / 2 && (mPlayerPosX = 1 - PLAYER_SIZE / 2), PLAYER_SIZE / 2 > mPlayerPosX && (mPlayerPosX = PLAYER_SIZE / 2), updateBalls(delay, mBalls)));


    mGameStatus >= 0 && (renderBackground(), renderPlayer(mPlayerPosX), renderBalls(mBalls));
    if (mGameStatus >= 0) {
        if (0 == 1 /*socket.connected*/ || 2 == mGameStatus) {
            void 0 == alphaFinish && (alphaFinish = 0);
            alphaFinish += .3 * delay;
            alphaFinish > .3 && (alphaFinish = .3);
            renderBlackFinish(alphaFinish);
        }
    }
    var n = WIDTH * PLAYER_SIZE;
    //ctx.drawImage(spritePlayer2, X/400 * WIDTH - n / 2, .8 * HEIGHT - 2 * n, n, 2 * n)
//    ctx.rect(0+X,265,30,55);
//    ctx.stroke();
}

function renderBackground() {
    ctx.drawImage(spriteBackground, 0, 0, 400, 400)
}

function renderBlackFinish(e) {
    ctx.fillStyle = "rgba(0, 0, 0," + e + ")", ctx.fillRect(0, 0, 400, 400)
}

function renderBalls(e) {
    var n = WIDTH * BALL_SIZE;
    for (var t = 0; t < e.length; t++){
        ctx.save();
        ctx.translate(e[t][0] * WIDTH, .8 * HEIGHT - e[t][1] * WIDTH);
        ctx.rotate(mBallsRotation[t] * Math.PI / 180);
        ctx.translate(-(e[t][0] * WIDTH), -(.8 * HEIGHT - e[t][1] * WIDTH));
        var ballX = e[t][0] * WIDTH - n / 2;
        var ballY = .8 * HEIGHT - e[t][1] * WIDTH - n / 2;
        ctx.drawImage(spriteRock, ballX, ballY, n, n);
        ctx.restore()
    }
    ballUpdate();
}

function renderPlayer(e) {
    var n = WIDTH * PLAYER_SIZE;
    //ctx.drawImage(spritePlayer, e * WIDTH - n / 2, .8 * HEIGHT - 2 * n, n, 2 * n)
}

function renderGameInfo(e, n, t) {
    0 == t ? (elemGameInfo.style.textAlign = "center", elemGameInfo.innerHTML = "Appuyez sur une direction pour commencer") : 1 == t ? (elemGameInfo.style.textAlign = "center", elemGameInfo.innerHTML = "►") : 2 == t && (elemContinue.style.display = "inline-block", elemContinueDisabled.style.display = "none", elemGameInfo.style.textAlign = "left", elemGameInfo.innerHTML = "TERMINÉ ! Balles : " + e + " - Temps : " + n / 1e3 + "s")
}

var socket, lastPing, avgPing, elemGameInfo = document.getElementById("gameInfo"), elemContinue = document.getElementById("continue"), elemContinueDisabled = document.getElementById("continue-disabled"), elemCanvas = document.getElementById("canvas"), elemPing = document.getElementById("ping"), spriteBackground = new Image, spriteRock = new Image, spritePlayer = new Image, spritePlayer2 = new Image, ctx, WIDTH, HEIGHT, leftPress, rightPress, lastNewDir, lastServerDir, serverPosXReached, mBalls, mBallsRotation, mPlayerPosX, serverPlayerPosX, mGameStatus, BALL_SIZE = .105, PLAYER_SIZE = .075, delay, lastUpdate, alphaFinish, timeLastPacket, timeServerLastPacket;

window.requestAnimFrame = function () {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function (e) {
        window.setTimeout(e, 1e3 / 60)
    }
}();

window.onbeforeunload = function () {
    socket.disconnect()
};

loadGame();

//window.addEventListener("keydown", function (e) {
//    [32, 37, 38, 39, 40, 90, 81, 83, 68].indexOf(e.keyCode) > -1 && e.preventDefault()
//}, !1);
/*
 socket.on("connect", function () {
 pingServer(), socket.emit("yolo", poivron)
 });

 socket.on("alert", function (e) {
 elemGameInfo.innerHTML = e, elemGameInfo.style.textAlign = "center"
 });
 socket.on("disconnect", function () {
 elemPing.innerHTML = "Déconnecté"
 });

 socket.on("update", function (e) {
 var n = !1, t = e[2];
 if (void 0 != timeServerLastPacket) {
 var a = t - timeServerLastPacket, s = Date.now() - timeLastPacket;
 s > a + 10 ? n = !0 : a > s && (n = !0)
 }
 mGameStatus != e[0] && renderGameInfo(e[3].length, e[2], e[0]), mGameStatus = e[0], insertMBalls(e[3], n), serverPlayerPosX = e[4], (void 0 == mPlayerPosX || 2 == mGameStatus) && (mPlayerPosX = serverPlayerPosX), 2 != mGameStatus && (maybeFinish = !1), lastServerDir = e[1], serverPosXReached = !1, timeLastPacket = Date.now(), timeServerLastPacket = t
 });

 socket.on("pong", function () {
 var e = Date.now() - lastPing;
 avgPing = Math.round((avgPing + e) / 2),
 hslPingColor = 50 > e ? 110 : 75 > e ? 95 : 100 > e ? 40 : 125 > e ? 25 : 175 > e ? 10 : 0,
 elemPing.innerHTML = "ping: " + avgPing + "ms" + "<span class='puce' style='color:hsl(" + hslPingColor + ", 95%, 48%);'> •</span>",
 setTimeout(pingServer, 2e3)
 });

 socket.on("disconnect", function () {
 elemPing.innerHTML = "Déconnecté", -1 != mGameStatus && 2 != mGameStatus && (elemContinue.style.display = "inline-block", elemContinueDisabled.style.display = "none")
 });

 socket.on("connect_error", function () {
 elemGameInfo.innerHTML = "Connexion impossible. Réessayez plus tard.", elemGameInfo.style.textAlign = "center", elemCanvas.style.background = "url('/assets/logo_deco.png')", elemCanvas.style.backgroundColor = "#000", elemCanvas.style.backgroundPosition = "center center", elemCanvas.style.backgroundRepeat = "no-repeat", elemContinue.style.display = "inline-block", elemContinueDisabled.style.display = "none"
 });
 */

function update(e) {
    var n = false;
    var t = e[2];
    if (void 0 != timeServerLastPacket) {
        var a = t - timeServerLastPacket;
        s = Date.now() - timeLastPacket;
        //        s > a + 10 ? n = !0 : a > s && (n = !0)

        if(s > a + 10){
            n = true;
        } else if(a > s) {
            n = true;
        }

    }

    //game status : 0 => pas commencé, 1 en cours, 2 terminé
    if (mGameStatus != e[0]) {
        renderGameInfo(e[3].length, e[2], e[0]);
    }

    mGameStatus = e[0];

    insertMBalls(e[3], n);

    serverPlayerPosX = e[4];

    if (void 0 == mPlayerPosX || 2 == mGameStatus) {
        mPlayerPosX = serverPlayerPosX;
    }

    if (2 != mGameStatus) {
        maybeFinish = !1;
    }

    lastServerDir = e[1];
    serverPosXReached = !1;
    timeLastPacket = Date.now();
    timeServerLastPacket = t;
}

var posPlayer = 0.5;
//update([1, 1, 10001, [[0.861, 0.617, -0.535, 0.253, 1.143]], posPlayer]);

/*
["update",
    [1, //Game status
    0, //lastServerDir
    8069, //Time
    [[0.138,0.15,0.535,-1.045,1.143],[0.318,0.056,0.414,-1.185,1.188]] //Ball position
    ,0.789]] //Position joueur
*/

/*
update([1, -1, 13145, [
    [0.861, 0.617, -0.535, 0.253, 1.143],
    [0.626, 0.628, 0.414, 0.382, 1.188],
    [0.936, 0.652, -0.463, -0.086, 1.151],
    [0.024, 0.487, 0.504, -0.167, 1.059]
], 0.612]);*/
