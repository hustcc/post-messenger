/**
 * Created by hustcc on 18/1/8.
 * Contract: i@hust.cc
 */

export class Target {
  constructor(entity) {
    this.entity = entity; // html iframe 实例
    this.listeners = []; // 监听他的事件
  }

  addListener = (listener) => {
    this.listeners.push(listener);
  };

  send = (message) => {
     this.entity.postMessage(message, '*');
  }
}
