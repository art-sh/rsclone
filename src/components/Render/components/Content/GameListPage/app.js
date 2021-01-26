import Mixin from '@helpers/Mixin';
import ModalWindow from '../../ModalWindow/app';

const templateGameBlock = require('./assets/templates/game-block.html');
const templateRecommendedGame = require('./assets/templates/recomended-game-block.html');

export default class GameListPage {
  constructor(app) {
    this.$app = app;
    this.config = app.config;
    this.modalWindow = new ModalWindow(app);
    this.blockTypes = {
      recommendedBlock: 'recommended',
      commonBlock: 'common',
    };
    this.parametresObject = null;
  }

  getTemplateElementsObject(blockType = this.blockTypes.recommendedBlock) {
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

  setParamsObject(title, type, rule, gameDescription, configGameKey) {
    const gameId = this.config.games[`${configGameKey}`].id;
    return {
      type,
      container: document.querySelector('#app'),
      text: {
        title,
        rule,
        gameDescription,
      },
      callback: {
        play: () => this.$app.router.navigate(`game/${gameId}`),
      },
    };
  }

  setRecommendedGame() {
    const recommendedGameTemplate = this.getTemplateElementsObject();
    const recomendedGameConfig = this.config.games[`${this.getRandomGameName()}`];
    this.setContentByConfig(recommendedGameTemplate, recomendedGameConfig, this.randomGameTitle);
    this.elements.gameContainer.insertBefore(recommendedGameTemplate.node, this.elements.gameContainer.firstChild);
    this.setElementsListeners(recommendedGameTemplate.gameStartButton, this.parametresObject);
  }

  setGameBlocks() {
    this.gameTitles.forEach((configGameKey) => {
      if (configGameKey !== this.randomGameTitle) {
        const commonGameConfig = this.config.games[`${configGameKey}`];
        const commonGameTemplate = this.getTemplateElementsObject(this.blockTypes.commonBlock);
        this.setContentByConfig(commonGameTemplate, commonGameConfig, configGameKey);
        this.setElementsListeners(commonGameTemplate.gameStartButton, this.parametresObject);
        this.elements.gamesList.append(commonGameTemplate.node);
      }
    });
  }

  setContentByConfig(template, config, configGameKey) {
    this.parametresObject = this.setParamsObject(config.name, this.config.modalWindow.types.gameDescription, config.rules, config.description, configGameKey);
    template.gameDesc.textContent = config.description;
    template.gameTitle.textContent = config.name;
  }

  setElementsListeners(button, parametres) {
    button.addEventListener('click', () => {
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
