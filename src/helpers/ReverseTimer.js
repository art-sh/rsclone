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

  get currentTimeSeconds() {
    return this._currentTimeSeconds;
  }

  set currentTimeSeconds(value) {
    this._currentTimeSeconds = value;

    this.time.seconds = value % 60;
    this.time.minutes = Math.floor(value / 60);
  }

  startCount(timeSeconds, tickCallback = null, endCallback = null, interval = 1000) {
    if (!timeSeconds) return endCallback(this.time);
    if (this.timerInterval) this.stopCount();

    this.currentTimeSeconds = timeSeconds;

    if (tickCallback) tickCallback({ ...this.time });

    this.timerInterval = setInterval(() => {
      this.currentTimeSeconds -= 1;

      if (tickCallback) tickCallback({ ...this.time });

      if (!this.currentTimeSeconds) {
        if (endCallback) endCallback({ ...this.time });

        this.stopCount();
      }
    }, interval);
  }

  stopCount() {
    clearInterval(this.timerInterval);

    this.timerInterval = null;
    this.currentTimeSeconds = 0;
  }

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

  addZero(num) {
    return num.toString().padStart(2, '0');
  }
}
