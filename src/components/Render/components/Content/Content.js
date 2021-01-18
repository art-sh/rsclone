import Mixin from '@helpers/Mixin';

const templateGame = require('./assets/templates/game.html');
const templateWelcome = require('./assets/templates/welcome.html');
const templateGameList = require('./assets/templates/game-list.html');
const templateSignIn = require('./assets/templates/sign-in.html');
const templateSignUp = require('./assets/templates/sign-up.html');
const templateProfile = require('./assets/templates/profile.html');
const templateStatistic = require('./assets/templates/statistic.html');

export default class Content {
  constructor(app, appContainer) {
    this.$app = app;
    this.$appContainer = appContainer;

    this.elementContent = null;
    this.elements = {};
    this.templates = {
      game: templateGame,
      welcome: templateWelcome,
      gameList: templateGameList,
      signIn: templateSignIn,
      signUp: templateSignUp,
      profile: templateProfile,
      statistic: templateStatistic,
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
    const newContentElement = this.getNode(this.templates[contentType]) || '';
    console.log(contentType);
    this.elementContent.replaceWith(newContentElement);

    this.elementContent = newContentElement;
    this.elements = this.getNodeElements(newContentElement, contentType);

    this.setContentListeners(this.elements, contentType);
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
