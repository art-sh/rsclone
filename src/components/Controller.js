import Render from './Render/Render';

export default class Controller {
  constructor(app) {
    this.$app = app;
    this.$router = null;
    this.$config = null;
    this.$storage = null;
    this.$render = new Render(this.$app);
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
    if (!this.isCurrentUserHaveAccess(controller, action) && !this.isUserAuthorized()) return this.$router.navigate('welcome');
    if (!this.isCurrentUserHaveAccess(controller, action) && this.isUserAuthorized()) return this.$router.navigate('game-list');
    this.$render.renderPage(controller, action);
  }

  isUserAuthorized() {
    return this.$storage.storage.userToken;
  }

  isCurrentUserHaveAccess(controller) {
    if (!this.isUserAuthorized() && ['welcome', 'sign-up', 'sign-in'].includes(controller)) return true;
    if (this.isUserAuthorized() && !['welcome', 'sign-up', 'sign-in'].includes(controller)) return true;
    if (this.isUserAuthorized() && ['welcome', 'sign-up', 'sign-in'].includes(controller)) return false;
    if (!this.isUserAuthorized() && !['welcome', 'sign-up', 'sign-in'].includes(controller)) return false;

    return false;
  }
}
