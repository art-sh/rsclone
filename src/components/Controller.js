export default class Controller {
  constructor(app) {
    this.$app = app;
    this.$router = null;
    this.$config = null;
    this.$storage = null;
  }

  init(config, storage, router) {
    this.$router = router;
    this.$config = config;
    this.$storage = storage;
  }

  handleRoute(controller, action) {
    if (!this.isCurrentUserHaveAccess(controller, action)) return this.$router.navigate('welcome');
  }

  isCurrentUserHaveAccess(controller, action) {
    if (controller === 'welcome' && !action) return true;

    return false;
  }
}
