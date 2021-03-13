import Mixin from '@helpers/Mixin';
import Render from './Render/Render';

export default class Controller {
  constructor(app) {
    this.$app = app;
    this.$router = null;
    this.$config = null;
    this.$storage = null;
    this.$render = new Render(this.$app);

    this.avaialableRoutes = [];
  }

  init(config, storage, router) {
    this.$router = router;
    this.$config = config;
    this.$storage = storage;
    this.$render.init(this.$config);

    const gamesCollection = Object.values(config.games).reduce((out, item) => {
      out.push(item.id);

      return out;
    }, []);

    this.avaialableRoutes = Mixin.deepFreeze([
      {controller: 'game', action: gamesCollection},
      {controller: 'welcome'},
      {controller: 'sign-in'},
      {controller: 'sign-up'},
      {controller: 'game-list'},
      {controller: 'statistic'},
      {controller: 'profile'},
    ]);
  }

  handleRoute(controller, action) {
    if (window.location.pathname !== '/') return this.$router.setPath('/');
    if (!window.location.hash) return this.$router.navigate('welcome');
    if (!this.isCurrentUserHaveAccess(controller, action) && !this.isUserAuthorized()) return this.$router.navigate('welcome');
    if (!this.isCurrentUserHaveAccess(controller, action) && this.isUserAuthorized()) return this.$router.navigate('game-list');

    document.title = Mixin.uppercaseFirstLetter(action || controller || 'Brain wars');
    this.$render.renderPage(controller, action);
  }

  isUserAuthorized() {
    return this.$storage.storage.userToken;
  }

  isCurrentUserHaveAccess(controller, action) {
    const isRouteExists = this.avaialableRoutes
      .some((item) => (item.controller === controller && (!action || item.action.includes(action))));

    if (!isRouteExists) return false;
    if (!this.isUserAuthorized() && ['welcome', 'sign-up', 'sign-in'].includes(controller)) return true;
    if (this.isUserAuthorized() && !['welcome', 'sign-up', 'sign-in'].includes(controller)) return true;
    if (this.isUserAuthorized() && ['welcome', 'sign-up', 'sign-in'].includes(controller)) return false;
    if (!this.isUserAuthorized() && !['welcome', 'sign-up', 'sign-in'].includes(controller)) return false;

    return false;
  }
}
