import ReverseTimer from '@helpers/ReverseTimer';
import Mixin from '../../../helpers/Mixin';
import './scss/style.scss';

export default class WhackAMole {
  constructor(app, elements) {
    this.$app = app;
    this.$soundPlayer = app.soundPlayer;
    this.gameConfig = app.config;
    this.elements = elements;
    this.gameElement = null;
    this.holes = null;
    this.moles = null;
    this.lastHole = null;
    this.fieldSize = 9;
    this.totalScore = 0;
    this.sessionScore = 0;
    this.isScoreCheat = false; // against repeated clicks on the mole
    this.timeUp = false; // to the end of the game
    this.timer = new ReverseTimer();
    this.sessionTime = 10;
    this.timetoMs = 1000;
    this.minTime = 900;
    this.maxTime = 1000;
    this.stopGame = null;
  }

  getGameNode() {
    const game = document.createElement('div');
    game.setAttribute('id', 'whackAMole-game');
    game.append(this.createHoles(this.fieldSize));
    return game;
  }

  createHoles(size) {
    const gameBoard = document.createElement('div');
    gameBoard.setAttribute('class', 'whackAMole');
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
      this.timer.startCount(this.sessionTime, this.setTimeText.bind(this));
    }, this.sessionTime * this.timetoMs);
  }

  showHideMoles(from, to) {
    const randomTime = this.randomTime(from, to);
    const randomHole = this.randomHole(this.holes);
    randomHole.classList.add('up');
    this.stopGame = setTimeout(() => {
      randomHole.classList.remove('up');
      if (!this.timeUp) {
        this.showHideMoles(from, to);
        setTimeout(() => {
          this.isScoreCheat = false;
        }, randomTime / 5);
      } else this.levelUp();
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

  levelUp() {
    this.$soundPlayer.playSound('level-next');
    this.maxTime >= 100 ? this.maxTime -= 100 : this.maxTime = 100;
    this.minTime >= 100 ? this.minTime -= 100 : this.minTime = 100;
    this.sessionScore >= 3 ? this.startGame() : this.gameEnd();
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

  setTimeText(time) {
    this.elements.stats.time.textContent = `${time.minutesString}:${time.secondsString}`;
  }

  setScoreText(string) {
    this.elements.stats.score.textContent = string.toString();
  }

  destroyGameInstance() {
    this.gameEnd();
    this.gameElement.remove();
  }

  gameEnd() {
    clearTimeout(this.stopGame);
    this.timer.stopCount();
    this.isScoreCheat = false;
    this.timeUp = false;
    this.$soundPlayer.playSound('level-down');
    // POP UP GAME OVER
    return Mixin.dispatch(this.gameConfig.events.gameEnd, {
      game: this.gameConfig.id,
      score: this.totalScore,
    });
  }

  newGame() {
    this.gameElement = document.querySelector('#whackAMole-game');
    this.holes = document.querySelectorAll('.hole');
    this.moles = document.querySelectorAll('.mole');
    this.moles.forEach((mole) => mole.addEventListener('click', this.countScore.bind(this)));
    this.setScoreText(0);
    this.timer.startCount(this.sessionTime, this.setTimeText.bind(this));
  }

  init() {
    this.elements.game.box.append(this.getGameNode());
    this.elements.game.finishBtn.addEventListener('click', () => this.gameEnd());
    this.newGame();
  }

  getGameInstance(root, elements) {
    const app = new WhackAMole(root, elements);
    app.init();
    return app;
  }
}
