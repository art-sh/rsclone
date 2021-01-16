import Header from './components/Header/Header';
import Content from './components/Content/Content';

export default class Render {
  constructor(app) {
    this.$app = app;
    this.$config = null;

    const appContainer = document.getElementById('app');

    this.elements = {
      app: appContainer,
      header: new Header(this.$app, appContainer),
      content: new Content(this.$app, appContainer),
      footer: null,
    };
  }

  init(config) {
    this.$config = config;

    this.elements.header.init();
    this.elements.content.init();
  }

  renderPage(controller, action = null) {
    if (!controller) return;

    if (controller === 'game') {
      this.elements.content.setContent('game');
    } else if (controller === 'welcome') {
      this.elements.content.setContent('welcome');
    }

    console.log(action);
  }
}
