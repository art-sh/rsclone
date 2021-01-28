import './assets/scss/style.scss';
import Mixin from '@helpers/Mixin';

const template = require('./assets/template.html');

export default class Loader321 {
  constructor(app) {
    this.$app = app;
    this.template = template;

    this.elements = {
      body: this.node.querySelector('body'),
    };

    Mixin.listen(this.$app.config.events.routeChange, this.destroyLoader.bind(this));
  }

  getLoaderContainer() {
    const node = Mixin.getNode(this.template);
    this.setLoaderListeners();
    return node;
  }

  showLoader() {
    setTimeout(() => {
      this.getLoaderContainer();
      const loader = document.getElementById('loader321');
      if (!loader.classList.contains('load__done')) loader.classList.add('load__done');
    }, 3000);
  }

  destroyLoader() {
    if (this.elements.node) this.elements.node.remove();
    this.elements = {};
  }

  setLoaderListeners() {
    this.elements.body.addEventListener('onload', () => this.showLoader());
  }
}
