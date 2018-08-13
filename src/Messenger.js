/**
 * Created by hustcc on 18/1/8.
 * Contract: i@hust.cc
 */

import namespace from './namespace';
import { invariant, listen, unListen } from './utils';

/**
 * const pm = Messenger('project', window.parent);
 *
 * // listen channel
 * pm.on('channel', message => { });
 *
 * // listen channel
 * pm.once('channel_once', message => { });
 *
 * // send message to window.parent
 * pm.send('channel', 'Hello world');
 *
 * pm.off(channel, func); // cancel listen
 */
export default (project, target, origin = '*') => {
  // 最终 on message 的方法
  let listener = null;
  // 不同 channel 的监听器
  let channelListeners = [];

  const encode = (channel, message) => {
    return {
      channel,
      message,
      project,
    };
  };

  const decode = message => {
    return message;
  };

  /**
   * 检查是够需要取消 message 监听
   */
  const check = () => {
    // 如果是最后一个 on 事件，那么需要取消绑定
    if (channelListeners.length === 0 && listener) {
      unListen(listener); // 取消注册 on message 方法
      listener = null;
    }
  };

  /**
   * 包装的 on message 监听器方法
   * @returns {function(*)}
   */
  const listenerEntry = () => {
    return e => {
      const { channel: msgChannel, message, project: msgProject } = decode(e.data);
      // 校验 project 项目
      if (msgProject === project) {
        // 遍历执行 channel listeners
        for (let i = 0; i < channelListeners.length; i += 1) {
          const { ch, cb, once } = channelListeners[i];
          // 符合的才执行
          if (namespace(ch).match(msgChannel)) {
            if (once) {
              // 删除监听器
              channelListeners.splice(i, 1);
              i -= 1;
            }
            cb(message, e);
          }
        }
        check();
      }
    }
  };

  const on = (ch, cb, once = false) => {
    // 如果是第一个 on 事件，那么先绑定一下
    if (channelListeners.length === 0) {
      listener = listenerEntry();
      listen(listener); // 注册 on message 方法
    }

    channelListeners.push({
      ch,
      cb,
      once,
    });
  };

  const once = (ch, cb) => {
    on(ch, cb, true);
  };

  const off = (ch, cb) => {
    // 清空所有
    if (ch === undefined && cb === undefined) {
      channelListeners = [];
    } else {
      for (let i = 0; i < channelListeners.length; i += 1) {
        const { ch: h, cb: b } = channelListeners[i];
        // 找到 listener
        if (h === ch && b === cb) {
          // 删除这一个
          channelListeners.splice(i, 1);
          i -= 1;
        }
      }
    }

    check();
  };

  const send = (ch, message) => {
    // just throw when need to send message.
    invariant(target && target.postMessage, 'Messenger\'s target should has `postMessage` function.');

    target.postMessage(
      encode(ch, message),
      origin
    );
  };

  const getListener = () => listener;

  return {
    // props
    getListener,
    channelListeners,
    // functions
    on,
    once,
    off,
    send,
  }
}
