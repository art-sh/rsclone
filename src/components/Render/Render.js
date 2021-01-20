import Header from './components/Header/Header';
import Content from './components/Content/Content';
import Footer from './components/Footer/Footer';

export default class Render {
  constructor(app) {
    this.$app = app;
    this.$config = null;

    const appContainer = document.getElementById('app');

    this.elements = {
      app: appContainer,
      header: new Header(this.$app, appContainer),
      content: new Content(this.$app, appContainer),
      footer: new Footer(this.$app, appContainer),
    };
  }

  init(config) {
    this.$config = config;

    this.elements.header.init();
    this.elements.content.init();
    this.elements.footer.init();
  }

  renderPage(controller, action = null) {
    if (!controller) return;

    if (controller === 'game') {
      this.elements.content.setContent('game');
    } else if (controller === 'welcome') {
      this.elements.content.setContent('welcome');
    } else if (controller === 'game-list') {
      this.elements.content.setContent('gameList');
    } else if (controller === 'sign-in') {
      this.elements.content.setContent('signIn');
    } else if (controller === 'sign-up') {
      this.elements.content.setContent('signUp');
    } else if (controller === 'profile') {
      this.elements.content.setContent('profile');
    } else if (controller === 'statistic') {
      this.elements.content.setContent('statistic');
    }

    console.log(action);
  }
}
