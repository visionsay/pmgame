document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('game-board');
    const timerDisplay = document.getElementById('time');
    const scoreDisplay = document.getElementById('score-count');
    let cards = [];
    let cardsChosen = [];
    let score = 0;
    let time = 40;

    // 포켓몬 데이터 가져오기 및 보드 초기화
    async function fetchPokemon() {
        const baseUrl = 'https://pokeapi.co/api/v2/pokemon/';
        let imageUrls = [];
        for (let i = 1; i <= 8; i++) { // 8개의 포켓몬
            const res = await fetch(`${baseUrl}${Math.floor(Math.random() * 150) + 1}`);
            const data = await res.json();
            imageUrls.push(data.sprites.front_default);
        }
        imageUrls = [...imageUrls, ...imageUrls]; // 각 이미지를 두 번 사용
        imageUrls.sort(() => 0.5 - Math.random()); // 카드 섞기
        return imageUrls;
    }

    async function createBoard() {
        const urls = await fetchPokemon();
        urls.forEach((url, index) => {
            const card = document.createElement('div');
            card.setAttribute('class', 'card');
            card.setAttribute('data-id', index);
            card.style.backgroundImage = `url(${url})`;
            card.addEventListener('click', flipCard);
            gameBoard.appendChild(card);
            cards.push(card);
        });
        setTimeout(() => {
            cards.forEach(card => card.style.backgroundImage = '');
        }, 5000); // 5초 후 모든 카드 뒤집기
    }

    function flipCard() {
        const clickedCard = this;
        if (!clickedCard.style.backgroundImage) {
            const cardId = clickedCard.getAttribute('data-id');
            clickedCard.style.backgroundImage = `url(${urls[cardId]})`;
            cardsChosen.push(clickedCard);

            if (cardsChosen.length === 2) {
                setTimeout(checkMatch, 500);
            }
        }
    }

    function checkMatch() {
        const [card1, card2] = cardsChosen;
        if (card1.style.backgroundImage === card2.style.backgroundImage) {
            score++;
            scoreDisplay.textContent = score;
            card1.removeEventListener('click', flipCard);
            card2.removeEventListener('click', flipCard);
        } else {
            card1.style.backgroundImage = '';
            card2.style.backgroundImage = '';
        }
        cardsChosen = [];
    }

    // 타이머 설정
    function startTimer() {
        const timer = setInterval(() => {
            time--;
            timerDisplay.textContent = `${time} seconds`;
            if (time <= 0) {
                clearInterval(timer);
                alert('Game over!');
                cards.forEach(card => card.removeEventListener('click', flipCard));
            }
        }, 1000);
    }

    startTimer();
    createBoard();
});
