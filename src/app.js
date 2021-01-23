import './index.html';
import './assets/scss/main.scss';
import Config from './constant/config';
import Controller from './components/Controller';
import Mixin from './helpers/Mixin';
import Router from './components/Router';
import SoundPlayer from './components/SoundPlayer';
import Storage from './components/Storage';

class App {
  constructor() {
    this.config = Mixin.deepFreeze(Config);
    this.storage = new Storage(this);
    this.controller = new Controller(this);
    this.router = new Router(this);
    this.soundPlayer = new SoundPlayer(this);
  }

  init() {
    this.router.init(this.config, this.controller);
    this.controller.init(this.config, this.storage, this.router);
    this.storage.init(this.config);
    this.soundPlayer.loadDefaultSounds();
  }
}

const app = new App();
app.init();
