import Mixin from '@helpers/Mixin';
import HttpClient from '@helpers/HttpClient';

export default class Storage {
  constructor(app) {
    this.$app = app;
    this.$config = null;

    this.storage = this.getSaveStorageProxy({
      userToken: null,
      userInfo: this.getSaveStorageProxy({
        name: null,
        date_create: null,
        login: null,
        id: null,
      }),
      userSettings: this.getSaveStorageProxy({
        theme: 'theme-dark',
        sound: true,
        currentLanguage: 'en',
      }),
    });
    this.triggerInterval = null;
  }

  init(config) {
    this.$config = config;

    this.setStorageListeners();
    this.loadStorage();

    this.refreshUserInfo();
  }

  resetUserStorage() {
    this.storage.userToken = null;
    Mixin.deepClearObject(this.storage.userInfo);
  }

  setStorageListeners() {
    Mixin.listen(this.$config.events.gameEnd, (e) => {
      const stringifyData = Object.entries(e.detail)
        .reduce((out, item) => {
          if (item[0] === 'game') {
            item[0] += '_id';
          }
          out.push(`${encodeURIComponent(item[0])}=${encodeURIComponent(item[1])}`);
          return out;
        }, []);

      HttpClient.send(`${this.$app.config.baseURL}/score/submit-result`, {
        fetch: {
          method: 'POST',
          headers: {
            'App-Token': this.storage.userToken,
          },
          body: stringifyData.join('&'),
        },
      });
    });

    Mixin.listen(this.$config.events.storageUpdated, (e) => {
      if (e.detail.userSettings.theme === 'theme-light') {
        document.body.classList.add('theme-light');
        document.body.classList.remove('theme-dark');
      } else {
        document.body.classList.add('theme-dark');
        document.body.classList.remove('theme-light');
      }

      if (e.detail.userSettings.sound) {
        document.body.classList.add('sound-active');
        document.body.classList.remove('sound-deactive');
      } else {
        document.body.classList.add('sound-deactive');
        document.body.classList.remove('sound-active');
      }

      if (e.detail.userSettings.currentLanguage === 'en') {
        document.body.classList.add('language-english');
        document.body.classList.remove('language-russian');
      } else {
        document.body.classList.add('language-russian');
        document.body.classList.remove('language-english');
      }
    });
  }

  getSaveStorageProxy(obj) {
    const self = this;

    return new Proxy(obj, {
      set(target, property, value) {
        target[property] = value;
        self.saveStorage();
        const trigger = () => {
          self.triggerInterval = setTimeout(() => {
            Mixin.dispatch(self.$config.events.storageUpdated, self.storage);
          });
        };

        if (self.triggerInterval) {
          clearTimeout(self.triggerInterval);
          trigger();
        } else {
          trigger();
        }

        if (property === 'currentLanguage') Mixin.dispatch(self.$config.events.languageChanged, self.storage);

        return true;
      },
    });
  }

  saveStorage() {
    localStorage.setItem(this.$config.storageKeys.app, Mixin.jsonEncode(this.storage));
  }

  loadStorage() {
    const appInfo = Mixin.jsonDecode(localStorage.getItem(this.$config.storageKeys.app)) || {};

    this.storage.userToken = appInfo.userToken || null;
    Object.assign(this.storage.userInfo, appInfo.userInfo || {});
    Object.assign(this.storage.userSettings, appInfo.userSettings || {});
  }

  refreshUserInfo() {
    if (!this.storage.userToken) return;

    HttpClient.send(`${this.$app.config.baseURL}/auth/refresh-user-info`, {
      fetch: {
        method: 'GET',
      },
      storage: this.storage,
      success: async (data) => {
        const response = await data.response;
        const result = await data.result;

        const newToken = response.headers.get('app-token');
        const newUserInfo = result.response;

        this.storage.userToken = newToken;
        Object.assign(this.storage.userInfo, newUserInfo);
      },
    });
  }
}
