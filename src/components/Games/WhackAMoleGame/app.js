// import ReverseTimer from '@helpers/ReverseTimer';
import Mixin from '../../../helpers/Mixin';
import './scss/style.scss';

export default class WhackAMole {
  constructor(app, elements) {
    this.$app = app;
    this.$soundPlayer = app.soundPlayer;
    this.gameConfig = app.config;
    this.audioCollection = Mixin.handleWebpackImport(require.context('./assets/audio', true, /\.mp3/));

    this.elements = elements;
    this.gameElement = null;
    this.holes = null;
    this.moles = null;
    this.lastHole = null;
    this.fieldSize = 9;
    this.totalScore = 0;
    this.sessionScore = 0;
    this.scoreToHTML = null; // выпилить при добавлении в проект
    this.isScoreCheat = false; // against repeated clicks on the mole
    this.timeUp = false; // to the end of the game
    this.sessionTime = 5000;
    this.minTime = 900;
    this.maxTime = 1000;
  }

  getGameNode() {
    const game = document.createElement('div');
    game.setAttribute('id', 'whackAMole-game');

    // выпилится после внедрения
    const title = document.createElement('h1');
    title.textContent = 'Whack-a-mole!';
    title.insertAdjacentHTML('beforeEnd', '<span class="score">0</span>');

    game.append(title, this.createHoles(this.fieldSize));
    return game;
  }

  createHoles(size) {
    const gameBoard = document.createElement('div');
    gameBoard.setAttribute('class', 'gameBoard');
    for (let i = 0; i < size; i += 1) {
      const holeMole = this.buildHoleMole();
      gameBoard.append(holeMole);
    }
    return gameBoard;
  }

  buildHoleMole() {
    const hole = document.createElement('div');
    hole.setAttribute('class', 'hole');
    hole.insertAdjacentHTML('beforeEnd', '<div class="mole"></div>');
    return hole;
  }

  startGame() {
    this.sessionScore = 0;
    this.isScoreCheat = false;
    this.timeUp = false;
    this.showHideMoles(this.minTime, this.maxTime);
    setTimeout(() => {
      this.timeUp = true;
    }, this.sessionTime);
  }

  levelUp() {
    this.maxTime >= 100 ? this.maxTime -= 100 : this.maxTime = 100;
    this.minTime >= 100 ? this.minTime -= 100 : this.minTime = 100;
    this.sessionScore >= 3 ? this.startGame() : this.gameEnd();
  }

  showHideMoles(from, to) {
    const randomTime = this.randomTime(from, to);
    const randomHole = this.randomHole(this.holes);
    randomHole.classList.add('up');
    setTimeout(() => {
      randomHole.classList.remove('up');
      if (!this.timeUp) {
        this.showHideMoles(from, to);
        setTimeout(() => {
          this.isScoreCheat = false;
        }, randomTime / 5);
      } else {
        this.levelUp();
      }
    }, randomTime);
  }

  countScore(e) {
    if (!e.isTrusted) return; // protected from cheat

    if (!this.isScoreCheat) {
      this.totalScore += 1;
      this.sessionScore += 1;
      this.moles.forEach((mole) => mole.classList.remove('up'));
      this.setScoreText(this.totalScore);
      this.isScoreCheat = true;
    }
  }

  randomTime(min, max) {
    return Math.round(Math.random() * (max - min) + min);
  }

  randomHole(holes) {
    const index = Math.floor(Math.random() * holes.length);
    const hole = holes[index];
    if (hole === this.lastHole) return this.randomHole(this.holes);
    this.lastHole = hole;
    return hole;
  }

  setScoreText(string) {
    this.scoreToHTML.textContent = string; // выпилить
    // this.elements.stats.score.textContent = string.toString();
  }

  destroyGameInstance() {
    this.gameEnd();
    this.gameElement.remove();
  }

  gameEnd() {
    this.isScoreCheat = false;
    this.timeUp = false;
    console.log('--------------------Game End'); // здесь будет модальное окно

    // return Mixin.dispatch(this.gameConfig.events.gameEnd, {
    //   game: this.gameConfig.id,
    //   score: this.totalScore,
    // });
  }

  queryNodes() {
    this.gameElement = document.querySelector('#whackAMole-game');
    this.holes = document.querySelectorAll('.hole');
    this.moles = document.querySelectorAll('.mole');
    this.scoreToHTML = document.querySelector('.score'); // ВЫПИЛИТЬ
  }

  init() {
    this.elements.game.box.append(this.getGameNode());
    this.queryNodes();
    this.moles.forEach((mole) => mole.addEventListener('click', this.countScore.bind(this)));
    this.setScoreText(0);
  }

  getGameInstance(root, elements) {
    const app = new WhackAMole(root, elements);
    app.init();
    return app;
  }
}
