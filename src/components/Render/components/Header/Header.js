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
      burgerButton: this.node.querySelector('.menu__burger-button'),
      burgerMenu: this.node.querySelector('#burger__menu'),
      burgerLinks: this.node.querySelectorAll('.menu__burger-list-item-link'),
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

  burgerMenuToggle() {
    if (document.body.classList.contains('menu-show')) {
      this.burgerMenuHide();
    } else {
      this.burgerMenuShow();
    }
  }

  burgerMenuResizeCheck() {
    if (document.body.classList.contains('menu-show') && window.innerWidth > 500) this.burgerMenuHide();
  }

  burgerMenuHide() {
    document.body.classList.remove('menu-show');
  }

  burgerMenuShow() {
    document.body.classList.add('menu-show');
  }

  setHeaderListeners() {
    this.elements.burgerButton.addEventListener('click', () => this.burgerMenuToggle());
    this.elements.burgerLinks.forEach((link) => {
      link.addEventListener('click', () => this.burgerMenuHide());
    });

    window.addEventListener('resize', () => this.burgerMenuResizeCheck());
    Mixin.listen(this.$app.config.events.routeChange, () => this.burgerMenuHide());
  }
}
