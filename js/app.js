/****************************************************************************
 * list of variables
 ***************************************************************************/
let listOfCards = ["fa-diamond", "fa-paper-plane-o", "fa-anchor", "fa-bolt", "fa-cube", "fa-leaf", "fa-bicycle", "fa-bomb"];
let gameStarted = false;  /* start game flag used to switch timer on/off */
let flippedCards = [];		/* list of flipped cards to compare each pair */
let matchFound = 0;				/* number of matches if 8 then gamed ends (if total cards=16) */
let moves = 0;						/* total number of moves */
var hours = minutes = seconds = 0;   /* stop watch timer: hrs:mins:secs */
let gameDuration = 0;		 /* total duration of the game */
var gameTimer = "";			/* timer method */

/* ======================================================================
 *  shuffle cards in the array so that order will be changed each game
 *  Shuffle function from http://stackoverflow.com/a/2450976
 *=======================================================================
 */
function shuffle(array) {
	var currentIndex = array.length,
		temporaryValue, randomIndex;

	while (currentIndex !== 0) {
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}

	return array;
}

/* ===================================
 *  create html card (li element)
 *  append card to deck
 * ===================================
 */
const createCard = function(cardName) {
	let ul = document.getElementById('gameDeck');
	let li = document.createElement("li");
	li.className = "card";
	li.insertAdjacentHTML('afterbegin', `<i class="fa ${cardName}"></i>`);
	document.getElementById('gameDeck').appendChild(li);
}

/* ======================================================================
 * generate deck cards
 * there are 16 cards so will loop twice as we have 8 types of cards
 * to make it harder -- can make it triple matching so will loop 3 times (24 cards)..later
 *======================================================================
 */
const generateDeck = function () {
	for (var i = 0; i < 2; i++) {
		listOfCards = shuffle(listOfCards);
		listOfCards.forEach(createCard);
	}
}

/*======================================================================
 * generate the game deck first
 *loop on cards and add click listener for each card
 *======================================================================
 */
const playGame = function () {
	generateDeck();
	let cards = document.getElementsByClassName('card');
	for (var i = 0; i < cards.length; i++) {
		cards[i].addEventListener('click', respondToTheClick);
	}
};

/*============================================================================
 * if the game started then start the timer (stop watch)
 * add the clicked card to flipped cards and show it then disable click on it
 *=============================================================================
 */
const respondToTheClick = function (evt) {
	if (gameStarted == false) {
		gameStarted = true;
		startTimer();
	}
	if (flippedCards.length === 0) {
		evt.target.classList.add('open');
		evt.target.classList.add('show');
		flippedCards.push(evt.target);
		disableClick();
	} else if (flippedCards.length === 1) {
		updateMoves();
		evt.target.classList.add('open');
		evt.target.classList.add('show');
		flippedCards.push(evt.target);
		setTimeout(matchFlippedCards, 900);
	}

}

/*=============================================================================================
 * disable click on card , after click on card (flipped),
 * not to match with it self if clicked twice
 *=============================================================================================
 */
const disableClick = function () {
	flippedCards.forEach(function (element) {
		element.removeEventListener("click", respondToTheClick)
	});
}

/*=============================================================================================
 * enable click again if the card does not match
 *=============================================================================================
 */
const enableClick = function () {
	flippedCards.forEach(function (element) {
		element.addEventListener("click", respondToTheClick)
	});
}

/*================================================================================
 * --> if pair of cards matched , then add class match for each
 * disable click on each    , remove them from flipped (opened cards)
 * check if the game ends
 * --> else then hide cards , enable click on them
 * remove them from flipped cards
 *=================================================================================
 */
const matchFlippedCards = function () {
	if (flippedCards[0].firstChild.className == flippedCards[1].firstChild.className) {
		flippedCards[0].classList.add("match");
		flippedCards[1].classList.add("match");
		disableClick();
		emptyFlippedCards();
		setTimeout(checkWinning, 900);
	} else {
		flippedCards[0].classList.remove("open");
		flippedCards[0].classList.remove("show");
		flippedCards[1].classList.remove("open");
		flippedCards[1].classList.remove("show");
		enableClick();
		emptyFlippedCards();

	}
}

/*=====================================
 * remove openCards
 *=====================================
 */
const emptyFlippedCards = function () {
	flippedCards = [];
}

/*================================================================================
 * check whether the game is finished or not
 * the game considered finished if matched pairs = 8 (if all cards = 16)
 * --> if not finished then increment total number of moves
 * --> else then show result in modal (show stars rate , duration )
 *=================================================================================
 */
