/*
 * Create a list that holds all of your cards
 */
let List_Of_Cards = ["fa-diamond", "fa-paper-plane-o", "fa-anchor", "fa-bolt", "fa-cube", "fa-leaf", "fa-bicycle", "fa-bomb"];
let game_started=false;
let flipped_Cards=[];
/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

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
function createCard(cardName){
  let ul=document.getElementById('gameDeck');
  let li=document.createElement("li");
  li.className="card";
  li.insertAdjacentHTML('afterbegin', `<i class="fa ${cardName}"></i>`);
  // li.innerHtml=`<i class="fa ${cardName}"></i>`;
  document.getElementById('gameDeck').appendChild(li);
}

/*    generate deck cards
there are 16 cards so will loop twice as we have 8 types of cards
to make it harder -- can make it triple matching so will loop 3 times (24 cards)..later
*/
function generateDeck(){
  for (var i = 0; i < 2; i++) {
    List_Of_Cards=shuffle(List_Of_Cards);
    List_Of_Cards.forEach(createCard);
  }
}
function playGame(){
  generateDeck();
  let cards=  document.getElementsByClassName('card');
  for (var i = 0; i < cards.length; i++) {
    cards[i].addEventListener('click', respondToTheClick);
  }
}

function respondToTheClick(evt) {
    evt.target.classList.add('open');
    evt.target.classList.add('show');
    console.log('A paragraph was clicked: ' + evt.target.textContent);
}

function toggleCard(){

  if(game_started==false){
    game_started=true;
    //startTimer
  }

  if (flipped_Cards.length === 0) {
          $(this).toggleClass("show open").animateCss('flipInY');
          openCards.push($(this));
          disableCLick();
      }

}

//start the game
playGame();


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
