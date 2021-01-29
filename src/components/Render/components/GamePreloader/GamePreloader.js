import './assets/scss/style.scss';
import Mixin from '@helpers/Mixin';

const template = require('./assets/template.html');

export default class GamePreloader {
  constructor(app) {
    this.$app = app;
    this.template = template;

    this.elements = {
      container: this.getLoaderContainer(),
    };

    this.setLoaderListeners();
  }

  getLoaderContainer() {
    return Mixin.getNode(this.template);
  }

  showLoader(container, callback) {
    container.append(this.elements.container);
    this.elements.container.ontransitionend = () => {
      this.destroyLoader();
      if (callback) callback();
    };
    setTimeout(() => {
      this.elements.container.classList.add('game-loader--hide');
    }, 3500);
  }

  destroyLoader() {
    if (this.elements.node) this.elements.node.remove();
    this.elements = {};
  }

  setLoaderListeners() {
    Mixin.listen(this.$app.config.events.routeChange, this.destroyLoader.bind(this), true);
  }
}
