document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('game-board');
    const timerDisplay = document.getElementById('time');
    const scoreDisplay = document.getElementById('score-count');
    let cards = [];
    let cardsChosen = [];
    let score = 0;
    let time = 40;

    async function fetchPokemon() {
        const baseUrl = 'https://pokeapi.co/api/v2/pokemon/';
        let imageUrls = [];
        for (let i = 1; i <= 8; i++) {
            const res = await fetch(`${baseUrl}${Math.floor(Math.random() * 150) + 1}`);
            const data = await res.json();
            imageUrls.push(data.sprites.front_default);
        }
        imageUrls = [...imageUrls, ...imageUrls];
        imageUrls.sort(() => 0.5 - Math.random());
        return imageUrls;
    }

    async function createBoard() {
        const urls = await fetchPokemon();
        urls.forEach((url, index) => {
            const card = document.createElement('div');
            card.setAttribute('class', 'card back');
            card.dataset.url = url; // 이미지 URL 저장
            card.dataset.id = index;
            gameBoard.appendChild(card);
            cards.push(card);
        });
        setTimeout(() => {
            cards.forEach(card => {
                card.classList.remove('back');
                card.style.backgroundImage = `url('${card.dataset.url}')`;
            });
            setTimeout(() => {
                cards.forEach(card => {
                    card.classList.add('back');
                    card.style.backgroundImage = '';
                });
            }, 5000); // 5초 후 모든 카드 뒤집기
        }, 500);
    }

    function flipCard() {
        if (!this.classList.contains('back')) return; // 이미 뒤집힌 카드는 무시
        this.classList.remove('back');
        this.style.backgroundImage = `url('${this.dataset.url}')`;
        cardsChosen.push(this);

        if (cardsChosen.length === 2) {
            setTimeout(checkMatch, 500);
        }
    }

    function checkMatch() {
        const [card1, card2] = cardsChosen;
        if (card1.dataset.url === card2.dataset.url) {
            score++;
            scoreDisplay.textContent = score;
        } else {
            card1.classList.add('back');
            card2.classList.add('back
