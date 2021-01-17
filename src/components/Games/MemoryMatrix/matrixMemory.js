import './scss/style.scss';
import Mixin from '../../../helpers/Mixin';

export default class ColourMatrix {
  constructor(config, elements) {
    this.gameConfig = config;
    this.elements = elements;
    this.fieldSize = 4;
    this.aciveBlocksNumber = 2;
    this.answersCount = 0;
    this.correctAnswers = 0;
    this.currentLevel = 1;
    this.currentScore = 0;
    this.scoreMultiplier = 1;
    this.lives = 3;
    this.score = 0;
    this.visibilityDelay = 2000;
    this.startGameDelay = 2000;
    this.delay = 1000;
    this.node = null;
    this.gameBlocks = {
      container: null,
      gameField: null,
    };
  }

  init() {
    const field = this.createField();
    return field;
  }

  createField() {
    this.gameBlocks.container = this.createElementFactory('div', null, 'field-container', null, null, null);
    this.gameBlocks.gameField = this.createElementFactory('div', null, 'field-main', null, null, null);
    this.gameBlocks.container.appendChild(this.createGameHeader());
    this.gameBlocks.container.appendChild(this.gameBlocks.gameField);
    this.gameBlocks.container.appendChild(this.createElementFactory('button', null, 'game-start-button', null, null, 'Game Start'));
    this.createGamesblocks(this.gameBlocks.gameField);
    this.listenersHandlers(this.gameBlocks.container);
    return this.gameBlocks.container;
  }

  createGameHeader() {
    const headerWrapper = this.createElementFactory('div', null, 'header-wrapper', null, null, null);
    const header = this.createElementFactory('div', null, 'header', null, null, null);
    const livesContainer = this.createElementFactory('div', null, 'lives-container', null, null, null);
    const scoreContainer = this.createElementFactory('div', null, 'score-container', null, null, null);
    const levelContainer = this.createElementFactory('div', null, 'level-container', null, null, null);
    livesContainer.appendChild(this.createElementFactory('span', null, 'lives', null, null, 'Lives:'));
    livesContainer.appendChild(this.createElementFactory('span', null, 'lives-count', null, null, `${this.lives}`));
    scoreContainer.appendChild(this.createElementFactory('span', null, 'score', null, null, 'Score:'));
    scoreContainer.appendChild(this.createElementFactory('span', null, 'score-count', null, null, `${this.currentScore}`));
    levelContainer.appendChild(this.createElementFactory('span', null, 'level', null, null, 'Level:'));
    levelContainer.appendChild(this.createElementFactory('span', null, 'level-count', null, null, `${this.currentLevel}`));
    header.append(livesContainer, scoreContainer, levelContainer);
    headerWrapper.appendChild(header);
    return headerWrapper;
  }

