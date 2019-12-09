var WALL = 'WALL';
var FLOOR = 'FLOOR';
var WORMHOLE = 'WORMHOLE';
var BALL = 'BALL';
var GAMER = 'GAMER';
var GLUE = 'GLUE';
var BALL_SOUND = new Audio('audio/ball.wav');

var GAMER_IMG = '<img src="img/gamer.png">';
var BALL_IMG = '<img src="img/ball.png">';
var GLUE_IMG = '<img src="img/glue.png">';

// var gGamerPos = {
// 	i: getRandomInt(1, gBoard.length - 2),
// 	j: getRandomInt(1, gBoard[0].length - 2)
// };

var gGamerPos = {
	i: 3,
	j: 2
};
var gBoard = buildBoard();
var gCurrBallsCount = 2;
var gBallsCollected = 0;

renderBoard(gBoard);
var RandomBall = setInterval(addBallAtRandom, 4000);
var RandomGlue = setInterval(addGlueAtRandom, 5000);

function buildBoard() {
	// Create the Matrix 10 * 12 
	var board = new Array(10);
	for (var i = 0; i < board.length; i++) {
		board[i] = new Array(12);
	}
	for (var i = 0; i < board.length; i++) {
		for (var j = 0; j < board[0].length; j++) {
			// Put FLOOR everywhere and WALL at edges
			board[i][j] = { type: FLOOR, gameElement: null }
			if (i === 0 || j === 0 ||
				i === board.length - 1 || j === board[0].length - 1) {
				board[i][j].type = WALL;
			}
		}
	}
	// Make wormholes.
	board[0][5].type = board[board.length - 1][5].type = WORMHOLE;
	board[5][0].type = board[5][board[0].length - 1].type = WORMHOLE;
	// Place the gamer
	board[gGamerPos.i][gGamerPos.j].gameElement = GAMER;
	board[3][3].gameElement = BALL;
	board[3][8].gameElement = BALL;
	// console.table(board);
	return board;
}

// Render the board to an HTML table
function renderBoard(board) {

	var strHTML = '';
	for (var i = 0; i < board.length; i++) {
		strHTML += '<tr>\n';
		for (var j = 0; j < board[0].length; j++) {
			var currCell = board[i][j];

			var cellClass = getClassName({ i: i, j: j }) // e.g. - cell-3-8

			if (currCell.type === FLOOR) cellClass += ' floor';
			if (currCell.type === WORMHOLE) cellClass += ' wormhole';
			else if (currCell.type === WALL) cellClass += ' wall';

			strHTML += '\t<td class="cell ' + cellClass + '"  onclick="moveTo(' + i + ',' + j + ')" >\n';

			if (currCell.gameElement === GAMER) {
				strHTML += GAMER_IMG;
			} else if (currCell.gameElement === BALL) {
				strHTML += BALL_IMG;
			}

			strHTML += '\t</td>\n';
		}
		strHTML += '</tr>\n';
	}
	// console.log('strHTML is:');
	// console.log(strHTML);
	var elBoard = document.querySelector('.board');
	elBoard.innerHTML = strHTML;
}

