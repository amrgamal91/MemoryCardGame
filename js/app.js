/****************************************************************************
 * list of variables
 ***************************************************************************/
let listOfCards = [
  "fa-diamond"
  // , "fa-bomb"
];
let gameStarted = false; /* start game flag used to switch timer on/off */
let flippedCards = []; /* list of flipped cards to compare each pair */
let matchFound = 0; /* number of matches if 8 then gamed ends (if total cards=16) */
let moves = 0; /* total number of moves */
var hours = (minutes = seconds = 0); /* stop watch timer: hrs:mins:secs */
let gameDuration = 0; /* total duration of the game */
var gameTimer = ""; /* timer method */
var score = 0;
/* ======================================================================
 *  shuffle cards in the array so that order will be changed each game
 *  Shuffle function from http://stackoverflow.com/a/2450976
 *=======================================================================
 */
function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;

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
  let ul = document.getElementById("gameDeck");
  let li = document.createElement("li");
  li.className = "card";

  //   li.innerHTML = `<img src="../img/avocado-icon.jpg"></img>`;
  //   li.insertAdjacentHTML("afterbegin", `<i class="fa ${cardName}"></i>`);
  //   li.insertAdjacentHTML(
  //     "afterbegin",
  //     `<img src="../img/avocado-icon.jpg"></img>`
  //   );

  document.getElementById("gameDeck").appendChild(li);
};

/* ======================================================================
 * generate deck cards
 * there are 16 cards so will loop twice as we have 8 types of cards
 * to make it harder -- can make it triple matching so will loop 3 times (24 cards)..later
 *======================================================================
 */
const generateDeck = function() {
  for (var i = 0; i < 12; i++) {
    // listOfCards = shuffle(listOfCards);
    listOfCards.forEach(createCard);
  }
};

/*======================================================================
 * generate the game deck first
 *loop on cards and add click listener for each card
 *======================================================================
 */
const playGame = function() {
  startTimer();
  generateDeck();
  startPlaying();

  setInterval(redirectToEnd, 60000);
};
const startPlaying = function() {
  setInterval(PlayOneCycle, 4000);
};

const PlayOneCycle = function() {
  let cards = document.getElementsByClassName("card");
  let index = Math.floor(Math.random() * 11) + 1;
  var event = new Event("click");
  console.log("card index : " + index);
  if (cards[index]) {
    cards[index].innerHTML = "";
    cards[index].addEventListener(
      "click",
      function(evt) {
        evt.target.classList.add("open");
        evt.target.classList.add("show");
        //add avocado icon
        var AvocadoIconUrl =
          "https://i.pinimg.com/originals/a1/7a/f7/a17af7dcff12a96e2795979f5da9e99d.jpg";
        var img = document.createElement("img");
        img.id = "avocadoImage";
        img.src = AvocadoIconUrl;
        img.width = 80;
        img.height = 80;
        var elementexist = document.getElementById("avocadoImage");
        if (!elementexist) {
          evt.target.appendChild(img);
        }
        //handle click
        // var event = new Event("clickHandler");
        // cards[index].addEventListener("click", function() {
        //   score += 5;
        //   var scoreValue = document.getElementById("score-value");
        //   scoreValue.innerText = score;
        // });
        var avocadoImage = document.getElementById("avocadoImage");
        avocadoImage.addEventListener("click", function() {
          score += 5;
          var scoreValue = document.getElementById("score-value");
          scoreValue.innerText = score;

          var element = document.getElementById("avocadoImage");
          element.parentNode.removeChild(element);
          var MoleIconUrl =
            "data:image/png;base64,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";
          var img = document.createElement("img");
          img.id = "MoleImage";
          img.src = MoleIconUrl;
          img.width = 80;
          img.height = 80;
          var elementexisted = document.getElementById("MoleImage");
          if (!elementexisted) {
            evt.target.appendChild(img);
          }
        });
        // setTimeout(function() {
        //   var avocadoImage = document.getElementById("avocadoImage");
        //   avocadoImage.addEventListener("click", function() {
        //     score += 5;
        //     var scoreValue = document.getElementById("score-value");
        //     scoreValue.innerText = score;
        //   });
        // }, 1500);

        //here change the icon
        // setTimeout(function() {
        //   //
        //   var element = document.getElementById("avocadoImage");
        //   element.parentNode.removeChild(element);
        //   var MoleIconUrl =
        //     "https://image.shutterstock.com/image-illustration/mole-icon-black-portrait-flat-260nw-1134339599.jpg";
        //   var img = document.createElement("img");
        //   img.id = "MoleImage";
        //   img.src = MoleIconUrl;
        //   img.width = 80;
        //   img.height = 80;
        //   var elementexisted = document.getElementById("MoleImage");
        //   if (!elementexisted) {
        //     evt.target.appendChild(img);
        //   }
        // }, 2000);

        //close card
        setTimeout(function() {
          var element = document.getElementById("MoleImage");
          if (element) {
            element.parentNode.removeChild(element);
          } else {
            var element = document.getElementById("avocadoImage");
            element.parentNode.removeChild(element);
          }

          evt.target.classList.remove("open");
          evt.target.classList.remove("show");
          evt.target.innerHTML = "";
        }, 2500);
      },
      false
    );
    cards[index].dispatchEvent(event);
  }
};

