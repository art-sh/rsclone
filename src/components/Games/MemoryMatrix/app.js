import './scss/style.scss';
import Mixin from '../../../helpers/Mixin';
// import ReverseTimer from '../../Render/reverseTimer';

export default class MemoryMatrix {
  constructor(config, elements) {
    this.audioCollection = Mixin.handleWebpackImport(require.context('./assets/audio', true, /\.mp3/));
    this.gameConfig = config;
    this.elements = elements;
    this.fieldSize = 4;
    this.aciveBlocksNumber = 2;
    this.answersCount = 0;
    this.correctAnswers = 0;
    this.currentLevel = 1;
    this.currentScore = 0;
    this.scoreMultiplier = 1;
    this.lives = ['*', '*', '*'];
    this.score = 0;
    this.visibilityDelay = 2000;
    this.startGameDelay = 2000;
    this.delay = 1000;
    this.audioDelay = 200;
    this.gameBlocks = {
      container: null,
      gameField: null,
    };
    // this.timer = new ReverseTimer(this.gameConfig);
  }

  init() {
    const field = this.createField();
    this.elements.stats.score.textContent = 0;
    this.elements.game.box.appendChild(field);
    return field;
  }

  createLivesIcons() {
    this.lives.forEach(() => {
      this.elements.stats.icons.appendChild(this.elements.templates.star.content.cloneNode(true));
    });
  }

  createField() {
    this.gameBlocks.container = this.createElementFactory('div', null, 'matrix-memory-container', null, null, null);
    this.gameBlocks.gameField = this.createElementFactory('div', null, 'matrix-memory-container__main', null, null, null);
    this.gameBlocks.container.appendChild(this.gameBlocks.gameField);
    this.createLivesIcons();
    this.createGamesblocks(this.gameBlocks.gameField);
    this.listenersHandlers(this.gameBlocks.container);
    return this.gameBlocks.container;
  }

  createGamesblocks(mainField) {
    mainField.innerHTML = '';
    for (let i = 1; i <= this.fieldSize; i += 1) {
      mainField.appendChild(this.createElementFactory('div', i, 'matrix-memory-game-button', null, null, null));
    }
  }

  createElementFactory(elem, id, classSelec, attr, attrValue, textContent) {
    const element = document.createElement(elem);
    if (id) {
      element.setAttribute('id', id);
    }
    element.classList.add(classSelec);
    if (attr) {
      element.setAttribute(attr, attrValue);
    }
    if (textContent) {
      element.textContent = textContent;
    }
    return element;
  }

  createOverlay() {
    const overlay = this.createElementFactory('div', null, 'overlay', null, null, null);
    const overlayContainer = this.createElementFactory('div', null, 'overlay-container', null, null, null);
    const scoreContainer = this.createElementFactory('div', null, 'score-container', null, null, null);
    const restartGame = this.createElementFactory('button', null, 'game-restart-button', null, null, 'Restart');
    scoreContainer.appendChild(this.createElementFactory('span', null, 'overaly-score', null, null, 'Score:'));
    scoreContainer.appendChild(this.createElementFactory('span', null, 'overlay-score-count', null, null, `${this.score}`));
    overlayContainer.appendChild(scoreContainer);
    overlayContainer.appendChild(restartGame);
    overlay.appendChild(overlayContainer);
    restartGame.addEventListener('click', () => {
      this.gameBlocks.container.removeChild(overlay);
      this.resetFlags();
      this.startGame();
    });
    restartGame.addEventListener('click', this.createLivesIcons.bind(this));
    return overlay;
  }

  resetFlags() {
    this.fieldSize = 4;
    this.aciveBlocksNumber = 2;
    this.answersCount = 0;
    this.correctAnswers = 0;
    this.currentLevel = 1;
    this.currentScore = 0;
    this.scoreMultiplier = 1;
    this.score = 0;
    this.visibilityDelay = 2000;
    this.gameBlocks.gameField.style.width = `${40}%`;
    this.elements.stats.score.textContent = 0;
  }

  listenersHandlers() {
    this.elements.game.box.addEventListener('click', (e) => {
      const guessBlock = e.target.closest('.matrix-memory-game-button');
      if (guessBlock) {
        this.checkAnswer(guessBlock);
      }
    });
    this.elements.game.finishBtn.addEventListener('click', this.createOverlay.bind(this));
  }

