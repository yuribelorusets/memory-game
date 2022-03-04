"use strict";

/** Memory game: find matching pairs of cards and flip both of them. */

const FOUND_MATCH_WAIT_MSECS = 1000;
const COLORS = [
  "red", "blue", "green", "orange", "purple",
  "red", "blue", "green", "orange", "purple",
];

const colors = shuffle(COLORS);


createCards(colors);

const gameBoard = document.getElementById("game");

let cards = gameBoard.getElementsByTagName("div");

var resetButton = document.getElementById("newGame");

resetButton.addEventListener("click", newGame);



/** Shuffle array items in-place and return shuffled array. */

function shuffle(items) {
  // This algorithm does a "perfect shuffle", where there won't be any
  // statistical bias in the shuffle (many naive attempts to shuffle end up not
  // be a fair shuffle). This is called the Fisher-Yates shuffle algorithm; if
  // you're interested, you can learn about it, but it's not important.

  for (let i = items.length - 1; i > 0; i--) {
    // generate a random index between 0 and i
    let j = Math.floor(Math.random() * i);
    // swap item at i <-> item at j
    [items[i], items[j]] = [items[j], items[i]];
  }

  return items;
}

/** Create card for every color in colors (each will appear twice)
 *
 * Each div DOM element will have:
 * - a class with the value of the color
 * - an click listener for each card to handleCardClick
 */

function createCards(colors) {

  const gameBoard = document.getElementById("game");

  for (let color of colors) {
    createCard(color);
  }


  function createCard(color) {
    const card = document.createElement("div");
    gameBoard.appendChild(card);
    card.classList.add(color);
    card.classList.toggle("unflipped");
    card.id = "card";

    card.addEventListener("click", handleCardClick);
  }

}

/** Flip a card face-up. */

function flipCard(card) {

  const cardColor = card.classList.item(0);

  card.style.backgroundColor = cardColor;

  card.classList.toggle("unflipped");

  if (isWinner()) {
    console.log("winner")
    isHighScore();
  }

}

/** Flip a card face-down. */

function unFlipCard(card) {

  card.style.backgroundColor = "white";

  card.classList.toggle("unflipped");

}

/** Handle clicking on a card: this could be first-card or second-card. */

let counter = 0;

let matchedList = [];

let isResetting = false;

let score = document.getElementById("score");

let highScore = document.getElementById("highscore");

const storedHighscore = localStorage.getItem("highscore")

let oldHigh = 999;


if (storedHighscore) {
  highScore.innerHTML = storedHighscore
}






function handleCardClick() {

  if (isResetting) {
    return;
  }

  if (!isFlipped(this)) {
    flipCard(this);
    counter++;
  }

  else if (isFlipped(this)) {
    unFlipCard(this);
    counter--;
  }

  if (counter > 1) {
    checkMatch(this);
    counter = 0;
  }

}






function checkMatch(card) {

  let checker = 0;

  const cardColor = card.classList.item(0);


  for (let i = 0; i < cards.length; i++) {

    if (cardColor == cards[i].classList.item(0) && isFlipped(cards[i]) && cards[i] != card) {

      checker++;

    }
  }

  if (checker < 1) {
    isResetting = true;
    score.innerHTML = parseInt(score.innerHTML, 10) + 1;
    setTimeout(resetCards, FOUND_MATCH_WAIT_MSECS);
  }

  else {
    matchedList.push(cardColor);
  }

}






function resetCards() {

  for (let i = 0; i < cards.length; i++) {
    if (isFlipped(cards[i]) && !matchedList.includes(cards[i].classList.item(0))) {
      unFlipCard(cards[i]);
    }
  }

  isResetting = false;
}





function isFlipped(card) {
  return (card.classList.item(1) == null);
}





function isWinner() {

  for (let i = 0; i < cards.length; i++) {
    if (isFlipped(cards[i]) == false) {
      return false;
    }
  }

  return true;
}






function isHighScore() {

  if (parseInt(score.innerHTML, 10) < oldHigh) {

    highScore.innerHTML = score.innerHTML;
    localStorage.setItem("highscore", score.innerHTML)
    oldHigh = score.innerHTML;

  }
}



function newGame() {

  matchedList = [];

  score.innerHTML = 0;

  counter = 0;

  for (let i = cards.length - 1; i >= 0; i--) {
    cards[i].remove();
    console.log(cards[i + 1])
  }

  createCards(shuffle(colors));

}


