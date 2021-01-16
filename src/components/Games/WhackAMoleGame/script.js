class WhackAMoleGame {
    constructor() {
        // this.$app = app;
        // this.gameConfig = this.$app.config.games.memoryGame;
        this.game = document.querySelector('#whackAMole-game');
        this.startBtn = document.querySelector('button');
        this.holes = document.querySelectorAll('.hole');
        this.moles = document.querySelectorAll('.mole');
        this.lastHole;
        this.score = 0;
        this.scoreBoard = document.querySelector('.score');
        this.timeUp = false;
    }

    // Important !
    // getGameNode() {
    //     const game = document.createElement('div');
    //     game.setAttribute('id','whackAMole-game');
    //
    //     const title = document.createElement('h1');
    //     title.textContent = 'Whack-a-mole!';
    //     title.insertAdjacentHTML('beforeEnd', `<span class="score">0</span>`);
    //
    //     const button = document.createElement('button');
    //     button.textContent = 'Start';
    //
    //     game.append(title, button, this.createHoles());
    //     return game;
    // }
    //
    // createHoles() {
    //     const panel = document.createElement('div');
    //     panel.setAttribute('class', 'panel');
    //     for (let i = 0; i < 6; i += 1) {
    //         const hole = document.createElement('div');
    //         hole.setAttribute('class', 'hole');
    //         hole.insertAdjacentHTML('beforeEnd', `<div class="mole"></div>`);
    //         panel.append(hole);
    //     }
    //     return panel;
    // }

    startGame() {
        this.scoreBoard.textContent = 0;
        this.score = 0;
        this.timeUp = false;
        this.showHideMoles();
        setTimeout(() => this.timeUp = true, 10000)
    }

    randomTime(min, max) {
        return Math.round(Math.random() * (max - min) + min);
    }

    randomHole(holes) {
        const idx = Math.floor(Math.random() * holes.length);
        const hole = holes[idx];
        if (hole === this.lastHole) {
            return this.randomHole(this.holes);
        }
        this.lastHole = hole;
        return hole;
    }

    showHideMoles() {
        const time = this.randomTime(800, 1000);
        const hole = this.randomHole(this.holes);
        hole.classList.add('up');
        setTimeout(() => {
            hole.classList.remove('up');
            if (!this.timeUp) this.showHideMoles();
        }, time);
    }

    countScore(e) {
        if(!e.isTrusted) return; // protected from cheat
        this.score += 1;
        this.moles.forEach(mole => mole.classList.remove('up'));
        this.scoreBoard.textContent = this.score;
    }

    // Important !
    destroyGameInstance() {
        this.timeUp = false;
        this.gameEnd();
        this.game.remove();
    }

    // Important !
    gameEnd() {
        return {
            // game: this.gameConfig.id,
            score: this.score,
        };
    }

    // Important !
    init() {
        // document.body.append(this.getGameNode());
        this.startBtn.addEventListener('click', this.startGame.bind(this));
        this.moles.forEach(mole => mole.addEventListener('click', this.countScore.bind(this)));
    }

    // Important !
    getGameInstance(root) {
        const app = new WhackAMoleGame(root);
        app.init();
        return app;
    }
}

const app = new WhackAMoleGame();
app.init();




// --------------------------------------------------------------
//
// const holes = document.querySelectorAll('.hole');
// const scoreBoard = document.querySelector('.score');
// const moles = document.querySelectorAll('.mole');
// let lastHole;
// let timeUp = false;
// let score = 0;
//
// function randomTime(min, max) {
//     return Math.round(Math.random() * (max - min) + min);
// }
//
// function randomHole(holes) {
//     const idx = Math.floor(Math.random() * holes.length);
//     const hole = holes[idx];
//     if (hole === lastHole) {
//         console.log('Ah nah thats the same one bud');
//         return randomHole(holes);
//     }
//     lastHole = hole;
//     return hole;
// }
//
// function peep() {
//     const time = randomTime(200, 1000);
//     const hole = randomHole(holes);
//     hole.classList.add('up');
//     setTimeout(() => {
//         hole.classList.remove('up');
//         if (!timeUp) peep();
//     }, time);
// }
//
// function startGame() {
//     scoreBoard.textContent = 0;
//     timeUp = false;
//     score = 0;
//     peep();
//     setTimeout(() => timeUp = true, 10000)
// }
//
// function bonk(e) {
//     if(!e.isTrusted) return; // cheater!
//     score++;
//     this.parentNode.classList.remove('up');
//     scoreBoard.textContent = score;
// }
//
// moles.forEach(mole => mole.addEventListener('click', bonk));
