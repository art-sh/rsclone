import './scss/style.scss';
import ReverseTimer from '@helpers/ReverseTimer';
import Mixin from '../../../helpers/Mixin';

export default class MemoryMatrix {
  constructor(app, elements) {
    this.$app = app;
    this.timer = new ReverseTimer();
    this.$soundPlayer = app.soundPlayer;
    this.gameConfig = app.config;
    this.elements = elements;
    this.fieldSize = 4;
    this.aciveBlocksNumber = 2;
    this.answersCount = 0;
    this.correctAnswers = 0;
    this.currentLevel = 1;
    this.currentScore = 0;
    this.scoreMultiplier = 1;
    this.score = 0;
    this.visibilityDelay = 2000;
    this.startGameDelay = 1500;
    this.delay = 1000;
    this.audioDelay = 200;
    this.gameBlocks = {
      container: null,
      gameField: null,
    };
    this.timer = new ReverseTimer(this.gameConfig);
    this.isGameEnd = false;
  }

  init() {
    const field = this.createField();
    this.elements.stats.score.textContent = 0;
    this.elements.game.box.appendChild(field);
    return field;
  }

  createLivesIcons() {
    for (let i = 0; i < 3; i += 1) {
      this.elements.stats.icons.appendChild(this.elements.templates.star.content.cloneNode(true));
    }
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
    this.isGameStart = false;
  }

  listenersHandlers() {
    this.elements.game.box.addEventListener('click', (e) => {
      const guessBlock = e.target.closest('.matrix-memory-game-button');
      if (guessBlock) {
        this.checkAnswer(guessBlock);
      }
    });
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
    this.timer.startCount(80, this.setTimerTextContent.bind(this), this.endGameHandler.bind(this));
    this.nextLevelHandler();
  }

  setTimerTextContent() {
    this.elements.stats.time.textContent = `${this.timer.time.minutesString}:${this.timer.time.secondsString}`;
  }

  nextLevelHandler() {
    if (this.isGameEnd) return;
    const mainField = this.gameBlocks.container.querySelector('.matrix-memory-container__main');
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
      this.blockOrApproveClicksHandler();

      setTimeout(() => {
        this.$soundPlayer.playSound('level-next');
      }, this.audioDelay);

      setTimeout(() => {
        this.gameBlocks.container.style.opacity = '0';
        this.gameBlocks.container.querySelectorAll('.matrix-memory-game-button').forEach((item) => { item.style.backgroundColor = 'white'; });
      }, this.delay);

      setTimeout(() => {
        this.nextLevelHandler();
        this.gameBlocks.container.style.opacity = '1';
      }, this.startGameDelay);
    }
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
      // this.$soundPlayer.playSound('beep-short');
    }
    if (this.elements.stats.icons.children.length === 0) {
      clearInterval(this.timer.currentTimeInterval);
      this.endGameHandler();
    }
  }

  endGameHandler() {
    this.isGameEnd = true;
    this.blockOrApproveClicksHandler();
    this.timer.stopCount();
    this.$soundPlayer.playSound('game-end');
    Mixin.dispatch(this.gameConfig.events.gameEnd, {
      game: this.gameConfig.games.memoryMatrix.id,
      score: this.score,
    });
  }

  destroyGameInstance() {
    this.timer.stopCount();
    this.elements.game.box.removeChild(this.gameBlocks.container);
    this.elements.stats.score.innerText = '';
    this.elements.stats.time.innerText = '';
    this.elements.stats.icons.innerText = '';
  }

  getGameInstance(config, elements) {
    const game = new MemoryMatrix(config, elements);
    game.init();
    return game;
  }
}
