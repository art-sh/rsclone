export default class Storage {
  constructor(app) {
    this.$app = app;
    this.$config = null;
  }

  init(config) {
    this.$config = config;

    this.loadData();
  }

  loadData() {
    localStorage.getItem(this.$config.storageKeys.authorisation);
  }
}
