/**
 * Created by hustcc on 18/1/8.
 * Contract: i@hust.cc
 */

import { invariant, isChannelMatch } from './utils';

/**
 * const messenger = new Messenger('appid', window.parent);
 *
 * messenger.on('channel', message => { }); // listen channel
 *
 * messenger.send('Hello world'); // send message to window.parent
 *
 * messenger.off(func); // un listen
 */
class Messenger {
  constructor(project, target, origin = '*') {
    invariant(!project.includes('-'), 'Project can not contains `-`.');
    this.project = project; // project 是一个唯一的 id，可以用于做消息验证
    this.target = typeof target === 'string' ? document.querySelector(target) : target;

    this.origin = origin;
    // 最终 on message 的方法
    this.listener = null;

    // 不同 channel 的监听器
    this.channelListeners = [];
  }

  /**
   * listen channel by listener
   * @param channel
   * @param listener
   */
  on = (channel, listener) => {
    // 如果是第一个 on 事件，那么先绑定一下
    if (this.channelListeners.length === 0) {
      this.listener = this._listenerEntry();
      this._onMessage(this.listener); // 注册 on message 方法
    }

    this.channelListeners.push({
      channel,
      listener,
    });
  };

  /**
   * cancel listen with listener
   * @param listener
   */
  off = listener => {
    if (listener === undefined) {
      this.channelListeners = [];
    } else {
      for (let i = 0; i < this.channelListeners.length; i += 1) {
        // 找到 listern
        if (this.channelListeners[i].listener === listener) {
          // 删除这一个
          this.channelListeners.splice(i, 1);
        }
      }
    }

    // 如果是最后一个 on 事件，那么需要取消绑定
    if (this.channelListeners.length === 0 && this.listener) {
      this._offMessage(this.listener); // 取消注册 on message 方法
      this.listener = null;
    }
  };

  /**
   * send message to channel
   * @param channel
   * @param message
   */
  send = (channel, message) => {
    this.target.postMessage(
      this._encode(channel, message),
      this.origin
    );
  };

  /**
   * 包装的 on message 监听器方法
   * @returns {function(*)}
   * @private
   */
  _listenerEntry = () => {
    return e => {
      const { channel: msgChannel, message, project } = this._decode(e.data);
      // 校验 project（有点鸡肋）
      if (project === this.project) {
        // 遍历执行 channel listeners
        this.channelListeners.forEach(({ channel, listener }) => {
          // 符合的才执行
          if (isChannelMatch(channel, msgChannel)) listener(message, e);
        });
      }
    }
  };

  _onMessage = listener => {
    // 监听事件
    if (window.addEventListener) {
      window.addEventListener('message', listener, false);
    } else if (window.attachEvent) {
      window.attachEvent('onmessage', listener);
    };
  };

  _offMessage = listener => {
    // 取消事件
    if (window.removeEventListener) {
      window.removeEventListener('message', listener, false);
    } else if (window.attachEvent) {
      window.attachEvent('onmessage', listener);
    }
  };

  _encode = (channel, message) => ({
    channel,
    message,
    project: this.project,
  });

  _decode = message => message;
}

export default Messenger;
