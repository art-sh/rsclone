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
      const newElements = this.getNodeElements(newContentElement, contentType);
      this.setProfileContent(newElements, contentType);
      const handler = () => {
        this.elementContent.ontransitionend = null;
        this.elementContent.replaceWith(newContentElement);
        this.elementContent = newContentElement;

        window.requestAnimationFrame(() => {
          window.requestAnimationFrame(() => this.elementContent.removeAttribute('style'));

          this.elements = newElements;
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

  setProfileContent(elements, contentType) {
    if (contentType === 'profile') {
      const userInfoObject = this.$app.storage.storage.userInfo;
      const date = new Date(userInfoObject.date_create * 1000);

      elements.profileName.textContent = userInfoObject.name;
      elements.registrationDate.textContent = `${Mixin.addZero(date.getDate())}.${Mixin.addZero(date.getMonth() + 1)}.${date.getFullYear()}`;
    }
  }

  setStatisticContent(elements, type) {
    if (type === 'statistic') {
      HttpClient.send(`${this.$app.config.baseURL}/score/get-all`, {
        fetch: {
          method: 'GET',
        },
        storage: this.$app.storage.storage,
        success: async (response) => this.statisticRequestHandler(response, elements),
      });
    }
  }

  async statisticRequestHandler(response, elements) {
    const result = await response.result;
    const gamesDataTable = elements.statisticTable.rows;

    Object.keys(result.response).forEach((game) => {
      const overallScore = gamesDataTable[`${game}`].children[2];
      const bestScore = gamesDataTable[`${game}`].children[3];
      overallScore.textContent = result.response[`${game}`].overall;
      bestScore.textContent = result.response[`${game}`].best;
    });

    elements.statisticTable.classList.add('statistics-loaded');
  }

  changeThemeState(theme) {
    this.$app.storage.storage.userSettings.theme = (theme === 'dark') ? 'theme-dark' : 'theme-light';
  }

  changeSoundState(sound) {
    this.$app.storage.storage.userSettings.sound = (sound === 'on');
  }

  logOutHandler() {
    this.$app.storage.resetUserStorage();
    this.$app.router.navigate('welcome');
  }

  async successResponseHandler(response, type, currentForm) {
    const result = await response.result;
    const appToken = response.response.headers.get('app-token');

    if (type === 'login') {
      if (appToken && response.response.ok) {
        this.$app.storage.storage.userToken = appToken;
        Object.assign(this.$app.storage.storage.userInfo, result.response);

        this.$app.router.navigate('game-list');
      } else {
        this.elements.errorMessageContainer.textContent = result.response.message;
      }
    } else if (type === 'register') {
      if (appToken && response.response.ok) {
        this.$app.storage.storage.userToken = appToken;
        Object.assign(this.$app.storage.storage.userInfo, result.response);

        this.$app.router.navigate('game-list');
      } else {
        this.elements.errorMessageContainer.textContent = result.response.message;
      }
    } else if (type === 'profile' && currentForm.id === 'changePassword') {
      if (response.response.ok) {
        this.elements.errorMessageContainer.textContent = 'Password is changed';
      }
    } else if (type === 'profile' && currentForm.id === 'changeNickname') {
      if (response.response.ok) {
        this.$app.storage.storage.userInfo.name = result.response.name || null;

        window.location.reload();
      }
    }
  }

  registerRequestHandler(type, data, currentForm) {
    if (currentForm.elements.password.value === currentForm.elements.passwordCheck.value) {
      HttpClient.send(`${this.$app.config.baseURL}/auth/${type}`, {
        fetch: {
          method: 'POST',
          body: data.join('&'),
        },
        storage: this.$app.storage.storage,
        success: async (response) => this.successResponseHandler(response, type),
      });
    } else {
      this.elements.errorMessageContainer.textContent = 'Password does not match';
    }
  }

  loginRequestHandler(type, data) {
    HttpClient.send(`${this.$app.config.baseURL}/auth/${type}`, {
      fetch: {
        method: 'POST',
        body: data.join('&'),
      },
      storage: this.$app.storage.storage,
      success: async (response) => this.successResponseHandler(response, type),
    });
  }

  changePasswordRequest(type, data, currentForm) {
    if (currentForm.elements.password.value === currentForm.elements.passwordCheck.value) {
      HttpClient.send(`${this.$app.config.baseURL}/user/change-password`, {
        fetch: {
          method: 'PUT',
          body: data.join('&'),
        },
        storage: this.$app.storage.storage,
        success: async (response) => this.successResponseHandler(response, type, currentForm),
      });
    } else {
      this.elements.errorMessageContainer.textContent = 'Password does not match';
    }
  }

  changeNicknameRequest(type, data, currentForm) {
    HttpClient.send(`${this.$app.config.baseURL}/user/change-name`, {
      fetch: {
        method: 'PUT',
        body: data,
      },
      storage: this.$app.storage.storage,
      success: async (response) => this.successResponseHandler(response, type, currentForm),
    });
  }

  backendRequestHandler(type) {
    const currentForm = document.forms[0];

    currentForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const formDataObject = new FormData(currentForm);
      const formData = Array.from(formDataObject.entries())
        .reduce((out, item) => {
          out.push(`${encodeURIComponent(item[0])}=${encodeURIComponent(item[1])}`);
          return out;
        }, []);

      if (type === 'register') {
        this.registerRequestHandler(type, formData, currentForm);
      } else if (type === 'login') {
        this.loginRequestHandler(type, formData);
      } else if (type === 'profile') {
        this.changePasswordRequest(type, formData, currentForm);
      }
    });

    if (type === 'profile') {
      const secondForm = document.forms.changeNickname;

      secondForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = [`name=${encodeURIComponent(secondForm.elements.nickname.value)}`];
        this.changeNicknameRequest(type, formData, secondForm);
      });
    }
  }

  setContentListeners(elements, type) {
    if (type === 'game') {
      elements.game.finishBtn.addEventListener('click', () => document.body.classList.add('game-button-finish-clicked'));
    } else if (type === 'profile') {
      elements.toggleThemeDark.addEventListener('click', this.changeThemeState.bind(this, 'dark'));
      elements.toggleThemeLight.addEventListener('click', this.changeThemeState.bind(this, 'light'));
      elements.logoutButton.addEventListener('click', this.logOutHandler.bind(this));
      elements.soundOn.addEventListener('click', this.changeSoundState.bind(this, 'on'));
      elements.soundOff.addEventListener('click', this.changeSoundState.bind(this, 'off'));
      this.backendRequestHandler('profile');
    } else if (type === 'signIn') {
      this.backendRequestHandler('login');
    } else if (type === 'signUp') {
      this.backendRequestHandler('register');
    } else if (type === 'statistic') {
      this.setStatisticContent(elements, type);
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
    }

    if (type === 'gameList') {
      return {
        gameContainer: node.querySelector('.games'),
        gamesList: node.querySelector('.games__list'),
      };
    }

    if (type === 'profile') {
      return {
        toggleThemeDark: node.querySelector('.theme-status_dark'),
        toggleThemeLight: node.querySelector('.theme-status_light'),
        profileName: node.querySelector('.profile__nickname'),
        registrationDate: node.querySelector('.profile__date'),
        errorMessageContainer: node.querySelector('.form-errors-block'),
        logoutButton: node.querySelector('.button-exit'),
        soundOn: node.querySelector('.sound-on'),
        soundOff: node.querySelector('.sound-off'),
      };
    }
    if (type === 'signIn') {
      return {
        errorMessageContainer: node.querySelector('.form-errors-block'),
      };
    }
    if (type === 'signUp') {
      return {
        errorMessageContainer: node.querySelector('.form-errors-container'),
      };
    }
    if (type === 'statistic') {
      return {
        statisticTable: node.querySelector('.statistic__table'),
        statisticTableRows: node.querySelectorAll('.statistic__table [name]'),
      };
    }
    return {};
  }

  getContentElements() {
    return this.elements;
  }
}
