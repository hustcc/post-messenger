/**
 * Created by hustcc on 18/1/8.
 * Contract: i@hust.cc
 */

import { invariant } from './utils';

/**
 * const messenger = new Messenger('appid', window.parent);
 *
 * messenger.on((message) => { }); // listen
 *
 * messenger.send('Hello world'); // send message to window.parent
 *
 * messenger.off(); // un listen
 */
class Messenger {
  constructor(project, target, origin = '*') {
    invariant(!project.includes('-'), 'Project can not contains `-`.');
    this.project = project; // project 是一个唯一的 id，可以用于做消息验证
    this.target = typeof target === 'string' ? document.querySelector(target) : target;
    this.origin = origin;

    this.listener = null;
  }

  on = listener => {
    if (typeof listener !== 'function') {
      return;
    }
    if (!this.listener) {
      this.listener = this._wrapFunc(listener);
      // 监听事件
      if (window.addEventListener) {
        window.addEventListener('message', this.listener, false);
      } else if (window.attachEvent) {
        window.attachEvent('onmessage', this.listener);
      }
    } else {
      invariant(false, 'Listener is exist.');
    }
  };


  off = () => {
    if (this.listener) {
      // 取消事件
      if (window.removeEventListener) {
        window.removeEventListener('message', this.listener, false);
      } else if (window.attachEvent) {
        window.attachEvent('onmessage', this.listener);
      }
      this.listener = null;
    } else {
      invariant(false, 'Listener is not exist.');
    }
  };

  /**
   * 包装的方法
   * @param listener
   * @returns {function(*)}
   * @private
   */
  _wrapFunc = listener => {
    return e => {
      const m = this._decode(e.data);
      // 校验 project（有点鸡肋）
      if (m.project === this.project) listener(m.message);
    }
  };

  _encode = message => ({
    message,
    project: this.project,
  });

  _decode = message => message;

  send = message => {
    this.target.postMessage(
      this._encode(message),
      this.origin
    );
  };
}

export default Messenger;