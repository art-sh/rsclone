import Mixin from '@helpers/Mixin';

export default class SoundPlayer {
  constructor(app) {
    this.$app = app;

    this.audio = new (window.AudioContext || window.webkitAudioContext)();
    this.soundBuffers = {};
    this.defaultSounds = Mixin.handleWebpackImport(require.context('@assets/sound', true, /\.mp3/));
  }

  loadSound(key, path, callback = null) {
    fetch(path)
      .then((response) => response.arrayBuffer())
      .then((buffer) => this.audio.decodeAudioData(buffer, (decodedData) => {
        this.soundBuffers[key] = decodedData;

        if (callback) callback();
      }));
  }

  playSound(key) {
    if (!this.soundBuffers[key]) throw new Error('Sound not found');

    const source = this.audio.createBufferSource();

    source.connect(this.audio.destination);
    source.buffer = this.soundBuffers[key];
    source.start(0);
  }

  removeSound(key) {
    delete this.soundBuffers[key];
  }

  loadDefaultSounds() {
    Object.keys(this.defaultSounds).forEach((key) => {
      this.loadSound(key, this.defaultSounds[key]);
    });
  }
}