// Move the player to a specific location
function moveTo(i, j) {

	var targetCell = gBoard[i][j];
	if (targetCell.type === WALL) return;

	// Calculate distance to ake sure we are moving to a neighbor cell
	var iAbsDiff = Math.abs(i - gGamerPos.i);
	var jAbsDiff = Math.abs(j - gGamerPos.j);

	// If the clicked Cell is one of the four allowed
	// if ((iAbsDiff === 1 && jAbsDiff === 0) || (jAbsDiff === 1 && iAbsDiff === 0)) {
	if (iAbsDiff + jAbsDiff === 1) {
		console.log('Moving to: ', i, j);

		if (targetCell.gameElement === BALL) {
			gBallsCollected++;
			gCurrBallsCount--;
			var elBallsCollected = document.querySelector('h2 span');
			elBallsCollected.innerText = gBallsCollected;
			// Play audio.
			BALL_SOUND.play();
			// Check for end of game.
			if (gCurrBallsCount === 0) {
				var elVictory = document.querySelector('.victory');
				elVictory.classList.remove('hide');
				var elButton = document.querySelector('button');
				elButton.classList.remove('hide');
				clearInterval(RandomBall);
				clearInterval(RandomGlue);
			}
		}

		if (targetCell.gameElement === GLUE) {
			stuck();
		}

		// Moving through wormholes
		if (i === 0) {
			i = gBoard.length - 1;
		}
		else if (i === gBoard.length - 1) {
			i = 0;
		}
		else if (j === 0) {
			j = gBoard[0].length - 1;
		}
		else if (j === gBoard[0].length - 1) {
			j = 0;
		}

		// Update the MODEL and DOM
		gBoard[gGamerPos.i][gGamerPos.j].gameElement = null;
		renderCell(gGamerPos, '');

		gGamerPos.i = i;
		gGamerPos.j = j;

		gBoard[gGamerPos.i][gGamerPos.j].gameElement = GAMER;
		renderCell(gGamerPos, GAMER_IMG);

	} else console.log('TOO FAR', iAbsDiff, jAbsDiff);
	console.log(gGamerPos.i);
}

// Convert a location object {i, j} to a selector and render a value in that element
function renderCell(location, value) {
	var cellSelector = '.' + getClassName(location)
	var elCell = document.querySelector(cellSelector);
	elCell.innerHTML = value;
}

function stuck() {
	function handleKey(event) {
		return;
	}
	handleKey(event)
	setTimeout(() => {return}, 3000);
}

// Move the player by keyboard arrows
function handleKey(event) {

	var i = gGamerPos.i;
	var j = gGamerPos.j;


	switch (event.key) {
		case 'ArrowLeft':
			moveTo(i, j - 1);
			break;
		case 'ArrowRight':
			moveTo(i, j + 1);
			break;
		case 'ArrowUp':
			moveTo(i - 1, j);
			break;
		case 'ArrowDown':
			moveTo(i + 1, j);
			break;

	}

}

// Returns the class name for a specific cell
function getClassName(location) {
	var cellClass = `cell-${location.i}-${location.j}`;
	return cellClass;
}

function addBallAtRandom() {
	var randomIIdx = getRandomInt(1, gBoard.length - 2);
	var randomJIdx = getRandomInt(1, gBoard[0].length - 2);
	var randomCell = gBoard[randomIIdx][randomJIdx];
	if (!randomCell.gameElement) {
		randomCell.gameElement = BALL;
		gCurrBallsCount++;
		renderCell({ i: randomIIdx, j: randomJIdx }, BALL_IMG);
	}
	else addBallAtRandom();
}

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function resetGame() {
	addBallAtRandom();
	addBallAtRandom();
	gCurrBallsCount = 2;
	gBallsCollected = 0;
	// Remove the victory sign.
	var elVictory = document.querySelector('.victory');
	elVictory.classList.add('hide');
	// Remove the play again button.
	var elVictory = document.querySelector('button');
	elVictory.classList.add('hide');
	var elBallsCollected = document.querySelector('h2 span');
	elBallsCollected.innerText = gBallsCollected;
	RandomBall = setInterval(addBallAtRandom, 4000);
}

function addGlueAtRandom() {
	var randomIIdx = getRandomInt(1, gBoard.length - 2);
	var randomJIdx = getRandomInt(1, gBoard[0].length - 2);
	var randomCell = gBoard[randomIIdx][randomJIdx];
	if (!randomCell.gameElement) {
		randomCell.gameElement = GLUE;
		renderCell({ i: randomIIdx, j: randomJIdx }, GLUE_IMG);
		setTimeout(renderCell, 3000, { i: randomIIdx, j: randomJIdx }, '');
	}
	else addGlueAtRandom();
}

