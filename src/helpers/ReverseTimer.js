export default class ReverseTimer {
  constructor() {
    Object.defineProperty(this, '_currentTimeSeconds', {
      writable: true,
    });
    this.timerInterval = null;
    this.time = this.getTimerProxy({
      minutes: 0,
      seconds: 0,

      minutesString: '00',
      secondsString: '00',
    });
  }

  /**
   * @return {number}
   */
  get currentTimeSeconds() {
    return this._currentTimeSeconds;
  }

  /**
   * @param {number} value
   * @return {void}
   */
  set currentTimeSeconds(value) {
    this._currentTimeSeconds = value;

    this.time.seconds = value % 60;
    this.time.minutes = Math.floor(value / 60);
  }

  /**
   * @param {number} timeSeconds
   * @param {function} tickCallback
   * @param {function} endCallback
   * @param {number} interval
   * @return {*}
   */
  startCount(timeSeconds, tickCallback = null, endCallback = null, interval = 1000) {
    if (!timeSeconds) return endCallback(this.time);
    if (this.timerInterval) this.stopCount();

    this.currentTimeSeconds = timeSeconds;

    this.timerInterval = setInterval(() => {
      this.currentTimeSeconds -= 1;

      if (tickCallback) tickCallback({ ...this.time });

      if (!this.currentTimeSeconds) {
        if (endCallback) endCallback({ ...this.time });

        this.stopCount();
      }
    }, interval);
  }

  /**
   * @return {void}
   */
  stopCount() {
    clearInterval(this.timerInterval);

    this.timerInterval = null;
    this.currentTimeSeconds = 0;
  }

  /**
   * @param {object} obj
   * @return {object}
   */
  getTimerProxy(obj) {
    const self = this;

    return new Proxy(obj, {
      set(target, property, value) {
        target[property] = value;

        if (property === 'minutes') target.minutesString = self.addZero(target.minutes);
        if (property === 'seconds') target.secondsString = self.addZero(target.seconds);

        return true;
      },
    });
  }

  /**
   * @param {number|string} num
   * @return {string}
   */
  addZero(num) {
    return num.toString().padStart(2, '0');
  }
}
