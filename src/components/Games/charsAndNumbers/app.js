import './scss/style.scss';
import ReverseTimer from '@helpers/ReverseTimer';
import Mixin from '../../../helpers/Mixin';

export default class CharsAndNumbers {
  constructor(app, elements) {
    this.$app = app;
    this.gameConfig = app.config;
    this.elements = elements;
    this.timer = new ReverseTimer();
    this.$soundPlayer = app.soundPlayer;
    this.gameBlocks = {
      container: null,
      gameField: null,
      contentContainer: {
        numberContent: {
          container: null,
          firstContent: null,
          secondContent: null,
        },
        charContent: {
          container: null,
          firstContent: null,
          secondContent: null,
        },

      },
      buttonWrapper: null,
      yesButton: null,
      noButton: null,
    };
    this.letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    this.vowelsLetters = ['A', 'E', 'I', 'O', 'U', 'Y'];
    this.lives = ['*', '*', '*'];
    this.containerIndex = 0;
    this.difficulty = 5;
    this.choosenContainer = null;
    this.answer = null;
    this.guess = null;
    this.guessCount = 0;
    this.answersCount = 0;
    this.score = 0;
    this.images = Mixin.handleWebpackImport(require.context('./assets/img', true, /\.svg|.jpg/));
    this.scoreMultipliyer = 1;
    this.timerInterval = 1000;
    this.currentTimeSeconds = 0;
    this.currentTimeInterval = 0;
  }

  createField() {
    this.elements.stats.score.textContent = 0;
    this.createLivesIcons();
    this.gameBlocks.container = this.createElementFactory('div', null, 'game-container', null, null, null);
    this.gameBlocks.gameField = this.createElementFactory('div', null, 'game-field', null, null, null);
    this.gameBlocks.noButton = this.createElementFactory('button', null, 'no-answer', null, null, 'NO');
    const leftArrow = this.createElementFactory('img', null, 'left-arrow', 'src', `./${this.images.leftArrow}`, null);
    const rightArrow = this.createElementFactory('img', null, 'right-arrow', 'src', `./${this.images.rightArrow}`, null);
    leftArrow.setAttribute('width', '30');
    leftArrow.setAttribute('height', '30');
    rightArrow.setAttribute('width', '30');
    rightArrow.setAttribute('height', '30');
    this.gameBlocks.noButton.appendChild(leftArrow);
    this.gameBlocks.yesButton = this.createElementFactory('button', null, 'yes-answer', null, null, 'YES');
    this.gameBlocks.yesButton.appendChild(rightArrow);
    this.gameBlocks.gameField.appendChild(this.createQuestionBlock());
    this.gameBlocks.gameField.appendChild(this.createElementFactory('div', null, 'divider', null, null, null));
    this.gameBlocks.gameField.appendChild(this.createQuestionBlock('char'));
    this.gameBlocks.container.appendChild(this.gameBlocks.gameField);
    const buttonContainer = this.createElementFactory('div', null, 'button-container', null, null, null);
    buttonContainer.appendChild(this.gameBlocks.noButton);
    buttonContainer.appendChild(this.gameBlocks.yesButton);
    this.gameBlocks.buttonWrapper = buttonContainer;
    this.gameBlocks.container.appendChild(buttonContainer);
  }

  createLivesIcons() {
    this.lives.forEach(() => {
      this.elements.stats.icons.appendChild(this.elements.templates.star.content.cloneNode(true));
    });
  }

