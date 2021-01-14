import {cardsArray} from './js/cardsArray.js';
import './css/style.css';

export default class MemoryGame {
  constructor(app, size) {
    this.guess = 0;
    this.firstGuess = '';
    this.secondGuess = '';
    this.previousClick = null;
    this.delay = 1000;
    this.timer;
    this.clear;
    this.isGameActive = false; // for start timing
    this.score = 0;
    this.win = 0;
    this.size = size; // for level
    this.step = 4; // for change level
    this.$app = app;
    this.gameConfig = this.$app.config.games.memoryGame;
  }

  // 1 - game board append
  getGameNode() {
    const game = document.createElement('div');
    game.setAttribute('id', 'memory-game');   // ---------------------------------- MEMORY GAME
    const section = document.createElement('section');
    section.setAttribute('class', 'grid');
    section.addEventListener('click', () => this.flipCard(event));

    const panel = document.createElement('div');
    panel.setAttribute('class', 'panel');

    const timer = document.createElement('div');
    timer.insertAdjacentHTML('afterBegin', `<span>Time:</span>`);
    timer.insertAdjacentHTML('beforeEnd', `<span id="timer">00:00</span>`);

    const score = document.createElement('div');
    score.insertAdjacentHTML('afterBegin', `<span>Score:</span>`);
    score.insertAdjacentHTML('beforeEnd', `<span id="score">0</span>`);

    panel.append(score, timer);
    game.append(section, panel);
    return game;
  }

  // 2 - cards append to game
  createCards(size) {
    const section = document.querySelector('.grid');

    const resizedArray = cardsArray
      .sort(() => 0.5 - Math.random())
      .slice(0, size);
    const gameBoard = resizedArray
      .concat(resizedArray)
      .sort(() => 0.5 - Math.random());
    for (let i = 0; i < gameBoard.length; i++) {
      const card = document.createElement('div');
      card.classList.add('card');
      card.setAttribute('class', 'card');
      card.dataset.name = gameBoard[i].name;
      const back = document.createElement('div');
      back.classList.add('back');
      const face = document.createElement('div');
      face.classList.add('face');
      face.style.backgroundImage = `url(${gameBoard[i].img})`;
      card.append(face, back);
      section.append(card);
    }
  }

  flipCard(event) {
    const clicked = event.target;

    // didn't count falsy clicks
    if (clicked.nodeName === 'SECTION' ||
      clicked === this.previousClick ||
      clicked.parentNode.classList.contains('selected')) {
      return;
    } else {
      // to start Timer
      if (!this.isGameActive) {
        this.isGameActive = true;
        this.updateTimer();
      }
    }

    // check 2 cards for match
    if (this.guess < 2) {
      this.guess++;

      // flip chosen cards
      if (this.guess === 1) {
        this.firstGuess = clicked.parentNode.dataset.name;
        clicked.parentNode.classList.add('selected');
      } else {
        this.secondGuess = clicked.parentNode.dataset.name;
        clicked.parentNode.classList.add('selected');
      }

      // if matces - add .match and reset, if not matches - just reset
      if (this.firstGuess !== '' && this.secondGuess !== '') {
        if (this.firstGuess === this.secondGuess) {
          this.win += 1;
          this.score += 10;
          this.updateScore();
          setTimeout(this.match, this.delay);
          setTimeout(() => this.resetGuesses(), this.delay);
          this.checkIfWin();
        } else {
          if (this.score > 0) {
            this.score -= 2;
            this.updateScore();
          }
          setTimeout(() => this.resetGuesses(), this.delay);
        }
      }

      this.previousClick = clicked;
    }
  }

  //  check for matches
  match() {
    const selected = document.querySelectorAll('.selected');
    selected.forEach(card => card.classList.add('match'));
  }

  resetGuesses() {
    this.firstGuess = '';
    this.secondGuess = '';
    this.guess = 0;
    const selected = document.querySelectorAll('.selected');
    selected.forEach(card => card.classList.remove('selected'));
  }

  checkIfWin() {
    if (this.win === this.size) {
      console.log('you are won for', this.timer, this.score);  // ----------------------- POP UP should be here
      this.destroyGameInstance();
      this.size = this.size + this.step;
      setTimeout(() => {
        if (this.win === cardsArray.length) {
          console.log('FINISH GAME'); // ------------------------------------------------- POP UP should be here
        } else {
          this.getGameInstance(this.size);
        }
      }, this.delay);
    }
  }

  updateScore() {
    const scoreToShow = document.querySelector('#score');
    scoreToShow.textContent = `${this.score}`;
  }

  updateTimer() {
    const timeToShow = document.querySelector('#timer');
    let clock = 0;
    this.timer = clock * 60;
    this.clear = setInterval(() => {
      let min = Math.floor(this.timer / 60);
      let sec = this.timer % 60;
      timeToShow.textContent = `${this.addZero(min)}:${this.addZero(sec)}`;
      this.timer++;
    }, this.delay)
  }

  addZero(num) {
    return (parseInt(num, 10) < 10 ? '0' : '') + num;
  }

  destroyGameInstance() {
    clearInterval(this.clear);
    this.isGameActive = false;
    this.gameEnd();
    const game = document.querySelector('#memory-game'); // ---------------------------------------- M G
    game.remove();
  }

  gameEnd() {
    return {
      game: this.gameConfig.id,
      time: this.timer,
      score: this.score
    };
  }

  init() {
    document.body.append(this.getGameNode());
    this.createCards(this.size);
  }

  getGameInstance(root) {
    const app = new MemoryGame(root, 6);
    app.init();
    return app;
  }
}