  difficultyLevelHandler() {
    if (this.correctAnswers >= 0 && this.correctAnswers < 3) {
      this.fieldSize = 4;
    } else if (this.correctAnswers >= 3 && this.correctAnswers < 6) {
      this.fieldSize = 6;
      this.aciveBlocksNumber = 2;
      this.gameBlocks.gameField.style.width = `${50}%`;
      this.scoreMultiplier = 1.5;
    } else if (this.correctAnswers >= 6 && this.correctAnswers < 9) {
      this.fieldSize = 9;
      this.aciveBlocksNumber = 3;
      this.gameBlocks.gameField.style.width = `${50}%`;
      this.scoreMultiplier = 1.7;
    } else if (this.correctAnswers >= 9 && this.correctAnswers < 12) {
      this.gameBlocks.gameField.style.width = `${70}%`;
      this.fieldSize = 12;
      this.aciveBlocksNumber = 4;
      this.scoreMultiplier = 2;
    } else if (this.correctAnswers >= 12 && this.correctAnswers < 16) {
      this.fieldSize = 18;
      this.aciveBlocksNumber = 4;
      this.gameBlocks.gameField.style.width = `${100}%`;
      this.scoreMultiplier = 2.2;
      this.visibilityDelay = 1700;
    } else if (this.correctAnswers >= 16 && this.correctAnswers < 24) {
      this.fieldSize = 24;
      this.aciveBlocksNumber = 5;
      this.scoreMultiplier = 2.5;
      this.visibilityDelay = 1700;
    } else if (this.correctAnswers >= 24 && this.correctAnswers < 30) {
      this.scoreMultiplier = 3;
      this.visibilityDelay = 1200;
    } else {
      this.visibilityDelay = 1100;
      this.scoreMultiplier = 4;
    }
  }

  randomElements() {
    const gameButtons = this.gameBlocks.container.querySelectorAll('.matrix-memory-game-button');
    const numbersCollection = new Set();
    while (numbersCollection.size < this.aciveBlocksNumber) {
      numbersCollection.add(Math.floor(Math.random() * gameButtons.length));
    }
    return Array.from(numbersCollection);
  }

  blockOrApproveClicksHandler(type = 'block') {
    const gameButtons = this.gameBlocks.container.querySelectorAll('.matrix-memory-game-button');
    if (type === 'block') {
      gameButtons.forEach((item) => item.classList.add('no-clicks'));
    } else {
      gameButtons.forEach((item) => item.classList.remove('no-clicks'));
    }
  }

  startGame() {
    const mainField = this.gameBlocks.container.querySelector('.matrix-memory-container__main');
    // this.timer.initTimer(5, this.elements.stats.time, this.endGameHandler);

    this.difficultyLevelHandler();
    this.createGamesblocks(mainField);

    this.answersCount = 0;
    const gameButtons = this.gameBlocks.container.querySelectorAll('.matrix-memory-game-button');
    const activeButtons = this.randomElements();
    this.blockOrApproveClicksHandler();
    setTimeout(() => {
      activeButtons.forEach((item) => {
        gameButtons[item].classList.add('active');
        gameButtons[item].classList.add('color-block');
      });
    }, this.delay);
    setTimeout(() => {
      this.blockOrApproveClicksHandler('approve');
      gameButtons.forEach((item) => {
        if (item.classList.contains('active')) {
          item.classList.remove('color-block');
        }
      });
    }, this.visibilityDelay);
  }

  checkAnswer(block) {
    this.correctAnswerhandler(block);
    this.wrongAnswerhandler(block);
    if (this.answersCount === this.aciveBlocksNumber) {
      this.score += this.scoreMultiplier * 20;
      this.correctAnswers += 1;
      this.elements.stats.score.textContent = this.score;
      this.blockOrApproveClicksHandler('block');
      setTimeout(() => {
        this.audioHandler('right');
      }, this.audioDelay);
      setTimeout(() => {
        this.gameBlocks.container.querySelectorAll('.matrix-memory-game-button').forEach((item) => { item.style.backgroundColor = 'white'; });
      }, this.delay);
      setTimeout(() => {
        this.startGame();
      }, this.startGameDelay);
    }
  }

  audioHandler(type) {
    const audio = document.createElement('audio');
    if (type === 'wrong') {
      audio.setAttribute('src', `./${this.audioCollection.lose}`);
    } else {
      audio.setAttribute('src', `./${this.audioCollection.win}`);
    }
    audio.currentTime = 0;
    audio.play();
  }

  correctAnswerhandler(block) {
    if (block.classList.contains('active')) {
      this.answersCount += 1;
      block.classList.add('color-block');
    }
  }

  wrongAnswerhandler(block) {
    const live = this.elements.stats.icons.querySelector('.game-status_custom');

    if (!block.classList.contains('active')) {
      this.elements.stats.icons.removeChild(live);
      this.audioHandler('wrong');
    }
    if (this.elements.stats.icons.children.length === 0) {
      const overlay = this.createOverlay();
      this.gameBlocks.container.appendChild(overlay);
    }
  }

  endGameHandler() {
    Mixin.dispatch(this.gameConfig.events.gameEnd, {
      gameId: this.gameConfig.games.memoryMatrix.id,
      score: this.score,
    });
  }

  destroyGameInstance() {
    this.elements.game.box.removeChild(this.gameBlocks.container);
    this.elements.stats.score.innerText = '';
  }

  getGameInstance(config, elements) {
    return new MemoryMatrix(config, elements);
  }
}