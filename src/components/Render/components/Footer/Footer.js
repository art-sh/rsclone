import './assets/scss/style.scss';
import Mixin from '@helpers/Mixin';
import ModalWindow from '../ModalWindow/app';

const template = require('./assets/template.html');

export default class Footer {
  constructor(app, appContainer) {
    this.$app = app;
    this.$appContainer = appContainer;
    this.config = app.config;

    this.node = this.getNode();
    this.elements = {};

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

  showHotKeys() {
    const modal = new ModalWindow(this.$app);
    modal.showModal({
      type: this.config.modalWindow.types.hotKeys,
      container: this.$appContainer,
      text: {
        title: this.config.hotKeysInfo.title,
        info: this.config.hotKeysInfo.info,
      },
    });
  }

  keyboardHandler(event) {
    event.preventDefault();

    if ((event.keyCode === 72 && event.altKey) || (event.which === 72 && event.altKey)) {
      this.showHotKeys();
    }
    if ((event.keyCode === 82 && event.altKey) || (event.which === 82 && event.altKey)) {
      window.open('https://rs.school/', '_blank');
    }
  }

  setFooterListeners() {
    window.addEventListener('keydown', (event) => this.keyboardHandler(event));
    setTimeout(() => {
      const hotKeys = document.querySelector('#hot-keys');
      hotKeys.addEventListener('click', (event) => {
        event.preventDefault();
        this.showHotKeys();
      });
    }, 0);
  }
}
