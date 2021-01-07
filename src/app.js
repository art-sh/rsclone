import './index.html';
import './assets/scss/main.scss';
import Config from './assets/js/config';
import Mixin from './assets/js/mixin';
import Router from './assets/js/components/Router';

class App {
  constructor() {
    this.config = Mixin.deepFreeze(Config);
    this.router = new Router(this);

    console.log(this);
  }

  init() {
    this.router.init();
  }
}

const app = new App();
app.init();
