import Mixin from '@helpers/Mixin';

export default class SoundPlayer {
  /**
   * @param {App} app
   */
  constructor(app) {
    this.$app = app;

    this.audio = new (window.AudioContext || window.webkitAudioContext)();
    this.soundBuffers = {};
    this.defaultSounds = Mixin.handleWebpackImport(require.context('@assets/sound', true, /\.mp3/));
  }

  /**
   * @param {string} key
   * @param {string} path
   * @param {function} callback
   * @returns {void}
   */
  loadSound(key, path, callback = null) {
    fetch(path)
      .then((response) => response.arrayBuffer())
      .then((buffer) => this.audio.decodeAudioData(buffer, (decodedData) => {
        this.soundBuffers[key] = decodedData;

        if (callback) callback();
      }));
  }

  /**
   * @param {string} key
   * @returns {void}
   */
  playSound(key) {
    if (!this.soundBuffers[key]) throw new Error('Sound not found');
    if (!this.$app.storage.storage.userSettings.sound) return;

    const source = this.audio.createBufferSource();

    source.connect(this.audio.destination);
    source.buffer = this.soundBuffers[key];
    source.start(0);
  }

  /**
   * @param {string} key
   * @returns {void}
   */
  removeSound(key) {
    delete this.soundBuffers[key];
  }

  /**
   * Caching shared sounds buffer
   */
  loadDefaultSounds() {
    Object.keys(this.defaultSounds).forEach((key) => {
      this.loadSound(key, this.defaultSounds[key]);
    });
  }
}
