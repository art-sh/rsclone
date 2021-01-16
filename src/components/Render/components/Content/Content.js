import Mixin from '@helpers/Mixin';

const templateGame = require('./assets/templates/game.html');
const templateWelcome = require('./assets/templates/welcome.html');

export default class Content {
  constructor(app, appContainer) {
    this.$app = app;
    this.$appContainer = appContainer;

    this.node = null;
    this.elements = {};
    this.templates = {
      game: templateGame,
      welcome: templateWelcome,
    };
  }

  init() {
    this.node = document.createElement('div');

    this.$appContainer.append(this.node);
  }

  getNode(template) {
    const node = document.createElement('div');
    node.append(Mixin.parseHTML(template));

    return node.firstChild;
  }

  setContent(contentType) {
    const newNode = this.getNode(this.templates[contentType]) || '';

    this.node.replaceWith(newNode);

    this.node = newNode;
    this.elements = this.getNodeElements(newNode, contentType);

    this.setContentListeners(newNode, contentType);
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
