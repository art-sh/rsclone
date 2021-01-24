import Render from './Render/Render';

export default class Controller {
  constructor(app) {
    this.$app = app;
    this.$router = null;
    this.$config = null;
    this.$storage = null;
    this.$render = new Render(this.$app);

    this.isAuth = true;
  }

  init(config, storage, router) {
    this.$router = router;
    this.$config = config;
    this.$storage = storage;
    this.$render.init(this.$config);
  }

  handleRoute(controller, action) {
    if (window.location.pathname !== '/') return this.$router.setPath('/');
    if (!window.location.hash) return this.$router.navigate('welcome');
    if (!this.isCurrentUserHaveAccess(controller, action)) return this.$router.navigate('welcome');

    this.$render.renderPage(controller, action);
  }

  isCurrentUserHaveAccess(controller, action) {
    if (this.isAuth) return true;
    if (controller === 'welcome' && !action) return true;

    return false;
  }
}
