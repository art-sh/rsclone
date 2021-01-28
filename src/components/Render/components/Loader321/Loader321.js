import './assets/scss/style.scss';
import Mixin from '@helpers/Mixin';

const template = require('./assets/template.html');

export default class Loader321 {
  constructor(app) {
    this.$app = app;

    this.elements = {
      body: this.node.querySelector('body'),
    };

    this.setLoaderListeners();
  }

  showLoader() {
    setTimeout(() => {
      const loader = document.getElementById('loader321');
      if (!loader.classList.contains('load__done')) loader.classList.add('load__done');
    }, 3000);
  }

  setLoaderListeners() {
    this.elements.body.addEventListener('onload', () => this.showLoader());
  }
}
