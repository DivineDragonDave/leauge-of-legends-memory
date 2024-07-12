document.addEventListener("DOMContentLoaded", function () {
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  function shuffleCards() {
    const cardNames = [
      "101010101111000110101",
      "101101011100001111001",
      "101111110110000111101",
      "101100011101011111011",
      "101010101100000111011",
      "101101010111011000011",
      "111110000110101010101",
      "100101010101010101011",
      "100101101010111010101",
      "101011110101100110101",
      "101001010010111001101",
      "101011010101010101101",
      "101011011001011111101",
      "100101101010101010101",
      "100110100111011000001",
      "101010100101100101011",
      "100101111011001001101",
      "101001010101010101011",
      "101010111101001110111",
      "101010110100110010101",
      "101010101100101011111",
      "100110100101010111001",
      "101102100101110010111",
      "100000101011100101011",
      "100110110100110110011",
      "110100111000101110101",
      "100101010100011010101",
      "101011000110101011011",
      "101001010101110100101",
      "101011110010010110011",
      "110001111000101010011",
      "111100111110100111011",
      "101110101101110011011",
      "100101101001011101111",
      "100101011001011011111",
      "101100100000110010101",
      "101101011001010111011",
      "101101010101101111111",
      "110101000010100000111",
      "100101011011111111111",
    ];

    const selectedCards = shuffleArray([...cardNames]).slice(0, 10);
    const doubledCards = [...selectedCards, ...selectedCards];

    const shuffledCards = shuffleArray(doubledCards);
    createGameBoard(shuffledCards);
  }

  let timerInterval;

  function startTimer() {
    let elapsedTime = 0;
    clearInterval(timerInterval); // Clear existing timer
    timerInterval = setInterval(() => {
      elapsedTime++;
      document.getElementById(
        "timer"
      ).textContent = `Time: ${elapsedTime} seconds`;
    }, 1000);
  }

  const cards = document.querySelectorAll(".card");
  let hasFlippedCard = false;
  let firstCard, secondCard;
  let lockBoard = false;
  let matches = 0;
  let timerStarted = false;
  let startTime;
  let flips = 0;

  function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;

    this.classList.add("is-flipped");

    if (!timerStarted) {
      startTimer();
      timerStarted = true;
    }

    if (!hasFlippedCard) {
      hasFlippedCard = true;
      firstCard = this;
      return;
    }

    flips++;
    document.querySelector(".flips").textContent = `Flips: ${flips}`;

    secondCard = this;

    lockBoard = true; // Add this line to prevent further flips until check

    checkForMatch();
  }

  function checkForMatch() {
    let isMatch = firstCard.dataset.card === secondCard.dataset.card;

    if (isMatch) {
      disableCards();
      matches++;
      if (matches === 10) {
        clearInterval(timerInterval);
        setTimeout(() => {
          alert(
            `Congratulations! You completed the game in ${
              document.getElementById("timer").textContent
            } with ${flips} flips!`
          );
        }, 500);
      } else {
        lockBoard = false; // Release the board after successful match
      }
    } else {
      unflipCards();
    }
  }

  function disableCards() {
    const matchedPanel = document.getElementById("matched-panel");

    setTimeout(() => {
      // Clone only the first matched card and append to the matched panel
      const clone1 = firstCard.cloneNode(true);
      matchedPanel.appendChild(clone1);

      // Hide original matched cards
      firstCard.style.visibility = "hidden";
      secondCard.style.visibility = "hidden";

      firstCard.removeEventListener("click", flipCard);
      secondCard.removeEventListener("click", flipCard);

      resetBoard();
    }, 300); // 1 second delay
  }

  function unflipCards() {
    lockBoard = true;

    setTimeout(() => {
      firstCard.classList.remove("is-flipped");
      secondCard.classList.remove("is-flipped");

      resetBoard();
    }, 800);
  }

  function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
  }

  cards.forEach((card) => card.addEventListener("click", flipCard));

  (function shuffle() {
    cards.forEach((card) => {
      let randomPos = Math.floor(Math.random() * cards.length);
      card.style.order = randomPos;
    });
  })();

  const deck = document.querySelector(".deck");

  function createCard(cardName) {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.card = cardName;
    card.innerHTML = `
      <div class="front">
        <img src="/images/aalogo.jpg" alt="" />
      </div>
      <div class="back">
        <img src="/images/${cardName}.jpg" alt="" />
      </div>
    `;

    card.addEventListener("click", flipCard);
    return card;
  }

  function createGameBoard(shuffledCards) {
    deck.innerHTML = "";

    shuffledCards.forEach((cardName, index) => {
      const card = createCard(cardName);
      if (index < 20) {
        card.classList.remove("hidden");
      } else {
        card.classList.add("hidden");
      }
      deck.appendChild(card);
    });
  }

  function resetGame() {
    clearInterval(timerInterval); // Clear existing timer
    matches = 0;
    timerStarted = false;
    const matchedPanel = document.getElementById("matched-panel");
    matchedPanel.innerHTML = "";
    document.getElementById("timer").textContent = "Time: 0 seconds";
    flips = 0;
    document.querySelector(".flips").textContent = "Flips: 0";
    shuffleCards();
  }
  const resetButton = document.getElementById("reset-button");
  resetButton.addEventListener("click", function () {
    resetGame();
  });

  shuffleCards();
});