const redirectToEnd = function() {
  localStorage.setItem("score", score);
  window.location.href = "end.html";
};

/*============================================================================
 * if the game started then start the timer (stop watch)
 * add the clicked card to flipped cards and show it then disable click on it
 *=============================================================================
 */
const respondToTheClick = function(evt) {
  console.log("here is the event .......");
  if (gameStarted == false) {
    gameStarted = true;
    // startTimer();
  }
  //   if (flippedCards.length === 0) {
  evt.target.classList.add("open");
  evt.target.classList.add("show");
  flippedCards.push(evt.target);
  // disableClick();
  //   } else if (flippedCards.length === 1) {
  //     updateMoves();
  //     evt.target.classList.add("open");
  //     evt.target.classList.add("show");
  //     flippedCards.push(evt.target);
  //     setTimeout(matchFlippedCards, 900);
  //   }
};

/*=============================================================================================
 * disable click on card , after click on card (flipped),
 * not to match with it self if clicked twice
 *=============================================================================================
 */
const disableClick = function() {
  flippedCards.forEach(function(element) {
    element.removeEventListener("click", respondToTheClick);
  });
};

/*=============================================================================================
 * enable click again if the card does not match
 *=============================================================================================
 */
const enableClick = function() {
  flippedCards.forEach(function(element) {
    element.addEventListener("click", respondToTheClick);
  });
};

/*================================================================================
 * --> if pair of cards matched , then add class match for each
 * disable click on each    , remove them from flipped (opened cards)
 * check if the game ends
 * --> else then hide cards , enable click on them
 * remove them from flipped cards
 *=================================================================================
 */
