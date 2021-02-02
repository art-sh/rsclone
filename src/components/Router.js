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

    this.setRouterListeners();
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

    this.$controller.handleRoute(controller, action);

    this.dispatchRoute(controller, action);
  }

  navigate(newRoute) {
    window.location.hash = `#/${newRoute}`;
  }

  setPath(path) {
    window.location.pathname = path;
  }

  dispatchRoute(controller, action) {
    Mixin.dispatch(this.$app.config.events.routeChange, {
      route: {
        controller,
        action,
      },
    });
  }

  setRouterListeners() {
    Mixin.listen(this.$app.config.events.routeChange, this.setCurrentPageClasses.bind());
  }

  setCurrentPageClasses(e) {
    const {body} = document;
    const bodyClasses = Array.from(body.classList);

    bodyClasses.forEach((className) => {
      if (!className.includes('page-')) return;

      body.classList.remove(className);
    });

    body.classList.add(`page-${e.detail.route.controller}`);
  }
}
