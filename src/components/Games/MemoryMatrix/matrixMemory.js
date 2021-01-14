 class ColourMatrix {
    constructor() {
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
        this.node = null;
    }
    createField = () =>{
        const fieldContainer = this.createElementFactory('div', null, 'field-container', null, null,null);
        const mainField = this.createElementFactory('div', null, 'field-main', null, null, null)
        fieldContainer.appendChild(this.createGameHeader())
        fieldContainer.appendChild(mainField);
        fieldContainer.appendChild(this.createElementFactory('button', null, 'game-start-button', null, null, 'Game Start'));
        this.createGamesblocks(mainField);
        this.listenersHandlers(fieldContainer)
        console.log(fieldContainer)
        return fieldContainer;
    }
    createGameHeader = () => {
        const headerWrapper = this.createElementFactory('div', null, 'header-wrapper', null, null, null);
        const header = this.createElementFactory('div', null, 'header', null, null, null);
        const livesContainer = this.createElementFactory('div', null, 'lives-container', null, null, null);
        const scoreContainer = this.createElementFactory('div', null, 'score-container', null, null, null);
        const levelContainer = this.createElementFactory('div', null, 'level-container', null, null, null);
        livesContainer.appendChild(this.createElementFactory('span', null, 'lives', null, null, `Lives:`));
        livesContainer.appendChild(this.createElementFactory('span', null, 'lives-count', null, null, `${this.lives}`));
        scoreContainer.appendChild(this.createElementFactory('span', null, 'score', null, null, `Score:`));
        scoreContainer.appendChild(this.createElementFactory('span', null, 'score-count', null, null, `${this.currentScore}`));
        levelContainer.appendChild(this.createElementFactory('span', null, 'level', null, null, `Level:`));
        levelContainer.appendChild(this.createElementFactory('span', null, 'level-count', null, null, `${this.currentLevel}`));
        header.append(livesContainer, scoreContainer, levelContainer)
        headerWrapper.appendChild(header);
        return headerWrapper;
    }
    createGamesblocks = (mainField) => {
        mainField.innerHTML = '';
        for(let i = 1; i <= this.fieldSize; i++) {
            mainField.appendChild(this.createElementFactory('div', i, 'game-button', null, null, null));
        }
       
    }
    createElementFactory = (elem, id, classSelec, attr, attrValue,textContent) => {
        const element = document.createElement(elem);
        if(id) {
            element.setAttribute('id', id);
        }
        element.classList.add(classSelec);
        if(attr) {
            element.setAttribute(attr, attrValue);
        }
        if(textContent) {
            element.textContent = textContent;
        }
        return element;
    }
    createOverlay() {
        const overlay = this.createElementFactory('div', null, 'overlay', null, null,null);
        const overlayContainer = this.createElementFactory('div', null, 'overlay-container', null, null,null);
        const scoreContainer = this.createElementFactory('div', null, 'score-container', null, null, null);
        const restartGame = this.createElementFactory('button', null, 'game-restart-button', null, null, 'Restart');
        scoreContainer.appendChild(this.createElementFactory('span', null, 'overaly-score', null, null, `Score:`));
        scoreContainer.appendChild(this.createElementFactory('span', null, 'overlay-score-count', null, null, `${this.score}`));
        overlayContainer.appendChild(scoreContainer);
        overlayContainer.appendChild(restartGame);
        overlay.appendChild(overlayContainer);
        restartGame.addEventListener('click', ()=>{
            const fieldContainer = document.querySelector('.field-container');
            fieldContainer.removeChild(overlay);
            this.resetFlags();
            this.startGame();
        })
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
        document.querySelector('.field-main').style.width = 40 + '%';
    }
    listenersHandlers(fieldContainer) {
        console.log(fieldContainer)
        const field = fieldContainer.querySelector('.field-main');
        const gameStartButton = fieldContainer.querySelector('.game-start-button');
        gameStartButton.addEventListener('click', ()=>{
            this.startGame();
            gameStartButton.textContent = 'Finish';
        })
        field.addEventListener('click', (e)=>{
            const guessBlock = e.target.closest('.game-button')
            if(guessBlock) {
                this.checkAnswer(guessBlock); 
            }
        })
      
    }
    difficultyLevelHandler() {
        switch (this.correctAnswers) {
            case 3 :
                this.fieldSize = 6 ;
                this.aciveBlocksNumber = 2;
                document.querySelector('.field-main').style.width = 50 + '%';
                this.scoreMultiplier = 1.5
                break;
            case 6 :
                this.fieldSize = 9;
                this.aciveBlocksNumber = 3;
                document.querySelector('.field-main').style.width = 50 + '%';
                this.scoreMultiplier = 1.7
                break;
            case 9:
                this.fieldSize = 9;
                this.aciveBlocksNumber = 4;
                this.scoreMultiplier = 1.7
                break;
            case 12: 
                document.querySelector('.field-main').style.width = 70 + '%';
                this.fieldSize = 12;
                this.aciveBlocksNumber = 4;
                this.scoreMultiplier = 2;
                break;
            case 16 :
                this.fieldSize = 18;
                this.aciveBlocksNumber = 4;
                document.querySelector('.field-main').style.width = 100 + '%';
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
        }
    }
    randomElements(n = 2) {
        const gameButtons = document.querySelectorAll('.game-button');
        const numbersCollection = new Set();
        while (numbersCollection.size < this.aciveBlocksNumber) {
            numbersCollection.add(Math.floor(Math.random() * gameButtons.length))
        }
        return Array.from(numbersCollection);
    }
    startGame() {
        const lives = document.querySelector('.lives-count');
        const mainField = document.querySelector('.field-main')
        lives.textContent = this.lives;
        this.difficultyLevelHandler();
        const levelCount = document.querySelector('.level-count');
        levelCount.textContent = this.correctAnswers + 1;
        this.createGamesblocks(mainField);
        this.answersCount = 0;
        const gameButtons = document.querySelectorAll('.game-button');
        let activeButtons = this.randomElements();
        gameButtons.forEach(item => item.style.pointerEvents = 'none')
        setTimeout(() => {
            activeButtons.forEach(item => {
                gameButtons[item].classList.add('active');
                gameButtons[item].classList.add('color-block');
            }) 
        }, 1000);
        setTimeout(()=> {
            gameButtons.forEach(item => {
                item.style.pointerEvents = 'all'
                if(item.classList.contains('active')) {
                    item.classList.remove('color-block');
                    
                }
            })
        }, this.visibilityDelay)
    }
    checkAnswer(block) {
      const score = document.querySelector('.score-count');
      this.correctAnswerhandler(block);
      this.wrongAnswerhandler(block);
      if(this.answersCount == this.aciveBlocksNumber) {
          this.score += this.scoreMultiplier * 20;
          this.correctAnswers+=1;
          score.textContent =this.score;
          setTimeout(()=>{
            document.querySelectorAll('.game-button').forEach(item => item.style.backgroundColor = 'white')
          }, 1000)
         setTimeout(()=>{
            this.startGame()
         }, 2000)
      }
    }
    correctAnswerhandler(block) {

        if(block.classList.contains('active')) {
            this.answersCount += 1;
            block.classList.add('color-block');
            block.style.pointerEvents = 'none';
        }
    }
    wrongAnswerhandler(block) {
        const lives = document.querySelector('.lives-count');
        if(!block.classList.contains('active')) {
            this.lives -= 1;
            lives.textContent = this.lives;
        }
        if(this.lives === 0) {
            const fieldContainer = document.querySelector('.field-container');
            const overlay = this.createOverlay()
            fieldContainer.appendChild(overlay)
            
        }
    }
    endGameHandler() {
        Mixin.dispatch(this.$app.config.events.gameEnd, {
            game: 'Colour Matrix',
            summary: this.score,
          });
        
    }
    init() {
        const field = this.createField()
        
        return field;
    }
    getGameInstance() {
        let game = new ColourMatrix();
        this.node = game.init();
        return this.node;
    }
}
let test = new ColourMatrix();

document.body.appendChild(test.init())
