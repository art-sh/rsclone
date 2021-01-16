import Mixin from '@helpers/Mixin';

export default class Router {
  constructor(app) {
    this.$app = app;
    this.$config = null;
    this.$controller = null;
  }

  init(config, controller) {
    this.$config = config;
    this.$controller = controller;

    this.setHashChangeListener();

    setTimeout(() => window.dispatchEvent(new Event(this.$config.events.hashChange)));
  }

  setHashChangeListener() {
    window.addEventListener(this.$app.config.events.hashChange, () => {
      this.handleCurrentRoute(window.location.hash.slice(2));
    });
  }

  handleCurrentRoute(route) {
    const [controller, action] = route.split('/');

    document.title = Mixin.uppercaseFirstLetter(action || controller || 'Brain wars');

    this.$controller.handleRoute(controller, action);

    Mixin.dispatch(this.$app.config.events.routeChange, {
      route: {
        controller,
        action,
      },
    });
  }

  navigate(newRoute) {
    window.location.hash = `#/${newRoute}`;
  }
}
