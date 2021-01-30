import './assets/scss/style.scss';
import Mixin from '@helpers/Mixin';

const template = require('./assets/template.html');

export default class Footer {
  constructor(app, appContainer) {
    this.$app = app;
    this.$appContainer = appContainer;

    this.node = this.getNode();
    this.shiftBtn = false;

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

  keyboardHandler(event) {
    if (event.keyCode === 16 || event.which === 16) {
      this.shiftBtn = true;
    }
    if ((event.keyCode === 65 && this.shiftBtn) || (event.which === 65 && this.shiftBtn)) {
      this.shiftBtn = false;
      // this.$app.router.navigate('game-list');
      console.log('about app');
    }
    if ((event.keyCode === 82 && this.shiftBtn) || (event.which === 82 && this.shiftBtn)) {
      this.shiftBtn = false;
      // this.$app.router.navigate('statistic');
      console.log('web site');
    }
  }

  setFooterListeners() {
    window.addEventListener('keydown', (event) => this.keyboardHandler(event));
  }
}