const matchFlippedCards = function() {
  if (
    flippedCards[0].firstChild.className == flippedCards[1].firstChild.className
  ) {
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
};

/*=====================================
 * remove openCards
 *=====================================
 */
const emptyFlippedCards = function() {
  flippedCards = [];
};

/*================================================================================
 * check whether the game is finished or not
 * the game considered finished if matched pairs = 8 (if all cards = 16)
 * --> if not finished then increment total number of moves
 * --> else then show result in modal (show stars rate , duration )
 *=================================================================================
 */
const checkWinning = function() {
  matchFound += 1;
  if (matchFound == 8) {
    document.getElementById("gameDeck").classList.add("win");
    waitAndShowResult();
    resetGame();
  }
};
/*============================================================
 * delay the execution of showResult for 1 second to display
 * the winning animation on the game board
 *============================================================
 */
function waitAndShowResult() {
  return new Promise(resolve => {
    setTimeout(() => {
      showResult();
    }, 900);
  });
}

/*============================================================
 * update total number of moves
 * stars rating depend on total number of moves
 *============================================================
 */
const updateMoves = function() {
  moves += 1;
  document.getElementsByClassName("moves")[0].innerText = moves;
  if (moves == 18 || moves == 24) addEmptyStar();
};

/*============================================================
 * the game starts with rating = 3 stars if moves exceeds the limit
 * then remove one star and so on .
 *============================================================
 */
const addEmptyStar = function() {
  let stars = document.getElementsByClassName("stars");
  let childcounts = stars[0].childElementCount;
  for (var i = 0; i < childcounts; i++) {
    if (
      stars[0].children[childcounts - 1 - i].children[0].classList.contains(
        "fa-star-o"
      )
    )
      continue;
    else {
      stars[0].children[childcounts - 1 - i].children[0].classList.remove(
        "fa-star"
      );
      stars[0].children[childcounts - 1 - i].children[0].classList.add(
        "fa-star-o"
      );
      break;
    }
  }
};

/*============================================================
 * when restarting the game , star rating need to be reseted
 * the game starts with 3 stars rating
 *============================================================
 */
const resetStarRating = function() {
  let stars = document.getElementsByClassName("stars");
  let childcounts = stars[0].childElementCount;
  for (var i = 0; i < childcounts; i++) {
    if (stars[0].children[i].children[0].classList.contains("fa-star-o")) {
      stars[0].children[i].children[0].classList.remove("fa-star-o");
      stars[0].children[i].children[0].classList.add("fa-star");
    }
  }
};
/*============================================================
 * reset the game (reset everything in the game )
 *============================================================
 */
const resetGame = function() {
  gameStarted = false;
  matchFound = 0;
  moves = 0;
  emptyFlippedCards();
  while (document.getElementById("gameDeck").hasChildNodes()) {
    document
      .getElementById("gameDeck")
      .removeChild(document.getElementById("gameDeck").lastChild);
  }
  document.getElementsByClassName("moves")[0].innerText = 0;
  resetStarRating();
  gameDuration = document.getElementsByClassName("timer")[0].innerText;
  document.getElementsByClassName("timer")[0].innerText = "00:00:00";
  stopTimer();
  playGame();
};

/*============================================================
 * start the timer (stop watch) on the game start on first click
 *============================================================
 */
const startTimer = function() {
  hours = 0;
  minutes = 1;
  seconds = 60;

  gameTimer = setInterval(function() {
    seconds--;

    if (seconds == 60) {
      seconds = 0;
      minutes--;
    }

    if (minutes == 60) {
      minutes = 0;
      hours--;
    }
    // Compose the string for display
    var currentTimeString =
      (hours < 10 ? "0" : "") +
      hours +
      ":" +
      (minutes < 10 ? "0" : "") +
      minutes +
      ":" +
      (seconds < 10 ? "0" : "") +
      seconds;
    document.getElementsByClassName("timer")[0].innerText = currentTimeString;
    if (minutes == 0 && seconds < 11) {
      document.getElementsByClassName("timer")[0].style.color = "red";
      document.getElementsByClassName("timer")[0].style.fontWeight = "900";
      document.getElementsByClassName("timer")[0].classList.add("pulseit");
    }
  }, 1000);
};
/*============================================================
 * stop the stop watch
 *============================================================
 */
const stopTimer = function() {
  clearInterval(gameTimer);
};

/*============================================================
 * show the modal that contain the summary of the game
 * //...
 *============================================================
 */
// const showResult = function() {
//   // Get the modal
//   var modal = document.getElementById("resultModal");
//   // Get the <span> element that closes the modal
//   var span = document.getElementsByClassName("close")[0];
//   modal.style.display = "block";
//   var movesSpan = document.getElementById("Modal_moves");
//   movesSpan.innerText = moves;
//   var durationSpan = document.getElementById("Modal_time");
//   durationSpan.innerText = document.getElementsByClassName(
//     "timer"
//   )[0].innerText;

//   // When the user clicks on <span> (x), close the modal
//   span.onclick = function() {
//     modal.style.display = "none";
//   };

//   let stars = document.getElementsByClassName("stars");
//   let star_modal = document.getElementById("stars-modal");
//   let resultStars = star_modal.childElementCount;
//   if (resultStars > 0) {
//     for (var i = 0; i < resultStars; i++) {
//       star_modal.removeChild(star_modal.childNodes[0]);
//     }
//   }
//   let childcounts = stars[0].childElementCount;
//   for (var i = 0; i < childcounts; i++) {
//     if (stars[0].children[i].children[0].classList.contains("fa-star")) {
//       let li = document.createElement("li");
//       li.insertAdjacentHTML("afterbegin", `<i class="fa fa-star"></i>`);
//       // li.innerHtml=`<i class="fa ${cardName}"></i>`;
//       document.getElementById("stars-modal").appendChild(li);
//     }
//   }
// };

//start the game
playGame();
// document.getElementById("restart").addEventListener("click", resetGame);
