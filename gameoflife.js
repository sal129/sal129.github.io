var PROB = 0.45;
var INTERVAL = 50;
var COPIA = 200;
var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');
var matrix = new Array(COPIA);
var imatrix = new Array(COPIA);
for (var i = 0; i < COPIA; i++) {
	matrix[i] = new Array(COPIA);
	imatrix[i] = new Array(COPIA);
}

function init() {
	for (var i = 0; i < COPIA; i++) {
		for (var j = 0; j < COPIA; j++) {
			if (Math.random() > PROB) {
				ctx.fillStyle = '#000000';
				matrix[i][j] = 1;
			}
			else {
				ctx.fillStyle = '#88FFFF';
				matrix[i][j] = 0;
			}
			ctx.fillRect(5 * i, 5 * j, 4, 4);
		}
	}
	drawFuture();
}

function futureState(x, y, matrix) {
	var x = arguments[0];
	var y = arguments[1];
	var matrix = arguments[2];
	var surround = 0;
	for (var i = -1; i <= 1; i++) {
		if (x + i < 0 || x + i > COPIA - 1) {
			continue;
		}
		for (var j = -1; j <= 1; j++) {
			if (y + j < 0 || y + j > COPIA - 1 || (i == 0 && j == 0)) {
				continue;
			}
			if (!matrix[x + i][y + j]) {
				surround++;
			}
		}
	}
	if (surround == 3) {
		return 0;
	}
	else if (surround == 2) {
		return matrix[x][y];
	}
	else {
		return 1;
	}
}

function drawFuture() {
	for (var i = 0; i < COPIA; i++) {
		for (var j = 0; j < COPIA; j++) {
			if (futureState(i, j, matrix)) {
				ctx.fillStyle = '#000000';
				imatrix[i][j] = 1;
			}
			else {
				ctx.fillStyle = '#88FFFF';
				imatrix[i][j] = 0;
			}
			ctx.fillRect(5 * i, 5 * j, 4, 4);
		}
	}
	for (var i = 0; i < COPIA; i++) {
		for (var j = 0; j < COPIA; j++) {
		matrix[i][j] = imatrix[i][j];
		}
	}
	setTimeout("drawFuture()", INTERVAL);
}

init();