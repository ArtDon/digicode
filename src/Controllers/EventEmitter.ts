class EventEmitter {
  events: any;

  constructor() {
    this.events = {};
  }
  dispatch(eventName: string, data: any = null) {
    const event = this.events[eventName];
    if (event) {
      event.forEach((fn: Function) => {
        fn.call(null, data);
      });
    }
  }
  _getEventListByName(eventName: string) {
    if (typeof this.events[eventName] === 'undefined') {
      this.events[eventName] = new Set();
    }
    return this.events[eventName]
  }
  removeEventListener(eventName: string, fn: Function) {
    this._getEventListByName(eventName).delete(fn);
  }
  addEventListener(eventName: string, fn: Function) {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(fn);
    return () => {
      this.events[eventName] = this.events[eventName].filter((eventFn: Function) => fn !== eventFn);
    }
  }
}


const cEventEmitter = new EventEmitter();

export default cEventEmitter;