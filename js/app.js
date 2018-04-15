/*
 * Create a list that holds all of your cards
 */
let List_Of_Cards = ["fa-diamond", "fa-paper-plane-o", "fa-anchor", "fa-bolt", "fa-cube", "fa-leaf", "fa-bicycle", "fa-bomb"];
let game_started = false;
let flipped_Cards = [];
let match_found = 0;
let moves = 0;
var hours = 0;
var minutes = 0;
var seconds = 0;
let gameDuration = 0;
var gameTimer = "";
/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
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
/* 1- create html card
   2- append card to deck
  */
function createCard(cardName) {
	let ul = document.getElementById('gameDeck');
	let li = document.createElement("li");
	li.className = "card";
	li.insertAdjacentHTML('afterbegin', `<i class="fa ${cardName}"></i>`);
	// li.innerHtml=`<i class="fa ${cardName}"></i>`;
	document.getElementById('gameDeck').appendChild(li);
}

/*    generate deck cards
there are 16 cards so will loop twice as we have 8 types of cards
to make it harder -- can make it triple matching so will loop 3 times (24 cards)..later
*/
function generateDeck() {
	for (var i = 0; i < 2; i++) {
		List_Of_Cards = shuffle(List_Of_Cards);
		List_Of_Cards.forEach(createCard);
	}
}

function playGame() {
	generateDeck();
	let cards = document.getElementsByClassName('card');
	for (var i = 0; i < cards.length; i++) {
		cards[i].addEventListener('click', respondToTheClick);
	}
}

function respondToTheClick(evt) {

	if (game_started == false) {
		game_started = true;
		startTimer();
	}
	if (flipped_Cards.length === 0) {
		evt.target.classList.add('open');
		evt.target.classList.add('show');
		flipped_Cards.push(evt.target);
		disableClick();
	} else if (flipped_Cards.length === 1) {
		updateMoves();
		evt.target.classList.add('open');
		evt.target.classList.add('show');
		flipped_Cards.push(evt.target);
		setTimeout(matchFlippedCards, 1100);
	}

}

function disableClick() {
	flipped_Cards.forEach(function (element) {
		element.removeEventListener("click", respondToTheClick)
	});
}

function enableClick() {
	flipped_Cards.forEach(function (element) {
		element.addEventListener("click", respondToTheClick)
	});
}

function matchFlippedCards() {
	if (flipped_Cards[0].firstChild.className == flipped_Cards[1].firstChild.className) {
		flipped_Cards[0].classList.add("match");
		flipped_Cards[1].classList.add("match");
		disableClick();
		emptyFlippedCards();
		setTimeout(checkWinning, 1000);
	} else {
		flipped_Cards[0].classList.remove("open");
		flipped_Cards[0].classList.remove("show");
		flipped_Cards[1].classList.remove("open");
		flipped_Cards[1].classList.remove("show");
		enableClick();
		emptyFlippedCards();

	}
}

// function to remove openCards
function emptyFlippedCards() {
	flipped_Cards = [];
}

// check whether the game is finished or not
function checkWinning() {
	match_found += 1;
	if (match_found == 8) {
    showResult();
		 resetGame();
		// alert("You won the game,game duration = " + gameDuration); //add show result method
	}
}

function updateMoves() {
	moves += 1;
	document.getElementsByClassName('moves')[0].innerText = moves;
	// movdiv[0].innerText=moves;
	if (moves == 18 || moves == 24)
		addEmptyStar();
}

function addEmptyStar() {
	let stars = document.getElementsByClassName('stars');
	let childcounts = stars[0].childElementCount;
	for (var i = 0; i < childcounts; i++) {
		if (stars[0].children[childcounts-1-i].children[0].classList.contains('fa-star-o'))
			continue;
		else {
			stars[0].children[childcounts-1-i].children[0].classList.remove('fa-star');
			stars[0].children[childcounts-1-i].children[0].classList.add('fa-star-o');
			break;
		}
	}

}
function resetStarRating(){
  let stars = document.getElementsByClassName('stars');
	let childcounts = stars[0].childElementCount;
	for (var i = 0; i < childcounts; i++) {
		if (stars[0].children[i].children[0].classList.contains('fa-star-o')){
      stars[0].children[i].children[0].classList.remove('fa-star-o');
			stars[0].children[i].children[0].classList.add('fa-star');
    }
  }
}

function resetGame() {
	game_started = false;
	match_found = 0;
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

function startTimer() {
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

function stopTimer() {
	clearInterval(gameTimer);
}

function showResult(){
  // Get the modal
  var modal = document.getElementById('myModal');
  // Get the <span> element that closes the modal
  var span = document.getElementsByClassName("close")[0];
  modal.style.display = "block";
  var movesSpan=document.getElementById('Modal_moves');
  movesSpan.innerText=moves;
  var durationSpan=document.getElementById('Modal_time');
  durationSpan.innerText=document.getElementsByClassName('timer')[0].innerText;

  // When the user clicks on <span> (x), close the modal
  span.onclick = function() {
    modal.style.display = "none";
  }

  let stars = document.getElementsByClassName('stars');
  let star_modal=document.getElementById('stars-modal');
	let childcounts = stars[0].childElementCount;
	for (var i = 0; i < childcounts; i++) {
		if (stars[0].children[i].children[0].classList.contains('fa-star')){
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

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
