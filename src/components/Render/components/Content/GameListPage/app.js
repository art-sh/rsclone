import Mixin from '@helpers/Mixin';
import ModalWindow from '../../ModalWindow/app';

const templateGameBlock = require('./assets/templates/game-block.html');
const templateRecommendedGame = require('./assets/templates/recomended-game-block.html');

export default class GameListPage {
  constructor(app) {
    this.$app = app;
    this.config = app.config;
    this.modalWindow = new ModalWindow(app);
  }

  getGameBlockTemplate(blockType = 'recommended') {
    let node = Mixin.getNode(templateRecommendedGame);
    if (blockType !== 'recommended') {
      node = Mixin.getNode(templateGameBlock);
    }
    return {
      node,
      gameFrame: node.querySelector('.games__img'),
      gameTitle: node.querySelector('.games__title'),
      gameDesc: node.querySelector('.games__p'),
      gameStartButton: node.querySelector('.games__button'),
    };
  }

  getRandomGameName() {
    this.gameTitles = Object.keys(this.config.games);
    this.randomGameTitle = this.gameTitles[Math.floor(Math.random() * this.gameTitles.length)];
    return this.randomGameTitle;
  }

  setRecommendedGame() {
    const recommendedGameTemplate = this.getGameBlockTemplate();
    const recomendedGameConfig = this.config.games[`${this.getRandomGameName()}`];
    recommendedGameTemplate.gameDesc.textContent = recomendedGameConfig.description;
    recommendedGameTemplate.gameTitle.textContent = recomendedGameConfig.name;
    this.elements.gameContainer.insertBefore(recommendedGameTemplate.node, this.elements.gameContainer.firstChild);
    const param = this.setParamsObject(recomendedGameConfig.name, this.config.modalWindow.types.gameDescription, recomendedGameConfig.rules, recomendedGameConfig.description, this.randomGameTitle);
    recommendedGameTemplate.gameStartButton.addEventListener('click', () => {
      this.openModalWindow(param);
    });
  }

  setParamsObject(title, type, rule, gameDescription, gameTitle) {
    const gameId = this.config.games[`${gameTitle}`].id;
    return {
      type,
      container: document.querySelector('#app'),
      text: {
        title,
        rule,
        gameDescription,
      },
      callback: {
        play: this.$app.router.navigate.bind(this, (`game/${gameId}`)),
      },
    };
  }

  setGameBlocks() {
    this.gameTitles.forEach((item) => {
      if (item !== this.randomGameTitle) {
        const commonGameTemplate = this.getGameBlockTemplate('common');
        const commonGameConfig = this.config.games[`${item}`];
        const param = this.setParamsObject(commonGameConfig.name, this.config.modalWindow.types.gameDescription, commonGameConfig.rules, commonGameConfig.description, item);
        commonGameTemplate.gameDesc.textContent = commonGameConfig.description;
        commonGameTemplate.gameTitle.textContent = commonGameConfig.name;
        commonGameTemplate.gameStartButton.addEventListener('click', () => {
          this.openModalWindow(param);
        });
        this.elements.gamesList.append(commonGameTemplate.node);
      }
    });
  }

  openModalWindow(param) {
    this.modalWindow.showModal(param);
  }

  setGameListContent(content) {
    this.elements = content.elements;
    this.setRecommendedGame();
    this.setGameBlocks();
  }
}
