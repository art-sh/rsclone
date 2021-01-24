import './assets/scss/style.scss';
import Mixin from '@helpers/Mixin';

const template = require('./assets/template.html');

export default class Header {
  constructor(app, appContainer) {
    this.$app = app;
    this.$appContainer = appContainer;

    this.node = this.getNode();
    this.elements = {
      logo: this.node.querySelector('.logo'),
    };

    this.setHeaderListeners();
  }

  init() {
    this.$appContainer.append(this.node);
  }

  getNode() {
    const node = document.createElement('header');
    node.append(Mixin.parseHTML(template));

    return node.firstChild;
  }

  setHeaderListeners() {
    this.elements.logo.addEventListener('click', () => console.log('logo clicked'));
  }
}
