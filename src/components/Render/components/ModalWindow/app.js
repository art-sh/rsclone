import Mixin from '@helpers/Mixin';

const templateGameDescription = require('./assets/templates/game-description.html');
const templateGameEnd = require('./assets/templates/game-end.html');
const templateHotKeys = require('./assets/templates/hot-keys.html');

export default class ModalWindow {
  /**
   * @param {object} app
   */
  constructor(app) {
    this.$app = app;
    this.$modalConfig = app.config.modalWindow;
    this.types = this.$modalConfig.types;

    this.templates = {
      [this.types.gameDescription]: templateGameDescription,
      [this.types.gameEnd]: templateGameEnd,
      [this.types.hotKeys]: templateHotKeys,
    };
    this.elements = {};

    Mixin.listen(this.$app.config.events.routeChange, this.destroyModal.bind(this), true);
  }

  /**
   * @param {object} params
   */
  getModalContainer(params) {
    const {type} = params;
    const node = Mixin.getNode(this.templates[type]);
    this.elements = this.getModalElements(type, node);

    this.fillElementsByParams(params.text, this.elements);
    this.setModalListeners(type, params.callback, this.elements);

    if (type === this.types.gameDescription) {
      const gameConfig = this.getGameConfigByName(params.text.title);

      this.setTranslationKeys(gameConfig, this.elements);
    }

    return node;
  }

  /**
   * @param {string} type
   * @param {object} params
   * @param {object} elements
   */
  setModalListeners(type, params, elements) {
    Object.entries(elements.buttons).forEach(([elementKey, element]) => {
      if (!element) return;
      if (type === this.types.gameEnd && elementKey === 'background') return;

      element.addEventListener('click', () => {
        this.hide();
        elements.node.ontransitionend = () => {
          this.destroyModal();

          if (type === this.types.gameEnd && ['close', 'quit'].includes(elementKey)) this.$app.router.navigate('game-list');
        };
      });
    });

    if (!params) return;

    Object.entries(params).forEach(([key, callback]) => {
      if (elements.buttons[key]) elements.buttons[key].addEventListener('click', callback);
    });
  }

  /**
   * @param {object} config
   * @param {object} elements
   */
  fillElementsByParams(config, elements) {
    if (!config) return;

    Object.entries(config).forEach(([key, value]) => {
      if (elements.text[key]) elements.text[key].innerText = value;
    });
  }

  setTranslationKeys(config, elements) {
    elements.text.gameDescription.dataset.lang = `game__${config.id}-description`;
    elements.text.rule.dataset.lang = `game__${config.id}-rule`;
  }

  getGameConfigByName(name) {
    return Object.values(this.$app.config.games).find((value) => value.name === name);
  }

  /**
   * @param {string} type
   * @param {HTMLElement} node
   */
  getModalElements(type, node) {
    if (type === this.types.gameDescription) {
      return {
        node,
        text: {
          title: node.querySelector('.text-title'),
          gameDescription: node.querySelector('.text-description'),
          rule: node.querySelector('.text-rule'),
        },
        buttons: {
          close: node.querySelector('.button-close'),
          play: node.querySelector('.button-play'),
          background: node.querySelector('.modal__background'),
        },
      };
    }

    if (type === this.types.gameEnd) {
      return {
        node,
        text: {
          title: node.querySelector('.text-title'),
          score: node.querySelector('.text-score'),
          achievement: node.querySelector('.text-achievements'),
        },
        buttons: {
          close: node.querySelector('.button-close'),
          background: node.querySelector('.modal__background'),
          restart: node.querySelector('.button-restart'),
          quit: node.querySelector('.button-quit'),
        },
      };
    }

    if (type === this.types.hotKeys) {
      return {
        node,
        text: {
          title: node.querySelector('.text-title'),
          info: node.querySelector('.text-description'),
        },
        buttons: {
          close: node.querySelector('.button-close'),
          background: node.querySelector('.modal__background'),
        },
      };
    }
  }

  /**
   * @param {object} params
   * @param {string} params.type Modal types
   * @param {Element} params.container
   * @param {{
   *   title: string,
   *   [gameDescription]: string,
   *   [rule]: string,
   *   [score]: string,
   *   [time]: string,
   *   [achievement]: string,
   * }} params.text Values of text fields
   * @param {{
   *   [close]: function,
   *   [play]: function
   * }} [params.callback] Callback functions
   * @return void
   */
  showModal(params) {
    const node = this.getModalContainer(params);

    params.container.append(node);

    window.requestAnimationFrame(() => this.show());
  }

  /**
   * @return void
   */
  show() {
    document.body.classList.add('modal-show');
    Mixin.dispatch(this.$app.config.events.modalShow, this);
  }

  /**
   * @return void
   */
  hide() {
    document.body.classList.remove('modal-show');
  }

  /**
   * @return void
   */
  destroyModal() {
    if (this.elements.node) {
      const computedStyles = getComputedStyle(this.elements.node);

      if (+computedStyles.opacity) {
        this.elements.node.addEventListener('transitionend', () => this.destroyModal());

        return this.hide();
      }

      this.hide();
      this.elements.node.remove();
    }

    this.elements = {};
  }
}
