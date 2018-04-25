var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Created by hustcc on 18/1/8.
 * Contract: i@hust.cc
 */

import namespace from './namespace';
import { invariant, listen, unListen } from './utils';

/**
 * const pm = new Messenger('project', window.parent);
 *
 * pm.on('channel', message => { }); // listen channel
 *
 * pm.once('channel_once', message => { }); // listen channel
 *
 * pm.send('channel', 'Hello world'); // send message to window.parent
 *
 * pm.off(channel, func); // cancel listen
 */

var Messenger = function () {
  function Messenger(project, target) {
    var origin = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '*';

    _classCallCheck(this, Messenger);

    this.project = project; // project 是一个唯一的 id，可以用于做消息验证，区分大应用

    // target can be selector, dom, contentWindow
    this.target = (typeof target === 'string' ? document.querySelector(target) : target) || {};
    this.target = (this.target.postMessage ? this.target : this.target.contentWindow) || {};

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


  _createClass(Messenger, [{
    key: 'once',
    value: function once(channel, listener) {
      this.on(channel, listener, true);
    }
  }, {
    key: 'on',


    /**
     * listen channel by listener
     * @param channel
     * @param listener
     * @param once
     */
    value: function on(channel, listener) {
      var once = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

      // 如果是第一个 on 事件，那么先绑定一下
      if (this.channelListeners.length === 0) {
        this.listener = this._listenerEntry();
        listen(this.listener); // 注册 on message 方法
      }

      this.channelListeners.push({
        channel: channel,
        listener: listener,
        once: once
      });
    }
  }, {
    key: 'off',


    /**
     * cancel listen with listener
     * @param channel
     * @param listener
     */
    value: function off(channel, listener) {
      // 清空所有
      if (listener === undefined && channel === undefined) {
        this.channelListeners = [];
      } else {
        for (var i = 0; i < this.channelListeners.length; i += 1) {
          var _channelListeners$i = this.channelListeners[i],
              c = _channelListeners$i.channel,
              l = _channelListeners$i.listener;
          // 找到 listener

          if (c === channel && l === listener) {
            // 删除这一个
            this.channelListeners.splice(i, 1);
            i -= 1;
          }
        }
      }

      this._check();
    }
  }, {
    key: 'send',


    /**
     * send message to channel
     * @param channel
     * @param message
     */
    value: function send(channel, message) {
      // just throw when need to send message.
      invariant(this.target.postMessage, 'Messenger\'s target should be a contentWindow.');

      this.target.postMessage(this._encode(channel, message), this.origin);
    }
  }, {
    key: '_check',


    /**
     * 检查是够需要取消 message 监听
     * @private
     */
    value: function _check() {
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

  }, {
    key: '_listenerEntry',
    value: function _listenerEntry() {
      var _this = this;

      return function (e) {
        var _decode2 = _this._decode(e.data),
            msgChannel = _decode2.channel,
            message = _decode2.message,
            project = _decode2.project;
        // 校验 project 项目


        if (project === _this.project) {
          // 遍历执行 channel listeners
          for (var i = 0; i < _this.channelListeners.length; i += 1) {
            var _channelListeners$i2 = _this.channelListeners[i],
                channel = _channelListeners$i2.channel,
                listener = _channelListeners$i2.listener,
                once = _channelListeners$i2.once;
            // 符合的才执行

            if (namespace(channel).match(msgChannel)) {
              if (once) {
                // 删除监听器
                _this.channelListeners.splice(i, 1);
                i -= 1;
              }
              listener(message, e);
            }
          }
          _this._check();
        }
      };
    }
  }, {
    key: '_encode',
    value: function _encode(channel, message) {
      return {
        channel: channel,
        message: message,
        project: this.project
      };
    }
  }, {
    key: '_decode',
    value: function _decode(message) {
      return message;
    }
  }]);

  return Messenger;
}();

export default Messenger;
module.exports = exports['default'];