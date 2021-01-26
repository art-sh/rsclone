import Mixin from '@helpers/Mixin';
import ModalWindow from '../../ModalWindow/app';

const templateGameBlock = require('./assets/templates/game-block.html');
const templateRecommendedGame = require('./assets/templates/recomended-game-block.html');

export default class GameListPage {
  constructor(app) {
    this.$app = app;
    this.config = app.config;
    this.elements = null;
    this.templateElements = null;
    this.modalWindow = new ModalWindow(app);
    this.blockTypes = {
      recommendedBlock: 'recommended',
      commonBlock: 'common',
    };
    this.parametresObject = null;
  }

  getTemplateElementsObject(blockType = this.blockTypes.recommendedBlock) {
    let node;
    if (blockType === 'recommended') {
      node = Mixin.getNode(templateRecommendedGame);
    } else {
      node = Mixin.getNode(templateGameBlock);
    }
    this.templateElements = {
      node,
      gameFrame: node.querySelector('.games__img'),
      gameTitle: node.querySelector('.games__title'),
      gameDesc: node.querySelector('.games__p'),
      gameStartButton: node.querySelector('.games__button'),
    };
    return this.templateElements;
  }

  getRandomGameName() {
    this.gameTitles = Object.keys(this.config.games);
    this.randomGameTitle = this.gameTitles[Math.floor(Math.random() * this.gameTitles.length)];
    return this.randomGameTitle;
  }

  setParamsObject(type, configGameKey) {
    const gameId = this.config.games[`${configGameKey}`].id;
    return {
      type,
      container: document.querySelector('#app'),
      text: {
        title: this.config.games[`${configGameKey}`].name,
        rule: this.config.games[`${configGameKey}`].rules,
        gameDescription: this.config.games[`${configGameKey}`].description,
      },
      callback: {
        play: () => this.$app.router.navigate(`game/${gameId}`),
      },
    };
  }

  setRecommendedGame() {
    this.getTemplateElementsObject();
    const recomendedGameConfig = this.config.games[`${this.getRandomGameName()}`];
    this.setContentByConfig(this.templateElements, recomendedGameConfig, this.randomGameTitle);
    this.elements.gameContainer.insertBefore(this.templateElements.node, this.elements.gameContainer.firstChild);
    this.setElementsListeners(this.templateElements, this.parametresObject);
  }

  setGameBlocks() {
    this.gameTitles.forEach((configGameKey) => {
      if (configGameKey !== this.randomGameTitle) {
        const commonGameConfig = this.config.games[`${configGameKey}`];
        this.getTemplateElementsObject(this.blockTypes.commonBlock);
        this.setContentByConfig(this.templateElements, commonGameConfig, configGameKey);
        this.setElementsListeners(this.templateElements, this.parametresObject);
        this.elements.gamesList.append(this.templateElements.node);
      }
    });
  }

  setContentByConfig(template, currentGameConfig, configGameKey) {
    this.parametresObject = this.setParamsObject(this.config.modalWindow.types.gameDescription, configGameKey);
    template.gameDesc.textContent = currentGameConfig.description;
    template.gameTitle.textContent = currentGameConfig.name;
  }

  setElementsListeners(nodeElements, parametres) {
    nodeElements.gameStartButton.addEventListener('click', () => {
      this.openModalWindow(parametres);
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
