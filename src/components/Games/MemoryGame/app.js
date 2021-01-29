import ReverseTimer from '@helpers/ReverseTimer';
import Mixin from '../../../helpers/Mixin';
import cardsArray from './js/cardsArray';
import './scss/style.scss';

export default class MemoryGame {
  constructor(app, elements, size = 6) {
    this.$app = app;
    this.$soundPlayer = app.soundPlayer;
    this.gameConfig = app.config;
    this.elements = elements;
    this.gameElement = null;
    this.firstGuess = '';
    this.secondGuess = '';
    this.previousClick = null;
    this.delay = 500;
    this.showCardsTime = 4000;
    this.timer = new ReverseTimer();
    this.sessionTime = 20;
    this.timeStep = 20;
    this.score = 0;
    this.matches = 0;
    this.fieldSize = size;
    this.fieldStep = 2; // for change level
  }

  getGameNode() {
    const game = document.createElement('div');
    game.setAttribute('id', 'memory-game');
    game.addEventListener('click', (event) => this.flipCard(event));
    return game;
  }

  buildGameCard(item) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.setAttribute('class', 'card');
    card.classList.add('selected');
    card.dataset.name = item.name;
    const back = document.createElement('div');
    back.classList.add('back');
    const face = document.createElement('div');
    face.classList.add('face');
    face.style.backgroundImage = `url(${item.img})`;
    card.append(face, back);
    return card;
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

  getAllSelected() {
    return Array.from(this.elements.game.box.querySelectorAll('.selected'));
  }

  showCardsBeforeStart() {
    this.setTimeToNull();
    const currentCards = document.querySelectorAll('.card');
    setTimeout(() => {
      currentCards.forEach((card) => card.classList.remove('selected'));
    }, this.showCardsTime);
    setTimeout(() => this.updateTimer(this.sessionTime), this.showCardsTime);
  }

  flipCard(event) {
    const clicked = event.target;

    if (clicked.nodeName === 'SECTION'
      || clicked === this.previousClick
      || clicked.parentNode.classList.contains('selected')) {
      return;
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
      setTimeout(this.matchCards.bind(this), this.delay);
      this.checkIfWin();
    } else if (this.score > 0) this.score -= 2;
    this.setScoreText(this.score);
    setTimeout(() => this.resetGuesses(), this.delay);
  }

  matchCards() {
    this.getAllSelected().forEach((card) => card.classList.add('match'));
  }

  resetGuesses() {
    if (this.firstGuess === '' && this.secondGuess === '') return;
    this.firstGuess = '';
    this.secondGuess = '';
    this.getAllSelected().forEach((card) => card.classList.remove('selected'));
  }

  checkIfWin() {
    if (this.matches === this.fieldSize) {
      setTimeout(() => {
        if (this.matches === cardsArray.length) {
          this.timer.stopCount();
          this.destroyGameInstance();
          this.$soundPlayer.playSound('game-end');
          // POP UP YOU WIN
        } else {
          this.levelUp();
          this.$soundPlayer.playSound('level-next');
        }
      }, this.delay);
    }
  }

  levelUp() {
    this.gameEnd();
    this.sessionTime += this.timeStep;
    this.fieldSize += this.fieldStep;
    this.matches = 0;
    this.gameElement.innerHTML = '';
    this.createCards(this.fieldSize);
    this.firstGuess = '';
    this.secondGuess = '';
    this.showCardsBeforeStart();
  }

  updateTimer(sessionTime) {
    const finish = () => {
      this.$soundPlayer.playSound('level-down');
      this.destroyGameInstance();
      // POP UP GAME OVER
    };
    this.timer.startCount(sessionTime, this.setTimeText.bind(this), finish);
  }

  setTimeText(time) {
    this.elements.stats.time.textContent = `${time.minutesString}:${time.secondsString}`;
  }

  setTimeToNull() {
    this.elements.stats.time.textContent = '00:00';
  }

  setScoreText(string) {
    this.elements.stats.score.textContent = string.toString();
  }

  disableFinishBtn() {
    this.elements.game.finishBtn.disabled = true;
    // this.elements.game.finishBtn.classList.add('button_disabled');
    this.elements.game.finishBtn.style.cursor = 'default';
  }

  destroyGameInstance() {
    this.gameEnd();
    this.gameElement.remove();
  }

  gameEnd() {
    this.timer.stopCount();
    this.disableFinishBtn();
    return Mixin.dispatch(this.gameConfig.events.gameEnd, {
      game: this.gameConfig.id,
      score: this.score,
    });
  }

  startGame() {
    this.gameElement = document.querySelector('#memory-game');
    this.createCards(this.fieldSize);
    this.showCardsBeforeStart();
    this.setTimeToNull();
    this.setScoreText(0);
  }

  init() {
    this.elements.game.box.append(this.getGameNode());
    this.elements.game.finishBtn.addEventListener('click', () => {
      this.destroyGameInstance();
      this.$soundPlayer.playSound('level-down');
    });
  }

  getGameInstance(root, elements) {
    const app = new MemoryGame(root, elements);
    app.init();
    return app;
  }
}
