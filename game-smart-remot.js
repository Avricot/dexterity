var t = Date.now();
var r = 0;
var modulo = 1;
var trace = [];
var depth = 70;
var requestAnimationFrameFrequency = 1e3 / 60 //40; //Executé tous les 16 ms
done = false;
var resolution=100;
var lastX=0;

function ballUpdate(){
    var dt = (Date.now()-t)/1000;
    t= Date.now();
    if(mBalls.length>0 && dt>0){
        var dx = dt;
        var p = [];
        var cachePosition = [mBalls];
        for(var i=1;i<depth+1;i++){
            cachePosition[i] = [];
            for (var j = 0; j < cachePosition[0].length; j++){
                var ball = [];
                ball[0] = cachePosition[i-1][j][0];
                ball[1] = cachePosition[i-1][j][1];
                ball[2] = cachePosition[i-1][j][2];
                ball[3] = cachePosition[i-1][j][3];
                ball[4] = cachePosition[i-1][j][4];
                updateBallPosition(dx, ball);
                cachePosition[i][j] = ball;
            }
        }
        function calcPath (position, i, j, minDistance){
            if(position<PLAYER_SIZE/2 || position > 1-PLAYER_SIZE/2 || j>depth || i<0 || i>resolution){
                return [minDistance];
            }
            if(!p[i] || !p[i][j]){
                if(!p[i]){
                    p[i] = [];
                }
            } else {
                var copy = p[i][j].slice();
                copy[0] += minDistance;
                return copy;
            }
            var collision = false;
            var distanceM = 0;
            for (var t = 0; t < cachePosition[j].length; t++){
                var ball = cachePosition[j][t];
                //distance uniquement si la balle descend ?
                var distance = (ball[0]-position)*(ball[0]-position) + (ball[1]-PLAYER_SIZE)*(ball[1]-PLAYER_SIZE);
                if(j>10){
                    distance = distance/3;
                }
                if(j>20){
                    distance = distance/3;
                }
                if(j>30){
                    distance = distance/2;
                }
                if(j>50){
                    distance = distance/10;
                }
                if(distance<0){
                    distance = distance*-1;
                }
                distanceM += distance;

                if(ball[0] < position + 1.5 * (BALL_SIZE / 2 + PLAYER_SIZE / 2)
                    && ball[0] > position - 1.5 * (BALL_SIZE / 2 + PLAYER_SIZE / 2)
                    && ball[1] < 2.3 * PLAYER_SIZE){
                    collision = true ;
                }
            }
            if(!collision){
                var pathLeft = calcPath(position-dx, i-1, j+1);
                var pathRight = calcPath(position+dx, i+1, j+1);
                var pathDown = calcPath(position, i, j+1);
                var returnedPath = null;

                if(pathDown.length > pathLeft.length && pathDown.length > pathRight.length){
                    returnedPath = pathDown;
                }
                if(pathLeft.length > pathDown.length && pathLeft.length > pathRight.length){
                    returnedPath = pathLeft;
                }
                if(pathRight.length > pathDown.length && pathRight.length > pathLeft.length){
                    returnedPath = pathRight;
                }
                var minDown = pathDown[0];
                var minLeft = pathLeft[0];
                var minRight = pathRight[0];
                if(returnedPath == null){
                    if(minDown > minLeft && minDown > minRight){
                        returnedPath = pathDown;
                    }
                    if(minLeft > minDown && minLeft > minRight){
                        returnedPath = pathLeft;
                    }
                    if(minRight > minLeft && minRight > minLeft){
                        returnedPath = pathRight;
                    }
                    if(returnedPath == null){
                        returnedPath = pathDown;
                    }
                }
                p[i][j] = returnedPath;
                returnedPath = returnedPath.slice();
                returnedPath.push(i);
                returnedPath[0] = returnedPath[0]+distance;
                return returnedPath;
            }
            return [0];
        }
        //Position de 1 à 100.
        var index = Math.round(serverPlayerPosX*resolution);
        var bestPath = calcPath(serverPlayerPosX, index, 0);
        if(bestPath.length<3){
            if(lastX != 0){
                socket.emit("commande", 0);
                lastX = 0;
            }
            console.log("OK ca déconne");
        } else {
            move(bestPath[bestPath.length-2]-index);
        }
        function move(x){
            if(lastX != x){
                if(x!=0){
                    socket.emit("commande", 0);
                }
                socket.emit("commande", x);
            }
            lastX = x;
        }
    }
}

function insertMBalls(e, n) {
    ballUpdate();
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
}

