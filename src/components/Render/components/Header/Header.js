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
      burger: this.node.querySelector('#burger'),
      burgerMenu: this.node.querySelector('#burger__menu'),
      burgerLinks: this.node.querySelectorAll('#burger__menu .menu__link'),
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

  burgerMethod() {
    this.elements.burger.classList.toggle('active');
    this.elements.burgerMenu.classList.toggle('active');
    if (this.elements.burgerMenu.classList.contains('active')) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }

  setHeaderListeners() {
    this.elements.logo.addEventListener('click', () => this.burgerMethod());
    this.elements.burger.addEventListener('click', () => this.burgerMethod());
    this.elements.burgerLinks.forEach((link) => link.addEventListener('click', () => this.burgerMethod()));
  }
}
