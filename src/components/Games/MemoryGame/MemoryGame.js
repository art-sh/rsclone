import cardsArray from './js/cardsArray';
import './scss/style.scss';

export default class MemoryGame {
  constructor(app, size) {
    this.$app = app;
    this.gameConfig = this.$app.config.games.memoryGame;
    this.guess = 0;
    this.firstGuess = '';
    this.secondGuess = '';
    this.previousClick = null;
    this.delay = 1000;
    this.timer = 0;
    this.clear = 0;
    this.timeNode = document.querySelector('#timer');
    this.isGameActive = false; // for start timing
    this.score = 0;
    this.scoreNode = document.querySelector('#score');
    this.win = 0;
    this.size = size; // for level
    this.step = 4; // for change level
    this.section = document.querySelector('.memory__grid');
    this.game = document.querySelector('#memory-game');
    this.selected = document.querySelectorAll('.selected');
  }

  getGameNode() {
    const game = document.createElement('div');
    game.setAttribute('id', 'memory-game');
    const section = document.createElement('section');
    section.setAttribute('class', 'memory__grid');
    section.addEventListener('click', (event) => this.flipCard(event));
    const panel = document.createElement('div');
    panel.setAttribute('class', 'memory__panel');
    const timer = document.createElement('div');
    timer.insertAdjacentHTML('afterBegin', '<span>Time:</span>');
    timer.insertAdjacentHTML('beforeEnd', '<span id="timer">00:00</span>');
    const score = document.createElement('div');
    score.insertAdjacentHTML('afterBegin', '<span>Score:</span>');
    score.insertAdjacentHTML('beforeEnd', '<span id="score">0</span>');

    panel.append(score, timer);
    game.append(section, panel);
    return game;
  }

  createCards(size) {
    const resizedArray = cardsArray
      .sort(() => 0.5 - Math.random())
      .slice(0, size);
    const gameBoard = resizedArray
      .concat(resizedArray)
      .sort(() => 0.5 - Math.random());
    for (let i = 0; i < gameBoard.length; i += 1) {
      this.section.append(this.buildGameCard(gameBoard[i]));
    }
  }

  buildGameCard(item) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.setAttribute('class', 'card');
    card.dataset.name = item.name;
    const back = document.createElement('div');
    back.classList.add('back');
    const face = document.createElement('div');
    face.classList.add('face');
    face.style.backgroundImage = `url(${item.img})`;
    card.append(face, back);
    return card;
  }

  flipCard(event) {
    const clicked = event.target;

    if (clicked.nodeName === 'SECTION'
      || clicked === this.previousClick
      || clicked.parentNode.classList.contains('selected')) {
      return;
    }
    if (!this.isGameActive) {
      this.isGameActive = true;
      this.updateTimer();
    }
    if (this.guess < 2) {
      this.guess += 1;
      if (this.guess === 1) {
        this.firstGuess = clicked.parentNode.dataset.name;
        clicked.parentNode.classList.add('selected');
      } else {
        this.secondGuess = clicked.parentNode.dataset.name;
        clicked.parentNode.classList.add('selected');
      }
      if (this.firstGuess !== '' && this.secondGuess !== '') this.validateAndCount();
      this.previousClick = clicked;
    }
  }

  validateAndCount() {
    if (this.firstGuess === this.secondGuess) {
      this.win += 1;
      this.score += 10;
      this.updateScore();
      setTimeout(this.match, this.delay);
      setTimeout(() => this.resetGuesses(), this.delay);
      this.checkIfWin();
    } else {
      if (this.score > 0) {
        this.score -= 2;
        this.updateScore();
      }
      setTimeout(() => this.resetGuesses(), this.delay);
    }
  }

  match() {
    this.selected.forEach((card) => card.classList.add('match'));
  }

  resetGuesses() {
    this.firstGuess = '';
    this.secondGuess = '';
    this.guess = 0;
    this.selected.forEach((card) => card.classList.remove('selected'));
  }

  checkIfWin() {
    if (this.win === this.size) {
      console.log('you are won for', this.timer, this.score);
      this.destroyGameInstance();
      this.size += this.step;
      setTimeout(() => {
        if (this.win === cardsArray.length) {
          console.log('FINISH GAME');
        } else {
          this.getGameInstance(this.size);
        }
      }, this.delay);
    }
  }

  updateScore() {
    this.scoreNode.textContent = `${this.score}`;
  }

  updateTimer() {
    const clock = 0;
    this.timer = clock * 60;
    this.clear = setInterval(() => {
      const min = Math.floor(this.timer / 60);
      const sec = this.timer % 60;
      this.timeNode.textContent = `${this.addZero(min)}:${this.addZero(sec)}`;
      this.timer += 1;
    }, this.delay);
  }

  addZero(num) {
    return (parseInt(num, 10) < 10 ? '0' : '') + num;
  }

  destroyGameInstance() {
    clearInterval(this.clear);
    this.isGameActive = false;
    this.gameEnd();
    this.game.remove();
  }

  gameEnd() {
    return {
      game: this.gameConfig.id,
      time: this.timer,
      score: this.score,
    };
  }

  init() {
    document.body.append(this.getGameNode());
    this.createCards(this.size);
  }

  getGameInstance(root) {
    const app = new MemoryGame(root, 6);
    app.init();
    return app;
  }
}
