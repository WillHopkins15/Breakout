var canvas;
var canvasContext;
var textWidth;
var gameBegin = false;
var numColumns = 8;
var numRows = 6;
var grid = [];

var ballX = 400;
var ballY = 490;
var ballRad = 10;
var ballSpeedY = 10;
var ballSpeedX = 5;
//

var playerX = 350;
var playerY = 500;
var paddleWidth = 100;
var paddleHeight = 10;
var score = 0;
var lives = 3;
var showGameOverScreen = false;

function calculateMousePos(evt){
	var rect = canvas.getBoundingClientRect();
	var root = document.documentElement;
	var mouseX = evt.clientX - rect.left - root.scrollLeft;
	var mouseY = evt.clientY - rect.top - root.scrollTop;
	return{
		x:mouseX,
		y:mouseY
	};
}

function handleMouseClick(evt) {
	if(showGameOverScreen) { 
		location.reload();
	} 
}

window.onload = function() {
	canvas = document.getElementById('gameCanvas');
	canvasContext = canvas.getContext('2d');
	drawEverything();
	for(var i = 0; i<numColumns*numRows; i++){
		grid[i] = 1;
	}

	setInterval(function() {
		if(gameBegin){
			moveBall();
		}
		drawEverything()
	}, 1000/30);

	canvas.addEventListener('mousedown', function(evt) {
		if(!gameBegin){
			gameBegin = true;
		}
	})

	canvas.addEventListener('mousedown', handleMouseClick)

	canvas.addEventListener('mousemove', function(evt) {
		var mousePos = calculateMousePos(evt);
		playerX = mousePos.x - paddleWidth/2;
		if(!gameBegin){
			ballX = mousePos.x;
		}
	})
}

function ballReset() {
	if(lives <= 0) {
		showGameOverScreen = true;
		gameBegin = false;
	}
	ballX = playerX + paddleWidth/2;
	ballY = playerY - ballRad;
	gameBegin = false;
}

function drawEverything() {

	drawRect(0, 0, canvas.width, canvas.height, 'Black');

	if(showGameOverScreen){
		canvasContext.fillStyle = 'White';
		canvasContext.font = '30px Courier';
		canvasContext.fillText("Game Over!", canvas.width/2 - canvasContext.measureText("Game Over!").width/2, canvas.height/2 + 10)
		canvasContext.font = '20px Courier';
		canvasContext.fillText("Click to continue", canvas.width/2 - canvasContext.measureText("Click to continue").width/2, canvas.height/2 + 40)
	} else {
		drawRect(0, 48, canvas.width, 2, 'White');

		drawCircle(ballX, ballY, ballRad, 'White');

		drawRect(playerX, playerY, paddleWidth, paddleHeight, 'White');

		canvasContext.font = '30px Courier';
		canvasContext.fillText("Score: " + score, 100, 35);
		canvasContext.fillText("Lives: " + lives, 500, 35);

		drawGrid();
	}
} 

function moveBall() {
	if(showGameOverScreen){
		return;
	}

	ballY -= ballSpeedY;
	ballX += ballSpeedX;

	if(ballY - ballRad <= 50){
		ballSpeedY = -ballSpeedY;
	} else if(ballY >= canvas.height - ballRad) {
		lives -= 1;		
		ballReset();
	} 

	if(ballX > playerX - ballRad && ballX < playerX + paddleWidth + ballRad && ballY >= playerY && ballY < playerY + 10) {
		ballSpeedY = -ballSpeedY;
		var deltaX = ballX - (playerX + paddleWidth/2);
		ballSpeedX = deltaX * 0.35;
	}

	if(ballX - ballRad <= 0) {
		ballSpeedX = -ballSpeedX;
	}

	if(ballX >= canvas.width - 2*ballRad) {
		ballSpeedX = -ballSpeedX;
	}

	for(var i in grid) {
		//bottom side block collision
		if(ballY - ballRad <= grid[i].YPos + grid[i].Height && ballY - ballRad > grid[i].YPos + grid[i].Height - 10 && ballX >= grid[i].XPos - 1 && ballX < grid[i].XPos + grid[i].Width + 1) {

			ballSpeedY = -ballSpeedY;
			grid[i] = 0;
			score += 5;
			return;

		//top side block collision
		} else if (ballY + ballRad >= grid[i].YPos && ballY + ballRad <= grid[i].YPos + 10 && ballX >= grid[i].XPos - 1 && ballX < grid[i].XPos + grid[i].Width + 1){

			ballSpeedY = -ballSpeedY;
			grid[i] = 0;
			score += 5;
			return;

		//left side block collision
		} else if (ballY >= grid[i].YPos && ballY <= grid[i].YPos + grid[i].Height && ballX + ballRad >= grid[i].XPos && ballX - ballRad < grid[i].XPos + 10){

			ballSpeedX = -ballSpeedX;
			grid[i] = 0;
			score += 5;
			return;

		//right side block collision
		} else if (ballY >= grid[i].YPos && ballY <= grid[i].YPos + grid[i].Height && ballX - ballRad <= grid[i].XPos + grid[i].Width && ballX >= grid[i].XPos + grid[i].Width - 10){

			ballSpeedX = -ballSpeedX;
			grid[i] = 0;
			score += 5;
			return;

		}
	}
}

function drawGrid() {
	var indent = 2;
	var gridX = 1;
	var gridY = indent/2+ 50;
	var boxWidth = canvas.width/numColumns - indent;
	var boxHeight = 28;

	for(var i = 0; i < numRows * numColumns; i++) {
		if(grid[i] != 0){
			grid[i] = new Brick(gridX, gridY, boxWidth, boxHeight, 'Blue');
		}
		if(gridX >= canvas.width - boxWidth - indent) {
			gridX = 1;
			gridY += boxHeight + indent;
		} else {
			gridX += boxWidth + indent;
		}
	}
}

function drawRect(XPos, YPos, Width, Height, fillColour) {
	canvasContext.fillStyle = fillColour;
	canvasContext.fillRect(XPos, YPos, Width, Height);
}

function drawCircle(XPos, YPos, Radius, fillColour) {
	canvasContext.fillStyle = fillColour;
	canvasContext.beginPath();
	canvasContext.arc(XPos, YPos, Radius, 0, Math.PI*2, true);
	canvasContext.fill();
}

function Brick(XPos, YPos, Width, Height, fillColour) {
	this.XPos = XPos;
	this.YPos = YPos;
	this.Width = Width;
	this.Height = Height;
	drawRect(XPos, YPos, Width, Height, fillColour)
}