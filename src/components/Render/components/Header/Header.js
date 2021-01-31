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

  keyboardHandler(event) {
    if ((event.keyCode === 71 && event.shiftKey) || (event.which === 71 && event.shiftKey)) {
      this.$app.router.navigate('game-list');
    }
    if ((event.keyCode === 83 && event.shiftKey) || (event.which === 83 && event.shiftKey)) {
      this.$app.router.navigate('statistic');
    }
    if ((event.keyCode === 80 && event.shiftKey) || (event.which === 80 && event.shiftKey)) {
      this.$app.router.navigate('profile');
    }
  }

  setHeaderListeners() {
    this.elements.burgerButton.addEventListener('click', () => this.burgerMenuToggle());

    window.addEventListener('keydown', (event) => this.keyboardHandler(event));
    window.addEventListener('resize', () => this.burgerMenuResizeCheck());
    Mixin.listen(this.$app.config.events.routeChange, () => this.burgerMenuHide());
  }
}
