import Mixin from '../mixin';

export default class Router {
  constructor(app) {
    this.$app = app;
  }

  init() {
    this.setHashChangeListener();
  }

  setHashChangeListener() {
    window.addEventListener('hashchange', () => {
      this.handleCurrentRoute(window.location.hash.slice(2));

      document.dispatchEvent(new Event(this.$app.config.events.routeChange));
    });
  }

  handleCurrentRoute(route) {
    const [controller, action] = route.split('/');

    document.title = Mixin.uppercaseFirstLetter(action || controller || 'Brain wars');
  }

  navigate(newRoute) {
    window.location.hash = `#/${newRoute}`;
    window.dispatchEvent(new Event('hashchange'));
  }
}
