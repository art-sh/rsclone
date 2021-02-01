import Mixin from '@helpers/Mixin';
import HttpClient from '@helpers/HttpClient';

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

  changeTheme() {
    document.body.classList.toggle('theme-dark');
    document.body.classList.toggle('theme-light');
    this.elements.toggleThemeDark.classList.toggle('active');
    this.elements.toggleThemeLight.classList.toggle('active');
  }

  async successResponseHandler(response, type) {
    if (type === 'login') {
      const result = await response.result;
      const appToken = response.response.headers.get('app-token');
      if (appToken && response.response.ok) {
        this.$app.storage.storage.userToken = appToken;
        Object.assign(this.$app.storage.storage.userInfo, result.response);
        this.$app.router.navigate('game-list');
      } else {
        this.elements.errorMessageContainer.textContent = result.response.message;
      }
    } else if (type === 'register') {
      const result = await response.result;
      if (response.response.ok) {
        return this.$app.router.navigate('game-list');
      }
      if (!response.response.ok) this.elements.errorMessageContainer.textContent = result.response.message;
    }
  }

  backendRequestHandler(type) {
    const currentForm = document.forms[0];
    currentForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(currentForm);
      const outInner = Array.from(formData.entries())
        .reduce((out, item) => {
          out.push(`${encodeURIComponent(item[0])}=${encodeURIComponent(item[1])}`);
          return out;
        }, []);
      if (type === 'register' && currentForm.elements.password.value === currentForm.elements.passwordCheck.value) {
        HttpClient.send(`${this.$app.config.baseURL}/auth/${type}`, {
          fetch: {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: outInner.join('&'),
          },
          success: async (response) => {
            this.successResponseHandler(response, type);
          },
        });
      } else if (type === 'login') {
        HttpClient.send(`${this.$app.config.baseURL}/auth/${type}`, {
          fetch: {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: outInner.join('&'),
          },
          success: async (response) => {
            this.successResponseHandler(response, type);
          },
        });
      } else {
        this.elements.errorMessageContainer.textContent = 'Password does not match';
      }
    });
  }

  setContentListeners(elements, type) {
    if (type === 'game') {
      elements.game.finishBtn.addEventListener('click', () => document.body.classList.add('game-button-finish-clicked'));
    }
    if (type === 'profile') {
      elements.toggleThemeDark.addEventListener('click', () => this.changeTheme());
      elements.toggleThemeLight.addEventListener('click', () => this.changeTheme());
    }

    if (type === 'signIn') {
      this.backendRequestHandler('login');
    }
    if (type === 'signUp') {
      this.backendRequestHandler('register');
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
    } if (type === 'profile') {
      return {
        toggleThemeDark: node.querySelector('.theme-status_dark'),
        toggleThemeLight: node.querySelector('.theme-status_light'),
      };
    } if (type === 'signIn') {
      return {
        errorMessageContainer: node.querySelector('.form-errors-block'),
      };
    } if (type === 'signUp') {
      return {
        errorMessageContainer: node.querySelector('.form-errors-container'),
      };
    }

    return {};
  }

  getContentElements() {
    return this.elements;
  }
}
