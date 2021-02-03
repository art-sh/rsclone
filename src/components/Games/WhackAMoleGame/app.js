import ReverseTimer from '@helpers/ReverseTimer';
import ModalWindow from '@/components/Render/components/ModalWindow/app';
import Mixin from '../../../helpers/Mixin';
import './scss/style.scss';

export default class WhackAMole {
  constructor(app, elements) {
    this.$app = app;
    this.$soundPlayer = app.soundPlayer;
    this.gameConfig = app.config;
    this.elements = elements;

    this._livesCount = 0;
    this.gameElement = null;
    this.fieldSize = 9;
    this.totalScore = 0;
    this.answeredCount = 0;
    this.timer = new ReverseTimer();
    this.stepTime = 1000;
    this.stepGameInterval = null;
    this.scoreStep = 99;
    this.scoreMultipliyer = 1;
    this.holesCollection = [];
    this.holeExample = {
      id: null,
      element: null,
      isAnswered: false,
    };
  }

  get livesCount() {
    return this._livesCount;
  }

  set livesCount(count) {
    this._livesCount = count;
    const currentCount = this.elements.stats.icons.children.length;

    if (currentCount > count) {
      for (let i = 0; i < currentCount - count; i += 1) {
        this.elements.stats.icons.children[0].remove();
      }
    } else if (currentCount < count) {
      for (let i = 0; i < count - currentCount; i += 1) {
        this.elements.stats.icons.appendChild(this.elements.templates.star.content.cloneNode(true));
      }
    }
  }

  getGameNode() {
    const game = document.createElement('div');
    game.setAttribute('class', 'whackAMole');

    return game;
  }

  generateHoles() {
    this.gameElement.innerHTML = '';

    for (let i = 0; i < this.fieldSize; i += 1) {
      const holeObject = {...this.holeExample};
      const holeMole = this.buildHoleMole();

      holeObject.element = holeMole;
      holeObject.id = i + 1;
      this.holesCollection.push(holeObject);

      holeMole.addEventListener('click', () => this.countScore(holeObject.id));

      this.gameElement.append(holeMole);
    }
  }

  buildHoleMole() {
    const hole = document.createElement('div');
    hole.classList.add('hole');
    hole.insertAdjacentHTML('beforeEnd', '<div class="mole"></div>');
    return hole;
  }

  startGame() {
    this.resetFlagsHandler();
    this.timer.stopCount();
    this.generateHoles();
    clearTimeout(this.stepGameInterval);
    this.showHideMoles();

    this.elements.stats.score.textContent = '0';
    this.timer.startCount(80, this.setTimeText.bind(this), this.gameEnd.bind(this));
    document.body.classList.remove('game-button-finish-clicked');
  }

  showHideMoles() {
    const currentHole = this.holesCollection.filter((item) => item.element.classList.contains('up'))[0];
    const avaialableHoles = this.holesCollection.filter((item) => !item.element.classList.contains('up'));
    const randomHole = this.randomHole(avaialableHoles);
    if (currentHole) {
      currentHole.element.classList.remove('up');
    }
    this.holesCollection.forEach((item) => {
      item.element.classList.remove('clicked');
    });

    randomHole.element.classList.add('up');
    randomHole.isAnswered = false;

    this.stepGameInterval = setTimeout(() => {
      if (!randomHole.isAnswered) this.livesCount -= 1;
      if (!this.livesCount) return this.gameEnd();
      if (this.answeredCount <= 7) {
        this.showHideMoles();
      } else {
        this.levelUp();
      }
    }, this.stepTime);
  }

  countScore(id) {
    const holeObject = this.holesCollection.find((item) => item.id === id);

    if (holeObject.isAnswered) return;
    holeObject.isAnswered = true;
    holeObject.element.classList.add('clicked');
    this.totalScore += +(this.scoreStep * this.scoreMultipliyer).toFixed(0);
    this.answeredCount += 1;
    this.setScoreText(this.totalScore);
  }

  levelUp() {
    this.scoreMultipliyer += 0.17;
    this.stepTime -= 100;
    this.answeredCount = 0;
    this.showHideMoles();
    this.$soundPlayer.playSound('level-next');
  }

  randomHole(holesCollection) {
    return holesCollection[Math.floor(Math.random() * holesCollection.length)];
  }

  setTimeText(time) {
    this.elements.stats.time.textContent = `${time.minutesString}:${time.secondsString}`;
  }

  setScoreText(string) {
    this.elements.stats.score.textContent = string.toString();
  }

  resetFlagsHandler() {
    this.livesCount = 10;
    this.totalScore = 0;
    this.stepTime = 1000;
    this.stepGameInterval = null;
    this.scoreStep = 99;
    this.scoreMultipliyer = 1;
    this.answeredCount = 0;
    this.holesCollection.length = 0;
  }

  showModalWindow() {
    const modal = new ModalWindow(this.$app);
    modal.showModal({
      type: this.gameConfig.modalWindow.types.gameEnd,
      container: document.querySelector('#app'),
      text: {
        score: this.totalScore,
        title: this.gameConfig.games.whackAMole.name,
      },
      callback: {
        restart: () => this.startGame(),
      },
    });
  }

  destroyGameInstance() {
    this.timer.stopCount();
    clearTimeout(this.stepGameInterval);
    this.gameElement.remove();
  }

  gameEnd() {
    clearTimeout(this.stepGameInterval);
    this.timer.stopCount();
    this.showModalWindow();
    this.$soundPlayer.playSound('game-end');
    this.gameElement.innerHTML = '';

    return Mixin.dispatch(this.gameConfig.events.gameEnd, {
      game: this.gameConfig.games.whackAMole.id,
      score: this.totalScore,
    });
  }

  setGameListeners() {
    this.elements.game.finishBtn.addEventListener('click', () => this.gameEnd());
  }

  init() {
    this.gameElement = this.getGameNode();
    this.elements.game.box.append(this.gameElement);
    this.setScoreText(0);
    this.setGameListeners();
  }

  getGameInstance(root, elements) {
    const app = new WhackAMole(root, elements);
    app.init();
    return app;
  }
}
