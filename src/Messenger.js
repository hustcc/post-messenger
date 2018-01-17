/**
 * Created by hustcc on 18/1/8.
 * Contract: i@hust.cc
 */

import { isChannelMatch } from './utils';

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
    this.project = project; // project 是一个唯一的 id，可以用于做消息验证，区分大应用
    this.target = typeof target === 'string' ? document.querySelector(target).contentWindow : target;

    this.origin = origin;
    // 最终 on message 的方法
    this.listener = null;

    // 不同 channel 的监听器
    this.channelListeners = [];
  }

  /**
   * 只监听一次
   * @param channel
   * @param listener
   */
  once = (channel, listener) => {
    this.on(channel, listener, true);
  };

  /**
   * listen channel by listener
   * @param channel
   * @param listener
   * @param once
   */
  on = (channel, listener, once = false) => {
    // 如果是第一个 on 事件，那么先绑定一下
    if (this.channelListeners.length === 0) {
      this.listener = this._listenerEntry();
      this._onMessage(this.listener); // 注册 on message 方法
    }

    this.channelListeners.push({
      channel,
      listener,
      once,
    });
  };

  /**
   * cancel listen with listener
   * @param channel
   * @param listener
   */
  off = (channel, listener) => {
    // 清空所有
    if (listener === undefined && channel === undefined) {
      this.channelListeners = [];
    } else {
      for (let i = 0; i < this.channelListeners.length; i += 1) {
        const { channel: c, listener: l } = this.channelListeners[i];
        // 找到 listener
        if (c === channel && l === listener) {
          // 删除这一个
          this.channelListeners.splice(i, 1);
          i -= 1;
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
      // 校验 project 项目
      if (project === this.project) {
        // 遍历执行 channel listeners
        this.channelListeners.forEach(({ channel, listener, once }) => {
          // 符合的才执行
          if (isChannelMatch(channel, msgChannel)) {
            if (once) {
              // 取消
              this.off(channel, listener);
            }
            listener(message, e);
          }
        });
      }
    }
  };

  _onMessage = listener => {
    // 监听事件
    window.addEventListener('message', listener, false);
  };

  _offMessage = listener => {
    // 取消事件
    window.removeEventListener('message', listener, false);
  };

  _encode = (channel, message) => ({
    channel,
    message,
    project: this.project,
  });

  _decode = message => message;
}

export default Messenger;
