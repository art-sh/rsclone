import './assets/scss/style.scss';
import Mixin from '@helpers/Mixin';

const template = require('./assets/template.html');

export default class Footer {
  constructor(app, appContainer) {
    this.$app = app;
    this.$appContainer = appContainer;

    this.node = this.getNode();
    this.elements = {
      footer: this.node.querySelector('.footer'),
    };

    this.setFooterListeners();
  }

  init() {
    this.$appContainer.append(this.node);
  }

  getNode() {
    const node = document.createElement('footer');
    node.append(Mixin.parseHTML(template));

    return node.firstChild;
  }

  changeFooterBackground() {
    console.log('change background');
    if (window.location.hash === '#/welcome' || window.location.hash === '#/sign-in' || window.location.hash === '#/sign-up') {
      // this.elements.footer.classList.add('footer_welcome');
      document.querySelector('.footer').classList.add('footer_welcome');
    } else {
      document.querySelector('.footer').classList.remove('footer_welcome');
    }
  }

  setFooterListeners() {
    window.addEventListener('hashchange', () => this.changeFooterBackground());
  }
}
