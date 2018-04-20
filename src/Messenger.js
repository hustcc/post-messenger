/**
 * Created by hustcc on 18/1/8.
 * Contract: i@hust.cc
 */

import namespace from './namespace';
import { invariant, listen, unListen } from './utils';

/**
 * const messenger = new Messenger('project', window.parent);
 *
 * messenger.on('channel', message => { }); // listen channel
 *
 * messenger.once('channel_once', message => { }); // listen channel
 *
 * messenger.send('channel', 'Hello world'); // send message to window.parent
 *
 * messenger.off(channel, func); // cancel listen
 */
class Messenger {
  constructor(project, target, origin = '*') {
    this.project = project; // project 是一个唯一的 id，可以用于做消息验证，区分大应用

    // target can be selector, dom, contentWindow
    this.target = typeof target === 'string' ? document.querySelector(target) : target;
    this.target = this.target.postMessage ? this.target : this.target.contentWindow;

    invariant(this.target.postMessage, 'Messenger\'s target should be a contentWindow.');

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
  once(channel, listener) {
    this.on(channel, listener, true);
  };

  /**
   * listen channel by listener
   * @param channel
   * @param listener
   * @param once
   */
  on(channel, listener, once = false) {
    // 如果是第一个 on 事件，那么先绑定一下
    if (this.channelListeners.length === 0) {
      this.listener = this._listenerEntry();
      listen(this.listener); // 注册 on message 方法
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
  off(channel, listener) {
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

    this._check();
  };

  /**
   * send message to channel
   * @param channel
   * @param message
   */
  send(channel, message) {
    this.target.postMessage(
      this._encode(channel, message),
      this.origin
    );
  };

  /**
   * 检查是够需要取消 message 监听
   * @private
   */
  _check() {
    // 如果是最后一个 on 事件，那么需要取消绑定
    if (this.channelListeners.length === 0 && this.listener) {
      unListen(this.listener); // 取消注册 on message 方法
      this.listener = null;
    }
  }

  /**
   * 包装的 on message 监听器方法
   * @returns {function(*)}
   * @private
   */
  _listenerEntry() {
    return e => {
      const { channel: msgChannel, message, project } = this._decode(e.data);
      // 校验 project 项目
      if (project === this.project) {
        // 遍历执行 channel listeners
        for (let i = 0; i < this.channelListeners.length; i += 1) {
          const { channel, listener, once } = this.channelListeners[i];
          // 符合的才执行
          if (namespace(channel).match(msgChannel)) {
            if (once) {
              // 删除监听器
              this.channelListeners.splice(i, 1);
              i -= 1;
            }
            listener(message, e);
          }
        }
        this._check();
      }
    }
  };

  _encode(channel, message) {
    return {
      channel,
      message,
      project: this.project,
    };
  }

  _decode(message) {
    return message;
  }
}

export default Messenger;
