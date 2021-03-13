import Translations from './modules/index';

export default class Translator {
  constructor(app) {
    this.$app = app;

    this.translations = Translations;
  }

  translateText(container) {
    const nodes = container.querySelectorAll('[data-lang]');
    const {currentLanguage} = this.$app.storage.storage.userSettings;

    nodes.forEach((node) => {
      setTimeout(() => {
        const translationKey = node.dataset.lang;

        if (this.translations[translationKey] && node.textContent !== this.translations[translationKey]) {
          node.textContent = this.translations[translationKey][currentLanguage];
        }
      });
    });
  }
}
