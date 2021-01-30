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

  setContent(contentType, cb = null) {
    const contentStyles = window.getComputedStyle(this.elementContent);
    if (contentStyles.transition === 'all 0s ease 0s') this.elementContent.style.transition = 'opacity .5s ease-in-out';

    window.requestAnimationFrame(() => {
      const newContentElement = this.getNode(this.templates[contentType]) || '';
      const handler = () => {
        this.elementContent.ontransitionend = null;
        this.elementContent.replaceWith(newContentElement);
        this.elementContent = newContentElement;

        window.requestAnimationFrame(() => {
          window.requestAnimationFrame(() => this.elementContent.removeAttribute('style'));

          this.elements = this.getNodeElements(newContentElement, contentType);

          this.setContentListeners(this.elements, contentType);

          cb && cb(this);
        });
      };

      newContentElement.style.opacity = '0';
      this.elementContent.style.opacity = '0';

      if (+contentStyles.opacity) {
        this.elementContent.ontransitionend = handler;
      } else {
        handler();
      }
    });
  }

  setContentListeners(elements, contentType) {
    if (contentType === 'game') {
      elements.game.finishBtn.addEventListener('click', () => document.body.classList.add('game-button-finish-clicked'));
    }
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
    } if (type === 'gameList') {
      return {
        gameContainer: node.querySelector('.games'),
        gamesList: node.querySelector('.games__list'),
      };
    }

    return {};
  }

  getContentElements() {
    return this.elements;
  }
}
