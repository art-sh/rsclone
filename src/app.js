import './index.html';
import './assets/scss/main.scss';
import Config from './constant/config';
import Controller from './components/Controller';
import Mixin from './helpers/Mixin';
import Render from './components/Render/Render';
import Router from './components/Router';
import Storage from './components/Storage';
import MemoryGame from './components/Games/MemoryGame/MemoryGame';

class App {
  constructor() {
    this.config = Mixin.deepFreeze(Config);
    this.storage = new Storage(this);
    this.controller = new Controller(this);
    this.router = new Router(this);
    this.render = new Render(this);
  }

  init() {
    this.router.init(this.config, this.controller);
    this.controller.init(this.config, this.storage, this.router);
    this.storage.init(this.config);
    this.render.init(this.config);

    new MemoryGame(this);
    console.log(this);
  }
}

const app = new App();
app.init();
