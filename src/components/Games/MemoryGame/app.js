import ReverseTimer from '@helpers/ReverseTimer';
import ModalWindow from '../../Render/components/ModalWindow/app';
import Mixin from '../../../helpers/Mixin';
import cardsArray from './js/cardsArray';
import './scss/style.scss';

export default class MemoryGame {
  constructor(app, elements, size = 2) {
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
    this.score = 0;
    this.matches = 0;
    this.fieldSize = size;
    this.fieldStep = 2;
    this.scoreStep = 99;
    this.scoreMultipliyer = 1;
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
    const resizedArray = this.shuffle(cardsArray)
      .slice(0, size);
    const gameBoard = resizedArray
      .slice()
      .concat(resizedArray);
    const sortedGameBoard = this.shuffle(gameBoard.slice());
    sortedGameBoard.forEach((config) => this.gameElement.append(this.buildGameCard(config)));
  }

  shuffle(array) {
    for (let i = array.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  getAllSelected() {
    return Array.from(this.elements.game.box.querySelectorAll('.selected'));
  }

  showCardsBeforeStart() {
    const currentCards = document.querySelectorAll('.card');
    this.gameElement.style.opacity = 1;
    setTimeout(() => {
      currentCards.forEach((card) => card.classList.remove('selected'));
    }, this.showCardsTime);
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
      this.score += +(this.scoreStep * this.scoreMultipliyer).toFixed();
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

  resetFlags() {
    this.score = 0;
    this.matches = 0;
    this.fieldSize = 2;
    this.scoreMultipliyer = 1;
  }

  checkIfWin() {
    const numberOfCards = this.gameElement.children.length;
    if (this.matches === numberOfCards / 2) {
      setTimeout(() => {
        if (this.matches === cardsArray.length) {
          this.timer.stopCount();
          this.destroyGameInstance();
          this.gameEnd();
          this.$soundPlayer.playSound('game-end');
        } else {
          this.levelUp();
          this.$soundPlayer.playSound('level-next');
        }
      }, this.delay);
    }
  }

  levelUp() {
    this.gameElement.style.opacity = 0;
    this.scoreMultipliyer += 0.7;
    this.fieldSize += this.fieldStep;
    this.matches = 0;
    this.gameElement.innerHTML = '';
    this.createCards(this.fieldSize);
    this.firstGuess = '';
    this.secondGuess = '';
    this.showCardsBeforeStart();
  }

  setTimeText(time) {
    this.elements.stats.time.textContent = `${time.minutesString}:${time.secondsString}`;
  }

  setScoreText(string) {
    this.elements.stats.score.textContent = string.toString();
  }

  disableFinishBtn(mode = 'off') {
    this.elements.game.finishBtn.disabled = true;
    this.elements.game.finishBtn.classList.add('button_disabled');
    this.elements.game.finishBtn.style.cursor = 'default';
    if (mode === 'on') {
      this.elements.game.finishBtn.disabled = false;
      this.elements.game.finishBtn.classList.remove('button_disabled');
      this.elements.game.finishBtn.style.cursor = 'pointer';
    }
  }

  destroyGameInstance() {
    this.timer.stopCount();
    clearTimeout(this.stepGameInterval);
    this.gameElement.remove();
  }

  showModalWindow() {
    const modal = new ModalWindow(this.$app);
    modal.showModal({
      type: this.gameConfig.modalWindow.types.gameEnd,
      container: document.querySelector('#app'),
      text: {
        score: this.score,
        title: this.gameConfig.games.memoryGame.name,
      },
      callback: {
        restart: () => this.startGame(),
      },
    });
  }

  gameEnd() {
    this.timer.stopCount();
    this.disableFinishBtn();
    this.showModalWindow();
    this.$soundPlayer.playSound('game-end');
    return Mixin.dispatch(this.gameConfig.events.gameEnd, {
      game: this.gameConfig.games.memoryGame.id,
      score: this.score,
    });
  }

  startGame() {
    this.resetFlags();
    this.timer.startCount(120, this.setTimeText.bind(this), this.gameEnd.bind(this));
    this.disableFinishBtn('on');
    document.body.classList.remove('game-button-finish-clicked');
    this.gameElement.innerHTML = '';
    this.createCards(this.fieldSize);
    this.showCardsBeforeStart();
    this.setScoreText(0);
  }

  setListeners() {
    this.elements.game.finishBtn.addEventListener('click', this.gameEnd.bind(this));
  }

  init() {
    this.gameElement = this.getGameNode();
    this.elements.game.box.append(this.gameElement);
    this.setListeners();
  }

  getGameInstance(root, elements) {
    const app = new MemoryGame(root, elements);
    app.init();
    return app;
  }
}
