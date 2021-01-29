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
      burgerLinks: this.node.querySelectorAll('.menu__list .menu__link'),
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

  toggleBurgerMenu() {
    this.elements.burger.classList.toggle('active');
    this.elements.burgerMenu.classList.toggle('active');
    if (this.elements.burgerMenu.classList.contains('active')) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }

  hideBurgerMenu() {
    if (this.elements.burgerMenu.classList.contains('active')) {
      this.elements.burger.classList.remove('active');
      this.elements.burgerMenu.classList.remove('active');
      document.body.style.overflow = 'auto';
    }
  }

  keyboardHandler(event) {
    if (event.keyCode === 27 || event.which === 27) {
      console.log('logo');
    }
    if (event.keyCode === 90 || event.which === 90) {
      console.log('Game list Z');
    }
    if (event.keyCode === 88 || event.which === 88) {
      console.log('Statistic X');
    }
    if (event.keyCode === 67 || event.which === 67) {
      console.log('Profile C');
    }
    if (event.keyCode === 121 || event.which === 121) {
      console.log('Menu (F10)');
    }
  }

  setHeaderListeners() {
    this.elements.logo.addEventListener('click', () => this.hideBurgerMenu());
    this.elements.burger.addEventListener('click', () => this.toggleBurgerMenu());
    this.elements.burgerLinks.forEach((link) => link.addEventListener('click', () => this.hideBurgerMenu()));
    window.addEventListener('resize', () => this.hideBurgerMenu());
    window.addEventListener('keydown', this.keyboardHandler);
  }
}