  createQuestionBlock(type = 'number') {
    const questionBlock = this.createElementFactory('div', null, `${type}-question-block`, null, null, null);
    const questionElement = this.createElementFactory('span', null, `${type}-question`, null, null, 'Is even number?');
    if (type === 'char') {
      questionElement.textContent = 'Is vowel letter?';
    }
    const contentBlock = this.createElementFactory('div', null, `${type}-block-content`, null, null, null);
    const firstContent = this.createElementFactory('span', null, `${type}-first-content-item`, null, null, null);
    const secondContent = this.createElementFactory('span', null, `${type}-second-content-item`, null, null, null);
    questionBlock.appendChild(questionElement);
    questionBlock.appendChild(questionElement);
    if (type === 'char') {
      this.gameBlocks.contentContainer.charContent.container = questionBlock;
      this.gameBlocks.contentContainer.charContent.firstContent = firstContent;
      this.gameBlocks.contentContainer.charContent.secondContent = secondContent;
    } else {
      this.gameBlocks.contentContainer.numberContent.container = questionBlock;
      this.gameBlocks.contentContainer.numberContent.firstContent = firstContent;
      this.gameBlocks.contentContainer.numberContent.secondContent = secondContent;
    }
    contentBlock.appendChild(firstContent);
    contentBlock.appendChild(secondContent);
    questionBlock.appendChild(contentBlock);
    return questionBlock;
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

  createRandomNumber(max) {
    const number = Math.floor(Math.random() * max);
    return number;
  }

  choseContentContainer() {
    const contentContainer = Object.entries(this.gameBlocks.contentContainer);
    this.choosenContainer = contentContainer[this.containerIndex][1];
    this.gameBlocks.gameField.childNodes.forEach((item) => {
      item.classList.remove('active');
    });
    this.choosenContainer.container.classList.add('active');
  }

  addLevelContent() {
    const numberSpan = this.choosenContainer.firstContent;
    const charSpan = this.choosenContainer.secondContent;
    this.clearTextContent(numberSpan, charSpan);
    numberSpan.textContent = this.createRandomNumber(10);
    charSpan.textContent = this.letters[this.createRandomNumber(this.letters.length)];
    this.setRightAnswer(numberSpan, charSpan);
  }

  setRightAnswer(number, char) {
    if (this.gameBlocks.gameField.childNodes[0].classList.contains('active')) {
      this.answer = number.textContent % 2 === 0;
    }
    if (this.gameBlocks.gameField.childNodes[2].classList.contains('active')) {
      this.answer = this.vowelsLetters.includes(char.textContent);
    }
  }

  listenersHandler() {
    this.gameBlocks.buttonWrapper.addEventListener('click', (e) => {
      const target = e.target.closest('button');
      if (!target) return;
      if (target.textContent === 'YES') {
        this.guess = true;
      } else if (target.textContent === 'NO') {
        this.guess = false;
      }
      this.checkGuess();
    });
    this.bindKeyHandler = this.keyboarArrowClickHandler.bind(this);
    document.addEventListener('keydown', this.bindKeyHandler);
  }

  clearTextContent(first, second) {
    first.textContent = '';
    second.textContent = '';
  }

  difficultyHandler() {
    if (this.answersCount >= 0 && this.answersCount < 5) {
      this.difficulty = 5;
    } else if (this.answersCount >= 5 && this.answersCount <= 10) {
      this.difficulty = 4;
      this.scoreMultipliyer = 1.6;
    } else if (this.answersCount >= 10 && this.answersCount <= 15) {
      this.difficulty = 3;
      this.scoreMultipliyer = 2.5;
    } else if (this.answersCount >= 16 && this.answersCount <= 20) {
      this.difficulty = 2;
      this.scoreMultipliyer = 2.5;
    } else {
      this.difficulty = 1;
      this.scoreMultipliyer = 3;
    }
  }

  keyboarArrowClickHandler(e) {
    if (e.code === 'ArrowLeft') {
      this.gameBlocks.noButton.click();
    } else if (e.code === 'ArrowRight') {
      this.gameBlocks.yesButton.click();
    }
  }

  checkGuess() {
    this.answersCount += 1;
    this.wrongAnswerHandler();
    this.correctAnswerHandler();
    this.addLevelContent();
    if (this.guessCount % this.difficulty === 0 && this.guessCount !== 0) {
      this.clearTextContent(this.choosenContainer.firstContent, this.choosenContainer.secondContent);
      this.containerIndex = +(!this.containerIndex);
      this.choseContentContainer();
      this.guessCount = 0;
      this.difficultyHandler();
      this.addLevelContent();
    }
    if (this.elements.stats.icons.children.length === 0) {
      this.endGameHandler();
    }
  }

  correctAnswerHandler() {
    if (this.guess === this.answer) {
      this.guessCount += 1;
      this.$soundPlayer.playSound('level-next');
      this.score += this.scoreMultipliyer * 20;
      this.elements.stats.score.textContent = this.score;
    }
  }

  wrongAnswerHandler() {
    const live = this.elements.stats.icons.querySelector('.game-status_custom');
    if (this.guess !== this.answer) {
      // this.$soundPlayer.playSound('level-next');
      this.elements.stats.icons.removeChild(live);
      this.guessCount += 1;
    }
  }

  setTimerTextContent() {
    this.elements.stats.time.textContent = `${this.timer.time.minutesString}:${this.timer.time.secondsString}`;
  }

  blockOrApproveClicksHandler(type = 'block') {
    if (type === 'block') {
      this.gameBlocks.buttonWrapper.classList.add('no-clicks');
    } else {
      this.gameBlocks.buttonWrapper.classList.remove('no-clicks');
    }
  }

  endGameHandler() {
    document.removeEventListener('keydown', this.bindKeyHandler);
    this.$soundPlayer.playSound('game-end');
    this.blockOrApproveClicksHandler();
    clearInterval(this.currentTimeInterval);
    Mixin.dispatch(this.gameConfig.events.gameEnd, {
      game: this.gameConfig.games.charsAndNumbersGame.id,
      score: this.score,
    });
  }

  startGame() {
    this.blockOrApproveClicksHandler('approve');
    this.timer.startCount(68, this.setTimerTextContent.bind(this), this.endGameHandler.bind(this));
    this.choseContentContainer();
    this.listenersHandler();
    this.addLevelContent();
  }

  destroyGameInstance() {
    clearInterval(this.currentTimeInterval);
    document.removeEventListener('keydown', this.bindKeyHandler);
    this.elements.game.box.removeChild(this.gameBlocks.container);
    this.elements.stats.score.innerText = '';
    this.elements.stats.time.innerText = '';
    this.elements.stats.icons.innerText = '';
  }

  getGameInstance(app, elements) {
    const game = new CharsAndNumbers(app, elements);
    game.init();
    return game;
  }

  init() {
    this.createField();
    this.elements.game.box.appendChild(this.gameBlocks.container);
  }
}
