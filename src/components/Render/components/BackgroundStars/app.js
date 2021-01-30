import Mixin from '@helpers/Mixin';
import './assets/scss/style.scss';

const template = require('./assets/template.html');

export default class BackgroundStars {
  constructor(app, appContainer) {
    this.$app = app;
    this.$appContainer = appContainer;

    this.node = this.getNode();
  }

  init() {
    this.$appContainer.append(this.node);
  }

  getNode() {
    return Mixin.getNode(template);
  }
}
