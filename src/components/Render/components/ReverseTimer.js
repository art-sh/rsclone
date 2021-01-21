import Mixin from '../../helpers/Mixin';

export default class ReverseTimer {
  constructor(config) {
    this.currentTimeSeconds = 0;
    this.currentTimeInterval = null;
    this.timerInterval = 1000;
    this.gameConfig = config;
  }

  initTimer(time, container, endGameMethod, interval = 1000) {
    this.timerInterval = interval;
    console.log(Mixin);
    this.currentTimeSeconds = time;
    this.currentTimeInterval = setInterval(() => {
      const min = Math.floor(this.currentTimeSeconds / 60);
      const sec = this.currentTimeSeconds % 60;

      this.currentTimeSeconds -= 1;
      this.setTimeText(`${this.addZero(min)}:${this.addZero(sec)}`, container);
      if (min === 0 && sec === 0) {
        endGameMethod();
      }
    }, this.timerInterval);
  }

  setTimeText(string, container) {
    container.textContent = string.toString();
  }

  addZero(num) {
    return num.toString().padStart(2, '0');
  }
}
