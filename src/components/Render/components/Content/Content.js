import Mixin from '@helpers/Mixin';

const templateGame = require('./assets/templates/game.html');
const templateWelcome = require('./assets/templates/welcome.html');

export default class Content {
  constructor(app, appContainer) {
    this.$app = app;
    this.$appContainer = appContainer;

    this.node = null;
    this.templates = {
      game: templateGame,
      welcome: templateWelcome,
    };
  }

  getNode(template) {
    const node = document.createElement('div');
    node.append(Mixin.parseHTML(template));

    return node.firstChild;
  }

  setContent(contentType) {
    const newNode = this.getNode(this.templates[contentType]) || '';

    if (this.node) {
      this.node.replaceWith(newNode);
    } else {
      this.$appContainer.append(newNode);
    }

    this.node = newNode;
    console.log(this.node);
    this.setContentListeners(contentType);
  }

  setContentListeners() {
    //
  }
}
