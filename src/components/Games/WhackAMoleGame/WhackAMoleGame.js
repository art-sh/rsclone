//In order to advance through the levels of this game, the user will have to hit the target mole.

class WhackAMoleGame {
    constructor(config, elements) {
        // this.gameConfig = config;

        this.elements = elements;
        this.gameElement = null;

        this.startBtn = null;
        this.isStartBtnDisabled = false;
        this.holes = null;
        this.moles = null;
        this.lastHole = null;
        this.fieldSize = 9;
        this.score = 0;
        this.scoreToHTML = null;
        this.isScoreCheat = false; // against repeated clicks on the mole
        this.timeUp = false; // to the end of the game
        this.sessionTime = 5000;
        this.step = 5000;
        this.timeId = null;
        this.clear = null;
    }

    getGameNode() {
        const game = document.createElement('div');
        game.setAttribute('id','whackAMole-game');

        // выпилится после внедрения
        const title = document.createElement('h1');
        title.textContent = 'Whack-a-mole!';
        title.insertAdjacentHTML('beforeEnd', `<span class="score">0</span>`);

        const button = document.createElement('button');
        button.textContent = 'Start';

        game.append(title, button, this.createHoles());
        return game;
    }

    createHoles() {
        const gameBoard = document.createElement('div');
        gameBoard.setAttribute('class', 'gameBoard');
        for (let i = 0; i < this.fieldSize; i += 1) {
            const holeMole = this.buildHoleMole();
            gameBoard.append(holeMole);
        }
        return gameBoard;
    }

    buildHoleMole() {
        const hole = document.createElement('div');
        hole.setAttribute('class', 'hole');
        hole.insertAdjacentHTML('beforeEnd', `<div class="mole"></div>`);
        return hole;
    }

    startGame() {
        console.log('startGame');

        this.isScoreCheat = false;
        this.isStartBtnDisabled = true;
        this.checkStartBtn();
        this.timeUp = false;
        this.showHideMoles(700, 1000);

        this.clear = setTimeout(() => {
            console.log('startGame, Timeout', this.score, this.sessionTime);

            this.isStartBtnDisabled = false;
            this.checkStartBtn();
            this.timeUp = true;

        }, this.sessionTime);
    }

    levelUp() {
        this.destroyGameInstance();
        this.sessionTime += this.step;
        this.startGame();
    }

    checkStartBtn() {
        console.log('checkStartBtn');

        if (this.isStartBtnDisabled) {
            this.startBtn.disabled = true;
            this.startBtn.style.cursor = 'default'
        } else {
            this.startBtn.disabled = false;
            this.startBtn.style.cursor = 'pointer'
        }
    }

    randomTime(min, max) {
        return Math.round(Math.random() * (max - min) + min);
    }

    randomHole(holes) {
        const index = Math.floor(Math.random() * holes.length);
        const hole = holes[index];
        if (hole === this.lastHole) {
            return this.randomHole(this.holes);
        }
        this.lastHole = hole;
        return hole;
    }

    showHideMoles(from, to) {
        const time = this.randomTime(from, to);
        const hole = this.randomHole(this.holes);
        hole.classList.add('up');
        this.timeId = setTimeout(() => {
            hole.classList.remove('up');
            if (!this.timeUp) {
                this.showHideMoles(from, to);
                // against repeated clicks on the mole
                setTimeout(() => {
                    this.isScoreCheat = false;
                }, time / 5);
            }
        }, time);
    }

    countScore(e) {
        if (!e.isTrusted) return; // protected from cheat

        if (!this.isScoreCheat) {
            this.score += 1;
            this.moles.forEach(mole => mole.classList.remove('up'));
            this.scoreToHTML.textContent = this.score; // записывать в скор приложения
            this.isScoreCheat = true;
        }
    }

    destroyGameInstance() {
        this.gameEnd();
        this.gameElement.remove();
    }

    gameEnd() {
        clearTimeout(this.timeId);
        this.isStartBtnDisabled = false;
        this.isScoreCheat = false;
        this.timeUp = false;

        return {
            // game: this.gameConfig.id,
            score: this.score,
        };
    }

    queryNodes() {
        this.gameElement = document.querySelector('#whackAMole-game');
        this.startBtn = document.querySelector('button');
        this.holes = document.querySelectorAll('.hole');
        this.moles = document.querySelectorAll('.mole');
        this.scoreToHTML = document.querySelector('.score');
    }

    init() {
        document.body.append(this.getGameNode());
        this.queryNodes();
        this.startBtn.addEventListener('click', this.startGame.bind(this));
        this.moles.forEach(mole => mole.addEventListener('click', this.countScore.bind(this)));

        console.log('init')
    }

    getGameInstance(root) {
        const app = new WhackAMoleGame(root);
        app.init();
        return app;
    }
}

const app = new WhackAMoleGame();
app.init();
