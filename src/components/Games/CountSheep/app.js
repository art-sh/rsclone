import ReverseTimer from '@helpers/ReverseTimer';
// import ModalWindow from '../../Render/components/ModalWindow/app';
// import Mixin from '../../../helpers/Mixin';
import cardsArray from './js/cardsArray';
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
    card.style.backgroundImage = `url(${cardsArray[0].img})`;
    if (status === 'hide') {
      card.style.visibility = 'hidden';
    }
    return card;
  }

  createCards() {
    const amountOfCards = 30;
    const randomNumbers = this.getSortedRandomNumbers(amountOfCards, 7);
    for (let i = 1; i < amountOfCards + 1; i += 1) {
      if (randomNumbers[randomNumbers.length - 1] === i) {
        this.gameElement.append(this.buildGameCard(i, 'show'));
        randomNumbers.pop();
      } else {
        this.gameElement.append(this.buildGameCard(i, 'hide'));
      }
    }

    this.gameElement.append(this.buildAnswersBlock());
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

  buildAnswersBlock() {
    const answers = document.createElement('div');
    answers.classList.add('answers');

    let i = 0;
    while (i < 4) {
      const answersItem = document.createElement('button');
      answersItem.classList.add('answers__item');
      answersItem.innerText = '1';
      answers.append(answersItem);
      i += 1;
    }
    return answers;
  }

  startGame() {
    this.gameElement.innerHTML = '';
    this.createCards();
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
