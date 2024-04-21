const gameBoard = document.getElementById('game-board');
const scoreDisplay = document.getElementById('score');
const messageDisplay = document.getElementById('message');
const timerDisplay = document.createElement('div');
timerDisplay.id = 'timer';
document.body.appendChild(timerDisplay);

let pokemons = [];
let cards = [];
let flippedCards = [];
let matchedCards = [];
let score = 0;
let timer;
let timeLeft = 40;

const fetchPokemons = async () => {
  const requests = [];
  for (let i = 1; i <= 16; i++) {
    requests.push(fetch(`https://pokeapi.co/api/v2/pokemon/${i}`).then(res => res.json()));
  }
  try {
    pokemons = await Promise.all(requests);
    showCards();
    setTimeout(createCards, 5000);
  } catch (error) {
    console.error('Failed to fetch Pokemons:', error);
  }
};

const showCards = () => {
  const fragment = document.createDocumentFragment();
  pokemons.forEach(pokemon => {
    const card = createCardElement(pokemon, false);
    fragment.appendChild(card);
  });
  gameBoard.appendChild(fragment);
};

const createCards = () => {
  gameBoard.innerHTML = '';
  const duplicatedPokemons = [...pokemons, ...pokemons];
  shuffleArray(duplicatedPokemons);

  const fragment = document.createDocumentFragment();
  duplicatedPokemons.forEach(pokemon => {
    const card = createCardElement(pokemon, true);
    cards.push(card);
    fragment.appendChild(card);
  });
  gameBoard.appendChild(fragment);

  startTimer();
};

const createCardElement = (pokemon, isPlayable) => {
  const card = document.createElement('div');
  card.classList.add('card');
  card.dataset.pokemonId = pokemon.id;

  const frontView = document.createElement('div');
  frontView.classList.add('front');
  const image = document.createElement('img');
  image.src = pokemon.sprites.front_default;
  frontView.appendChild(image);

  const backView = document.createElement('div');
  backView.classList.add('back');
  if (isPlayable) {
    const pokemonName = document.createElement('p');
    pokemonName.textContent = pokemon.name;
    backView.appendChild(pokemonName);
    card.addEventListener('click', flipCard);
  }

  card.appendChild(frontView);
  card.appendChild(backView);

  return card;
};

const flipCard = (e) => {
  const card = e.currentTarget;
  if (flippedCards.length < 2 && !card.classList.contains('flipped') && !matchedCards.includes(card)) {
    card.classList.add('flipped');
    flippedCards.push(card);
  }
  if (flippedCards.length === 2) {
    checkMatch();
  }
};

const checkMatch = () => {
  const [card1, card2] = flippedCards;
  if (card1.dataset.pokemonId === card2.dataset.pokemonId) {
    matchedCards.push(card1, card2);
    flippedCards = [];
    score += 10;
    scoreDisplay.textContent = `Score: ${score}`;
    if (matchedCards.length === cards.length) {
      messageDisplay.textContent = 'Congratulations! You won!';
      clearInterval(timer);
    }
  } else {
    messageDisplay.textContent = 'Oops, try again!';
    setTimeout(() => {
      card1.classList.remove('flipped');
      card2.classList.remove('flipped');
      flippedCards = [];
      messageDisplay.textContent = '';
    }, 1000);
  }
};

const startTimer = () => {
  timer = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = `Time: ${timeLeft}s`;
    if (timeLeft === 0) {
      clearInterval(timer);
      messageDisplay.textContent = "Time's up! Game over.";
      cards.forEach(card => card.classList.add('flipped'));
    }
  }, 1000);
};

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // ES6 destructuring swap
  }
};

fetchPokemons();
