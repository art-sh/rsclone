import './scss/style.scss';
import Mixin from '../../../helpers/Mixin';

export default class CharsAndNumbers {
  constructor() {
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
    this.lives = 3;
    this.containerIndex = 0;
    this.difficulty = 5;
    this.choosenContainer = null;
    this.answer = null;
    this.guess = null;
    this.guessCount = 0;
  }

  createField() {
    this.gameBlocks.container = this.createElementFactory('div', null, 'game-container', null, null, null);
    this.gameBlocks.gameField = this.createElementFactory('div', null, 'game-field', null, null, null);
    this.gameBlocks.noButton = this.createElementFactory('button', null, 'no-answer', null, null, 'NO');
    const leftArrow = this.createElementFactory('img', null, 'left-arrow', 'src', './images/left-arrow.svg', null);
    const rightArrow = this.createElementFactory('img', null, 'right-arrow', 'src', './images/right-arrow.svg', null);
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

  createElementFactory = (elem, id, classSelec, attr, attrValue, textContent) => {
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
      const target = e.target.textContent;
      if (target === 'YES') {
        this.guess = true;
      } else if (target === 'NO') {
        this.guess = false;
      }
      this.checkGuess();
    });
  }

  clearTextContent(first, second) {
    first.textContent = '';
    second.textContent = '';
  }

  difficultyHandler() {

  }

  checkGuess() {
    this.wrongAnswerHandler();
    this.correctAnswerHandler();

    if (this.guessCount % this.difficulty === 0 && this.guessCount !== 0) {
      this.clearTextContent(this.choosenContainer.firstContent, this.choosenContainer.secondContent);
      this.containerIndex = +(!this.containerIndex);
      this.choseContentContainer();
      this.guessCount = 0;
      this.addLevelContent();
    }

    if (this.lives <= 0) {
      this.endGameHandler();
    }
  }

  correctAnswerHandler() {
    if (this.guess === this.answer) {
      this.guessCount += 1;
      this.addLevelContent();
    }
  }

  wrongAnswerHandler() {
    if (this.guess !== this.answer) {
      this.guessCount += 1;
      this.lives -= 1;
      this.addLevelContent();
    }
  }

  endGameHandler() {
    alert('GAME OVER');
  }

  startGame() {
    this.choseContentContainer();
    this.listenersHandler();
    this.addLevelContent();
  }

  init() {
    this.createField();
    document.body.appendChild(this.gameBlocks.container);
    this.startGame();
  }
}
