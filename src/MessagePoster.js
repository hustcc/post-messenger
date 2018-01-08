/**
 * Created by hustcc on 18/1/8.
 * Contract: i@hust.cc
 */
import { invariant, messageDecode, messageEncode, isChannelMatch } from './utils';
import { Target } from './Target';

const post = window.postMessage; // 最终的原理就是使用 postMessage 实现


export class MessagePoster {
  constructor(name) {
    invariant(post, 'window.postMessage not defined.');

    invariant(!name.includes('-'), '`name` can not contains \'-\'.'); // - is the seperate of message.
    this.name = name; // poster 名称
    this.targets = []; // 所有的 target
    this.listeners = []; // 所有的监听者
  }

  /**
   * 收到消息的方法构造器
   * @type {function(*)}
   */
  _onMessage = (ch, cb) => e => {
    const { name, channel, message } = messageDecode(e.data);
    // name 和 channel 一致的时候，才 callback 消息
    //
    if (
      name === this.name && // 同一个应用
      isChannelMatch(this.ch, channel) // 监听的 channel 匹配
    ) {
      cb(message);
    }
  };

  /**
   * 开始监听 target 的某个事件
   * @param target
   * @param cb
   * @param channel 默认为全部
   */
  on = (target, cb, channel = '*') => {
    invariant(typeof cb === 'function', '`cb` should be function.');
    invariant(target instanceof Target, '`target` should be instanceof Target.');

    const onMessageFunc = this._onMessage(channel, cb);

    // 监听事件
    if (window.addEventListener) {
      window.addEventListener('message', onMessageFunc, false);
      target.addListener(onMessageFunc);
    } else if (window.attachEvent) {
      window.attachEvent('onmessage', onMessageFunc);
      target.addListener(onMessageFunc);
    }
    this.targets.push(target);
  };

  /**
   * 取消监听
   */
  off = (target, channel = '*') => {
    const idx = this.targets.indexOf(target);
    // 找不到的时候，直接返回
    if (idx === -1) return;

    // 删除 targets
    this.targets.splice(idx, 1);
    const func = this.listeners.splice(idx, 1);

    // 取消事件
    if (window.removeEventListener) {
      window.removeEventListener('message', this.onMessage, false);
    } else if (window.attachEvent) {
      window.attachEvent('onmessage', this.onMessage);
    }
  };

  /**
   * TODO 清空所有监听
   */
  clear = () => {

  };

  /**
   * 给指定的 target 发送消息
   * @param target
   * @param channel
   * @param message
   */
  send = (target, channel, message) => {
    // 校验发送的数据
    invariant(typeof channel === 'string' && channel, '`channel` should be a string which can not be empty.');
    invariant(!channel.includes('-'), '`channel` can not contains \'-\'.');
    invariant(typeof message === 'string' && message, '`message` should be a string which can not be empty.');

    const msg = messageEncode(this.name, channel, message);
    target.send(msg);
  };

  /**
   * 广播的形式发送消息
   * @param channel
   * @param message
   */
  broadcast = (channel, message) => {
    // 校验发送的数据
    this.targets.forEach(target => {
      this.send(target, channel, message);
    });
  };
}

