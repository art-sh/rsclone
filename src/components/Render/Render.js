import MemoryGame from '@games/MemoryGame/app';
import MemoryMatrix from '@games/MemoryMatrix/app';
import CharsAndNumbers from '@games/CharsAndNumbers/app';
import WhackAMole from '@games/WhackAMoleGame/app';
import CountSheep from '@games/CountSheep/app';

import Mixin from '@helpers/Mixin';
import Header from './components/Header/Header';
import Content from './components/Content/Content';
import Footer from './components/Footer/Footer';
import GameListPage from './components/GameList/app';
import BackgroundStars from './components/BackgroundStars/app';
import GamePreloader from './components/GamePreloader/GamePreloader';

import Translator from '../Translator/app';

export default class Render {
  constructor(app) {
    this.$app = app;
    this.$config = null;
    this.$translator = new Translator(app);

    const appContainer = document.getElementById('app');

    this.elements = {
      app: appContainer,
      header: new Header(this.$app, appContainer),
      content: new Content(this.$app, appContainer, this.$translator),
      footer: new Footer(this.$app, appContainer),
      backgroundStars: new BackgroundStars(this.$app, appContainer),
    };
    this.gameInstance = null;
    this.games = {};
  }

  init(config) {
    this.$config = config;

    this.games[this.$config.games.memoryGame.id] = MemoryGame;
    this.games[this.$config.games.memoryMatrix.id] = MemoryMatrix;
    this.games[this.$config.games.charsAndNumbersGame.id] = CharsAndNumbers;
    this.games[this.$config.games.whackAMole.id] = WhackAMole;
    this.games[this.$config.games.countSheep.id] = CountSheep;

    this.elements.header.init();
    this.elements.content.init();
    this.elements.footer.init();
    this.elements.backgroundStars.init();

    this.setListeners();
  }

  renderPage(controller, action = null) {
    if (!controller) return;

    if (controller === 'game') {
      const cb = (content) => {
        this.loadGame(action, content.getContentElements());
      };

      this.elements.content.setContent('game', cb);
    } else if (controller === 'welcome') {
      this.elements.content.setContent('welcome');
    } else if (controller === 'game-list') {
      const cb = (content) => {
        const list = new GameListPage(this.$app);
        list.setGameListContent(content);
      };
      this.elements.content.setContent('gameList', cb);
    } else if (controller === 'sign-in') {
      this.elements.content.setContent('signIn');
    } else if (controller === 'sign-up') {
      this.elements.content.setContent('signUp');
    } else if (controller === 'profile') {
      this.elements.content.setContent('profile');
    } else if (controller === 'statistic') {
      this.elements.content.setContent('statistic');
    }
  }

  loadGame(id, contentElements) {
    if (!this.games[id]) return this.$app.router.navigate('game-list');

    const preloader = new GamePreloader(this.$app);
    const gameInstance = new this.games[id](this.$app, contentElements);
    this.gameInstance = gameInstance.getGameInstance(this.$app, contentElements);

    preloader.showLoader(contentElements.node, () => {
      if (this.gameInstance) this.gameInstance.startGame();
    });
  }

  setListeners() {
    Mixin.listen(this.$config.events.routeChange, () => {
      if (this.gameInstance) {
        this.gameInstance.destroyGameInstance();
        this.gameInstance = null;
      }

      document.body.classList.remove('game-button-finish-clicked');

      this.$translator.translateText(this.elements.app);
    });

    Mixin.listen(this.$config.events.languageChanged, () => {
      this.$translator.translateText(this.elements.app);
    });

    Mixin.listen(this.$config.events.modalShow, (e) => {
      this.$translator.translateText(e.detail.elements.node);
    });
  }
}
