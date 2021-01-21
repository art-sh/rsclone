import cardsArray from './js/cardsArray';
import './scss/style.scss';

export default class MemoryGame {
  constructor(config, size, elements) {
    this.gameConfig = config;

    this.elements = elements;
    this.gameElement = null;

    this.firstGuess = '';
    this.secondGuess = '';
    this.previousClick = null;
    this.delay = 500;
    this.timerInterval = 1000;
    this.currentTimeSeconds = 0;
    this.currentTimeInterval = 0;
    this.isGameActive = false; // for start timing
    this.score = 0;
    this.matches = 0;
    this.fieldSize = size;
    this.step = 2; // for change level
  }

  getGameNode() {
    const game = document.createElement('div');
    game.setAttribute('id', 'memory-game');
    game.addEventListener('click', (event) => this.flipCard(event));

    return game;
  }

  createCards(size) {
    const resizedArray = cardsArray
      .sort(() => 0.5 - Math.random())
      .slice(0, size);
    const gameBoard = resizedArray
      .concat(resizedArray)
      .sort(() => 0.5 - Math.random());

    gameBoard.forEach((config) => this.gameElement.append(this.buildGameCard(config)));
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
    if (!this.firstGuess || !this.secondGuess) {
      if (!this.firstGuess) {
        this.firstGuess = clicked.parentNode.dataset.name;
        clicked.parentNode.classList.add('selected');
      } else {
        this.secondGuess = clicked.parentNode.dataset.name;
        clicked.parentNode.classList.add('selected');
        this.validateAndCount();
      }
      this.previousClick = clicked;
    }
  }

  validateAndCount() {
    if (this.firstGuess === this.secondGuess) {
      this.matches += 1;
      this.score += 10;
      setTimeout(this.match.bind(this), this.delay);
      this.checkIfWin();
    } else if (this.score > 0) {
      this.score -= 2;
    }

    this.setScoreText(this.score);
    setTimeout(() => this.resetGuesses(), this.delay);
  }

  match() {
    this.getAllSelected().forEach((card) => card.classList.add('match'));
  }

  resetGuesses() {
    this.firstGuess = '';
    this.secondGuess = '';
    this.getAllSelected().forEach((card) => card.classList.remove('selected'));
  }

  checkIfWin() {
    if (this.matches === this.fieldSize) {
      setTimeout(() => {
        if (this.matches === cardsArray.length) {
          this.stopTimeInterval();
          this.gameEnd();
          this.destroyGameInstance();
          console.log('game finished');
        } else {
          this.levelUp();
        }
      }, this.delay);
    }
  }

  getAllSelected() {
    return Array.from(this.elements.game.box.querySelectorAll('.selected'));
  }

  levelUp() {
    this.fieldSize += this.step;
    this.matches = 0;
    this.gameElement.innerHTML = '';
    this.createCards(this.fieldSize);
  }

  updateTimer() {
    this.currentTimeSeconds = 0;
    this.currentTimeInterval = setInterval(() => {
      if (!this.isGameActive) return;

      const min = Math.floor(this.currentTimeSeconds / 60);
      const sec = this.currentTimeSeconds % 60;

      this.currentTimeSeconds += 1;
      this.setTimeText(`${this.addZero(min)}:${this.addZero(sec)}`);
    }, this.timerInterval);
  }

  setScoreText(string) {
    this.elements.stats.score.textContent = string.toString();
  }

  setTimeText(string) {
    this.elements.stats.time.textContent = string.toString();
  }

  stopTimeInterval() {
    clearInterval(this.currentTimeInterval);
  }

  addZero(num) {
    return num.toString().padStart(2, '0');
  }

  destroyGameInstance() {
    this.gameEnd();
    this.gameElement.remove();
  }

  gameEnd() {
    this.isGameActive = false;
    this.stopTimeInterval();

    // return Mixin.dispatch(this.gameConfig.events.gameEnd, {
    //   game: this.gameConfig.id,
    //   time: this.currentTimeSeconds,
    //   score: this.score,
    // });
  }

  init() {
    this.elements.game.box.append(this.getGameNode());
    this.gameElement = document.querySelector('#memory-game');
    this.createCards(this.fieldSize);

    this.setScoreText(0);
    this.setTimeText('00:00');
  }

  startGame() {
    //
  }

  getGameInstance(root, elements) {
    const app = new MemoryGame(root, 6, elements);
    app.init();
    return app;
  }
}
