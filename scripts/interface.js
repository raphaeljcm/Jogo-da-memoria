// já crio minhas classes aq, caso precise mudar, só mudo aq
const FRONT = "cardFront";
const BACK = "cardBack";
const CARD = "card";
const ICON = "icon";
const FLIP = "flip";

startGame();

function startGame() {
  initializeCards(game.createCardsFromTechs()); // chamo o método de game.js
}

// MANIPULANDO A DOM
function initializeCards() {
  let gameBoard = document.querySelector("#gameBoard");
  gameBoard.innerHTML = ""; // limpando o game board
  
  game.cards.forEach(card => { // recebe o array de objetos
    let cardElement = document.createElement("div"); 
    
    // adicionando classes e atributos com o array de objetos já montado
    cardElement.id = card.id;
    cardElement.classList.add(CARD);
    cardElement.dataset.icon = card.icon;

    createCardContent(card, cardElement);

    cardElement.addEventListener("click", flipCard);
    gameBoard.appendChild(cardElement); // colocando minha div dentro do gameBoard
  });
}

function createCardContent(card, cardElement) {
  createCardFace(FRONT, card, cardElement);
  createCardFace(BACK, card, cardElement);
}

function createCardFace(face, card, element) {
  let cardElementFace = document.createElement("div");
  cardElementFace.classList.add(face);

  if(face === FRONT) { // se for a parte de cima, coloco a imagem
    let iconElement = document.createElement("img");
    iconElement.classList.add(ICON);
    iconElement.src = "./assets/" + card.icon + ".png";

    cardElementFace.appendChild(iconElement);
  } else { // se não, é o lado BACK
    cardElementFace.innerHTML = "&lt;/&gt;"
  }

  element.appendChild(cardElementFace);

  startMoves();
  getLocalStorage();
}

function startMoves() {
  game.moves = 0;

  let moves = document.getElementById("moves");
  moves.textContent = `Moves: ${game.moves}`;
}

function updateMoves() {
  game.moves++;

  let moves = document.getElementById("moves");
  moves.textContent = `Moves: ${game.moves}`;
}

function updateScore() {
  if(game.score.firstScore === true) {
    game.score.lsScore = game.moves;
    game.score.firstScore = false;
    game.localStorageUpdate(); // armazenando para trabalhar o localStorage
  } else if(game.moves < game.score.lsScore) {
    game.score.lsScore = game.moves;
    game.localStorageUpdate(); // armazenando para trabalhar o localStorage
  }
  let score = document.getElementById("score");
  score.textContent = `Score: ${game.score.lsScore}`;

}

function getLocalStorage() {
  let data = JSON.parse(localStorage.getItem("score"));
  if(data !== null && data.firstScore == false) {
    game.score = data;
    let score = document.getElementById("score");
    score.textContent = `Score: ${game.score.lsScore}`;
  }
}

function flipCard() {
  if(game.setCard(this.id)) {
    this.classList.add(FLIP);
    
    if(game.secondCard) { // Já tem a segunda carta selecionada?
      updateMoves();
      if(game.checkMatch()) { // deu match?
        game.clearCards(); // limpa

        if(game.checkGameOver()) {
          let gameOverLayer = document.querySelector("#gameOver");
          gameOverLayer.style.display = "flex"; // ativar a MODAL 
        }
      } else { // n rolou?
        setTimeout(() => { // 1s de silêncio
          let firstCardView = document.getElementById(game.firstCard.id);
          let secondCardView = document.getElementById(game.secondCard.id);

          // vira a carta de novo
          firstCardView.classList.remove(FLIP); 
          secondCardView.classList.remove(FLIP);
          game.unflipCards();
        }, 1000);
      };
    }
  }
}

function restart() {
  updateScore();
  game.clearCards();
  initializeCards(game.createCardsFromTechs());
  let gameOverLayer = document.querySelector("#gameOver");
  gameOverLayer.style.display = "none";
}