import Mixin from '@helpers/Mixin';
import CharsAndNumbers from '../../../Games/charsAndNumbers/charsAndNumbers';

const templateGame = require('./assets/templates/game.html');
const templateWelcome = require('./assets/templates/welcome.html');

export default class Content {
  constructor(app, appContainer) {
    this.$app = app;
    this.$appContainer = appContainer;

    this.elementContent = null;
    this.elements = {};
    this.templates = {
      game: templateGame,
      welcome: templateWelcome,
    };
  }

  init() {
    this.elementContent = document.createElement('div');

    this.$appContainer.append(this.elementContent);
  }

  getNode(template) {
    const newContentElement = document.createElement('div');
    newContentElement.append(Mixin.parseHTML(template));

    return newContentElement.firstChild;
  }

  setContent(contentType) {
    contentType = 'game';
    const newContentElement = this.getNode(this.templates[contentType]) || '';

    this.elementContent.replaceWith(newContentElement);

    this.elementContent = newContentElement;
    this.elements = this.getNodeElements(newContentElement, contentType);
    const game = new CharsAndNumbers().getGameInstance(this.$app.config, this.elements);
    game.init();
    this.setContentListeners(newContentElement, contentType);
  }

  setContentListeners() {
    //
  }

  getNodeElements(node, type) {
    if (type === 'game') {
      return {
        node,
        title: node.querySelector('.game-title'),
        stats: {
          score: node.querySelector('.game-status__state-score'),
          time: node.querySelector('.game-status__state-time'),
          icons: node.querySelector('.game-status__item-stats'),
        },
        game: {
          box: node.querySelector('.game-box'),
          finishBtn: node.querySelector('.game-finish'),
        },
        templates: {
          star: node.querySelector('#game-stats-star'),
        },
      };
    }

    return {};
  }

  getContentElements() {
    return this.elements;
  }
}
