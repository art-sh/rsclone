import Mixin from '@helpers/Mixin';
import ModalWindow from '../ModalWindow/app';

const templateCommonGame = require('./assets/templates/game-block.html');
const templateRecommendedGame = require('./assets/templates/recomended-game-block.html');

export default class GameListPage {
  constructor(app) {
    this.$app = app;
    this.$config = app.config;
    this.$content = null;
    this.$contentElements = null;

    this.modalTypes = app.config.modalWindow.types;
    this.gameBlockTypes = {
      recommended: 'recommended',
      common: 'common',
    };

    this.imagesCollection = Mixin.handleWebpackImport(require.context('./assets/img', true, /\.png/));
    this.templates = {
      [this.gameBlockTypes.recommended]: templateRecommendedGame,
      [this.gameBlockTypes.common]: templateCommonGame,
    };
  }

  getTemplate(type) {
    return this.templates[type] || '';
  }

  getNode(type) {
    return Mixin.getNode(this.getTemplate(type));
  }

  getGameElements(node) {
    return {
      node,
      gameFrame: node.querySelector('.games__img'),
      gameTitle: node.querySelector('.games__title'),
      gameDescription: node.querySelector('.games__p'),
      gameStartButton: node.querySelector('.games__button'),
    };
  }

  getRandomGameConfig() {
    const gamesCollection = Object.entries(this.$config.games);

    return gamesCollection[Math.floor(Math.random() * gamesCollection.length)][1];
  }

  getModalConfig(modalType, gameConfig) {
    return {
      type: modalType,
      container: this.$content.$appContainer,
      text: {
        title: gameConfig.name,
        rule: gameConfig.rules,
        gameDescription: gameConfig.description,
      },
      callback: {
        play: () => this.$app.router.navigate(`game/${gameConfig.id}`),
      },
    };
  }

  getGameInstance(type, gameConfig) {
    const node = this.getNode(type);
    const elements = this.getGameElements(node);
    const modalConfig = this.getModalConfig(this.modalTypes.gameDescription, gameConfig);

    this.setContentByConfig(elements, gameConfig);
    this.setElementsListeners(elements, modalConfig);

    return node;
  }

  fillGameList() {
    const recommendedGameConfig = this.getRandomGameConfig();

    Object.entries(this.$config.games).forEach(([, gameConfig]) => {
      if (recommendedGameConfig.id === gameConfig.id) {
        const node = this.getGameInstance(this.gameBlockTypes.recommended, gameConfig);
        this.$contentElements.gameContainer.insertBefore(node, this.$contentElements.gameContainer.firstChild);
      } else {
        const node = this.getGameInstance(this.gameBlockTypes.common, gameConfig);
        this.$contentElements.gamesList.append(node);
      }
    });
  }

  setContentByConfig(gameElements, gameConfig) {
    gameElements.gameFrame.src = this.imagesCollection[gameConfig.id];
    gameElements.gameDescription.textContent = gameConfig.description;
    gameElements.gameTitle.textContent = gameConfig.name;

    gameElements.gameDescription.dataset.lang = `game__${gameConfig.id}-description`;
    gameElements.gameStartButton.dataset.lang = `game__${gameConfig.id}-start`;
  }

  setElementsListeners(elements, modalConfig) {
    elements.gameStartButton.addEventListener('click', () => {
      const modal = new ModalWindow(this.$app);

      modal.showModal(modalConfig);
    });
  }

  setGameListContent(content) {
    this.$content = content;
    this.$contentElements = content.elements;

    this.fillGameList();
  }
}