  createGamesblocks(mainField) {
    mainField.innerHTML = '';
    for (let i = 1; i <= this.fieldSize; i += 1) {
      mainField.appendChild(this.createElementFactory('div', i, 'game-button', null, null, null));
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
    this.lives = 3;
    this.score = 0;
    this.visibilityDelay = 2000;
    this.gameBlocks.gameField.style.width = `${40}%`;
  }

  listenersHandlers(fieldContainer) {
    const gameStartButton = fieldContainer.querySelector('.game-start-button');
    gameStartButton.addEventListener('click', () => {
      this.startGame();
      gameStartButton.textContent = 'Finish';
    });
    this.gameBlocks.gameField.addEventListener('click', (e) => {
      const guessBlock = e.target.closest('.game-button');
      if (guessBlock) {
        this.checkAnswer(guessBlock);
      }
    });
  }

  difficultyLevelHandler() {
    switch (this.correctAnswers) {
      case 1:
      case 2:
        this.fieldSize = 4;
        break;
      case 3:
        this.fieldSize = 6;
        this.aciveBlocksNumber = 2;
        this.gameBlocks.gameField.style.width = `${50}%`;
        this.scoreMultiplier = 1.5;
        break;
      case 6:
        this.fieldSize = 9;
        this.aciveBlocksNumber = 3;
        this.gameBlocks.gameField.style.width = `${50}%`;
        this.scoreMultiplier = 1.7;
        break;
      case 9:
        this.fieldSize = 9;
        this.aciveBlocksNumber = 4;
        this.scoreMultiplier = 1.7;
        break;
      case 12:
        this.gameBlocks.gameField.style.width = `${70}%`;
        this.fieldSize = 12;
        this.aciveBlocksNumber = 4;
        this.scoreMultiplier = 2;
        break;
      case 16:
        this.fieldSize = 18;
        this.aciveBlocksNumber = 4;
        this.gameBlocks.gameField.style.width = `${100}%`;
        this.scoreMultiplier = 2.2;
        this.visibilityDelay = 1700;
        break;
      case 24:
        this.fieldSize = 24;
        this.aciveBlocksNumber = 5;
        this.scoreMultiplier = 2.5;
        this.visibilityDelay = 1700;
        break;
      case 30:
        this.scoreMultiplier = 3;
        this.visibilityDelay = 1200;
        break;
      default:
        this.visibilityDelay = 1100;
        this.scoreMultiplier = 4;
        break;
    }
  }

  randomElements() {
    const gameButtons = this.gameBlocks.container.querySelectorAll('.game-button');
    const numbersCollection = new Set();
    while (numbersCollection.size < this.aciveBlocksNumber) {
      numbersCollection.add(Math.floor(Math.random() * gameButtons.length));
    }
    return Array.from(numbersCollection);
  }

  startGame() {
    const lives = this.gameBlocks.container.querySelector('.lives-count');
    const mainField = this.gameBlocks.container.querySelector('.field-main');
    lives.textContent = this.lives;
    this.difficultyLevelHandler();
    const levelCount = this.gameBlocks.container.querySelector('.level-count');
    levelCount.textContent = this.correctAnswers + 1;
    this.createGamesblocks(mainField);
    this.answersCount = 0;
    const gameButtons = this.gameBlocks.container.querySelectorAll('.game-button');
    const activeButtons = this.randomElements();
    gameButtons.forEach((item) => item.classList.add('no-clicks'));
    setTimeout(() => {
      activeButtons.forEach((item) => {
        gameButtons[item].classList.add('active');
        gameButtons[item].classList.add('color-block');
      });
    }, this.delay);
    setTimeout(() => {
      gameButtons.forEach((item) => {
        item.classList.remove('no-clicks');
        if (item.classList.contains('active')) {
          item.classList.remove('color-block');
        }
      });
    }, this.visibilityDelay);
  }

  checkAnswer(block) {
    const score = this.gameBlocks.container.querySelector('.score-count');
    this.correctAnswerhandler(block);
    this.wrongAnswerhandler(block);
    if (this.answersCount === this.aciveBlocksNumber) {
      this.score += this.scoreMultiplier * 20;
      this.correctAnswers += 1;
      score.textContent = this.score;
      setTimeout(() => {
        this.gameBlocks.container.querySelectorAll('.game-button').forEach((item) => { item.style.backgroundColor = 'white'; });
      }, this.delay);
      setTimeout(() => {
        this.startGame();
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
    const lives = document.querySelector('.lives-count');
    if (!block.classList.contains('active')) {
      this.lives -= 1;
      lives.textContent = this.lives;
    }
    if (this.lives === 0) {
      const overlay = this.createOverlay();
      this.gameBlocks.container.appendChild(overlay);
    }
  }

  endGameHandler() {
    Mixin.dispatch(this.$app.config.events.gameEnd, {
      gameId: this.gameConfig.games.matrixMemoryGame.id,
      score: this.score,
    });
  }

  getGameInstance(config, elements) {
    return new ColourMatrix(config, elements);
  }
}
