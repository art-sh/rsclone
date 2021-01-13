import './assets/scss/style.scss';
import Mixin from '@helpers/Mixin';

const template = require('./assets/template.html');

export default class Header {
  constructor(app) {
    this.$app = app;

    this.node = Mixin.parseHTML(template);

    this.elements = {
      logo: this.node.querySelector('.logo'),
    };
  }

  init() {
    this.setHeaderListeners();

    return this;
  }

  getNode() {
    return this.node;
  }

  setHeaderListeners() {
    this.elements.logo.addEventListener('click', () => console.log('logo clicked'));
  }
}
