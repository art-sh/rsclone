import Header from './components/Header/Header';

export default class Render {
  constructor(app) {
    this.$app = app;
    this.$config = null;

    this.elements = {
      app: document.getElementById('app'),
      header: new Header().init(),
      content: null,
      footer: null,
    };
  }

  init(config) {
    this.$config = config;

    this.elements.app.appendChild(this.elements.header.getNode());
  }
}
