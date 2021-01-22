import ReverseTimer from '@helpers/ReverseTimer';
import Mixin from '../../../helpers/Mixin';
import cardsArray from './js/cardsArray';
import './scss/style.scss';

export default class MemoryGame {
  constructor(app, elements, size = 6) {
    this.$app = app;
    this.$soundPlayer = app.soundPlayer;
    this.gameConfig = app.config;
    this.audioCollection = Mixin.handleWebpackImport(require.context('./assets/audio', true, /\.mp3/));

    this.elements = elements;
    this.gameElement = null;

    this.firstGuess = '';
    this.secondGuess = '';
    this.previousClick = null;
    this.delay = 500;
    this.showCardsTime = 4000;
    this.timer = new ReverseTimer();
    this.sessionTime = 30;
    this.timeStep = 20;
    this.isGameActive = false; // for start ticking
    this.score = 0;
    this.matches = 0;
    this.fieldSize = size;
    this.step = 2; // for change level
    this.finishBtn = document.querySelector('button.game-finish');
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

  showCardsBeforeStart() {
    const currentCards = document.querySelectorAll('.card');
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
    if (!this.isGameActive) {
      this.isGameActive = true;
      this.updateTimer(this.sessionTime);
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
    } else if (this.score > 0) {
      this.score -= 2;
    }

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
          this.audioHandler('win');
          // console.log('game finished');
        } else {
          this.levelUp();
          this.audioHandler('nextLevel');
        }
      }, this.delay);
    }
  }

  getAllSelected() {
    return Array.from(this.elements.game.box.querySelectorAll('.selected'));
  }

  levelUp() {
    this.gameEnd();
    this.sessionTime += this.timeStep;
    this.fieldSize += this.step;
    this.matches = 0;
    this.gameElement.innerHTML = '';
    this.createCards(this.fieldSize);
    this.firstGuess = '';
    this.secondGuess = '';
    this.showCardsBeforeStart();
  }

  updateTimer(sessionTime) {
    const ticker = (time) => this.setTimeText(time);
    const finish = (time) => {
      this.audioHandler('looser');
      this.gameEnd();
      console.log('end', time);
    };
    this.timer.startCount(sessionTime, ticker, finish);
  }

  audioHandler(type) {
    const audio = document.createElement('audio');
    if (type === 'looser') {
      audio.setAttribute('src', `./${this.audioCollection.looser}`);
    } else if (type === 'nextLevel') {
      audio.setAttribute('src', `./${this.audioCollection.nextLevel}`);
    } else if (type === 'win') {
      audio.setAttribute('src', `./${this.audioCollection.win}`);
    }
    audio.currentTime = 0;
    audio.play();
  }

  setScoreText(string) {
    this.elements.stats.score.textContent = string.toString();
  }

  setTimeText(time) {
    this.elements.stats.time.textContent = `${time.minutesString}:${time.secondsString}`;
  }

  destroyGameInstance() {
    this.gameEnd();
    this.gameElement.remove();
  }

  gameEnd() {
    this.isGameActive = false;
    this.timer.stopCount();

    // return Mixin.dispatch(this.gameConfig.events.gameEnd, {
    //   game: this.gameConfig.id,
    //   time: this.timer,
    //   score: this.score,
    // });
  }

  init() {
    this.elements.game.box.append(this.getGameNode());
    this.gameElement = document.querySelector('#memory-game');
    this.createCards(this.fieldSize);
    this.showCardsBeforeStart();
    this.elements.stats.time.textContent = '00:00';
    this.finishBtn.addEventListener('click', () => this.gameEnd());
  }

  startGame() {
    //
  }

  getGameInstance(root, elements) {
    const app = new MemoryGame(root, elements);
    app.init();
    return app;
  }
}