const checkWinning = function () {
	matchFound += 1;
	if (matchFound == 8) {
 		document.getElementById('gameDeck').classList.add("win");
		//setTimeout(showResult(),12000);
		showResult();
		resetGame();
	}
}
/*============================================================
 * update total number of moves
 * stars rating depend on total number of moves
 *============================================================
 */
const updateMoves = function () {
	moves += 1;
	document.getElementsByClassName('moves')[0].innerText = moves;
	if (moves == 18 || moves == 24)
		addEmptyStar();
}

/*============================================================
 * the game starts with rating = 3 stars if moves exceeds the limit
 * then remove one star and so on .
 *============================================================
 */
const addEmptyStar = function () {
	let stars = document.getElementsByClassName('stars');
	let childcounts = stars[0].childElementCount;
	for (var i = 0; i < childcounts; i++) {
		if (stars[0].children[childcounts - 1 - i].children[0].classList.contains('fa-star-o'))
			continue;
		else {
			stars[0].children[childcounts - 1 - i].children[0].classList.remove('fa-star');
			stars[0].children[childcounts - 1 - i].children[0].classList.add('fa-star-o');
			break;
		}
	}

}

/*============================================================
 * when restarting the game , star rating need to be reseted
 * the game starts with 3 stars rating
 *============================================================
 */
const resetStarRating = function () {
	let stars = document.getElementsByClassName('stars');
	let childcounts = stars[0].childElementCount;
	for (var i = 0; i < childcounts; i++) {
		if (stars[0].children[i].children[0].classList.contains('fa-star-o')) {
			stars[0].children[i].children[0].classList.remove('fa-star-o');
			stars[0].children[i].children[0].classList.add('fa-star');
		}
	}
}
/*============================================================
 * reset the game (reset everything in the game )
 *============================================================
 */
const resetGame = function () {
	gameStarted = false;
	matchFound = 0;
	moves = 0;
	emptyFlippedCards();
	while (document.getElementById('gameDeck').hasChildNodes()) {
		document.getElementById('gameDeck').
		removeChild(document.getElementById('gameDeck').lastChild);
	}
	document.getElementsByClassName('moves')[0].innerText = 0;
	resetStarRating();
	gameDuration = document.getElementsByClassName('timer')[0].innerText;
	document.getElementsByClassName('timer')[0].innerText = "00:00:00";
	stopTimer();
	playGame();
}

/*============================================================
 * start the timer (stop watch) on the game start on first click
 *============================================================
 */
const startTimer = function () {
	hours = 0;
	minutes = 0;
	seconds = 0;
	gameTimer = setInterval(function () {
		seconds++;

		if (seconds == 60) {
			seconds = 0;
			minutes++;
		}

		if (minutes == 60) {
			minutes = 0;
			hours++;
		}
		// Compose the string for display
		var currentTimeString = (hours < 10 ? "0" : "") + hours + ":" +
			(minutes < 10 ? "0" : "") + minutes + ":" +
			(seconds < 10 ? "0" : "") + seconds;
		document.getElementsByClassName('timer')[0].innerText = currentTimeString;
	}, 1000);
}
/*============================================================
 * stop the stop watch
 *============================================================
 */
const stopTimer = function () {
	clearInterval(gameTimer);
}

/*============================================================
 * show the modal that contain the summary of the game
 * //...
 *============================================================
 */
const showResult = function () {
	// Get the modal
	var modal = document.getElementById('resultModal');
	// Get the <span> element that closes the modal
	var span = document.getElementsByClassName("close")[0];
	modal.style.display = "block";
	var movesSpan = document.getElementById('Modal_moves');
	movesSpan.innerText = moves;
	var durationSpan = document.getElementById('Modal_time');
	durationSpan.innerText = document.getElementsByClassName('timer')[0].innerText;

	// When the user clicks on <span> (x), close the modal
	span.onclick = function () {
		modal.style.display = "none";
	}

	let stars = document.getElementsByClassName('stars');
	let star_modal = document.getElementById('stars-modal');
	let resultStars=star_modal.childElementCount;
	if(resultStars > 0){
		for (var i = 0; i < resultStars; i++) {
			star_modal.removeChild(star_modal.childNodes[0]);
		}
	}
	let childcounts = stars[0].childElementCount;
	for (var i = 0; i < childcounts; i++) {
		if (stars[0].children[i].children[0].classList.contains('fa-star')) {
			let li = document.createElement("li");
			li.insertAdjacentHTML('afterbegin', `<i class="fa fa-star"></i>`);
			// li.innerHtml=`<i class="fa ${cardName}"></i>`;
			document.getElementById('stars-modal').appendChild(li);
		}
	}
}

//start the game
playGame();
document.getElementById("restart").addEventListener("click", resetGame);
