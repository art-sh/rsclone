export default class Storage {
  constructor(app) {
    this.$app = app;
    this.$config = null;
    this.storage = {
      userToken: null,
      userInfo: {
        name: null,
        date_create: null,
        login: null,
        id: null,
      },
    };
  }

  init(config) {
    this.$config = config;

    this.loadData();
  }

  loadData() {
    localStorage.getItem(this.$config.storageKeys.authorisation);
  }
}
