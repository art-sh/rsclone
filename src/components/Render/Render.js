import Mixin from '@helpers/Mixin';
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

    this.elements.app.append(this.elements.header.getNode());

    this.setContentListeners();
  }

  setContentListeners() {
    Mixin.listen(this.$config.events.routeChange, (e) => {
      const eventData = e.detail;
      if (!eventData) return;

      if (eventData.route.controller === 'game') {
        this.elements.content.setContent('game');
      } else if (eventData.route.controller === 'welcome') {
        this.elements.content.setContent('welcome');
      }
    });
  }
}
