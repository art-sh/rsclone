import ReverseTimer from '@helpers/ReverseTimer';
// import ModalWindow from '../../Render/components/ModalWindow/app';
// import Mixin from '../../../helpers/Mixin';
// import cardsArray from './js/cardsArray';
import './scss/style.scss';

export default class CountSheep {
  constructor(app, elements) {
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
    this.fieldSize = 30;
    this.fieldStep = 2; // for change level
    this.scoreStep = 99;
    this.scoreMultipliyer = 1;
    this.amountOfSheep = 0;
    this.amountOfCards = 30;
    this.answers = [];
  }

  getGameNode() {
    const game = document.createElement('div');
    game.setAttribute('id', 'count-sheep');
    return game;
  }

  buildGameCard(currentNumber, status) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.number = currentNumber;
    if (status === 'hide') {
      card.style.visibility = 'hidden';
    }
    return card;
  }

  getAmountOfSheep(min, max) {
    this.amountOfSheep = Math.floor(Math.random() * (max - min + 1)) + min;
    return this.amountOfSheep;
  }

  createCards() {
    this.getAmountOfSheep(4, 12);
    const randomNumbers = this.getSortedRandomNumbers(this.amountOfCards, this.amountOfSheep);
    for (let i = 1; i < this.amountOfCards + 1; i += 1) {
      if (randomNumbers[randomNumbers.length - 1] === i) {
        this.gameElement.append(this.buildGameCard(i, 'show'));
        randomNumbers.pop();
      } else {
        this.gameElement.append(this.buildGameCard(i, 'hide'));
      }
    }
  }

  getSortedRandomNumbers(lastNumberOfRange, amountOfNumbers) {
    const chosenNumbers = [];
    while (chosenNumbers.length < amountOfNumbers) {
      const n = Math.floor(Math.random() * lastNumberOfRange) + 1;
      if (chosenNumbers.indexOf(n) === -1) {
        chosenNumbers.push(n);
      }
    }
    return chosenNumbers.sort((a, b) => b - a);
  }

  shuffle(array) {
    array.sort(() => Math.random() - 0.5);
  }

  getOptionsOfAnswers() {
    const wrongAnswers = [];
    this.answers = [];
    this.answers.push(this.amountOfSheep);
    wrongAnswers.push(this.amountOfSheep - 1);
    wrongAnswers.push(this.amountOfSheep - 2);
    wrongAnswers.push(this.amountOfSheep - 3);
    wrongAnswers.push(this.amountOfSheep + 1);
    wrongAnswers.push(this.amountOfSheep + 2);
    wrongAnswers.push(this.amountOfSheep + 3);

    for (let i = 0; (i < 3) && (i < wrongAnswers.length); i += 1) {
      const r = Math.floor(Math.random() * (wrongAnswers.length - i)) + i;
      const answer = wrongAnswers[r];
      wrongAnswers[r] = wrongAnswers[i];
      wrongAnswers[i] = answer;
      this.answers.push(answer);
    }

    console.log(this.answers);
  }

  createAnswersBlock() {
    const answersBlock = document.createElement('div');
    answersBlock.classList.add('answers');
    this.getOptionsOfAnswers();
    this.shuffle(this.answers);
    console.log(this.answers);
    let i = 0;
    while (i < 4) {
      const answersItem = document.createElement('button');
      answersItem.classList.add('answers__item');
      answersItem.innerText = this.answers[i];
      answersBlock.append(answersItem);
      i += 1;
    }
    return answersBlock;
  }

  gameProgress() {
    setTimeout(() => {
      this.showCards();
    }, 1000);
    setTimeout(() => {
      this.showAnswers();
      this.setListeners();
    }, 2500);
  }

  setListeners() {
    this.elements.game.box.addEventListener('click', (e) => {
      const userAnswer = e.target.closest('.answers__item');
      let numberOfUserAnswer;
      if (userAnswer) {
        numberOfUserAnswer = Number(userAnswer.textContent);
        this.checkAnswer(numberOfUserAnswer, userAnswer);
      }
    }, {once: true});
  }

  checkAnswer(userAnswer, userAnswerButton) {
    if (userAnswer === this.amountOfSheep) {
      this.$soundPlayer.playSound('pew');
      userAnswerButton.style.backgroundColor = '#21B3A9';
      this.score += this.scoreStep;
      this.setScoreText(this.score);
      this.gameProgress();
    } else {
      this.$soundPlayer.playSound('sheep');
      userAnswerButton.style.backgroundColor = '#EA6453';
      this.gameProgress();
    }
  }

  showCards() {
    this.gameElement.innerHTML = '';
    this.createCards();
  }

  showAnswers() {
    this.gameElement.append(this.createAnswersBlock());
  }

  setTimeText(time) {
    this.elements.stats.time.textContent = `${time.minutesString}:${time.secondsString}`;
  }

  setScoreText(string) {
    this.elements.stats.score.textContent = string.toString();
  }

  startGame() {
    this.gameProgress();
    // this.timer.startCount(120, this.setTimeText.bind(this), this.gameEnd.bind(this));
    this.timer.startCount(90, this.setTimeText.bind(this));
    this.setScoreText(0);
  }

  init() {
    this.gameElement = this.getGameNode();
    this.elements.game.box.append(this.gameElement);
  }

  getGameInstance(root, elements) {
    const app = new CountSheep(root, elements);
    app.init();
    return app;
  }
}
