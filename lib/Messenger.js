'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _namespace = require('./namespace');

var _namespace2 = _interopRequireDefault(_namespace);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
/**
 * Created by hustcc on 18/1/8.
 * Contract: i@hust.cc
 */

exports.default = function (project, target) {
  var origin = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '*';

  // 最终 on message 的方法
  var listener = null;
  // 不同 channel 的监听器
  var channelListeners = [];

  var encode = function encode(channel, message) {
    return {
      channel: channel,
      message: message,
      project: project
    };
  };

  var decode = function decode(message) {
    return message;
  };

  /**
   * 检查是够需要取消 message 监听
   */
  var check = function check() {
    // 如果是最后一个 on 事件，那么需要取消绑定
    if (channelListeners.length === 0 && listener) {
      (0, _utils.unListen)(listener); // 取消注册 on message 方法
      listener = null;
    }
  };

  /**
   * 包装的 on message 监听器方法
   * @returns {function(*)}
   */
  var listenerEntry = function listenerEntry() {
    return function (e) {
      var _decode = decode(e.data),
          msgChannel = _decode.channel,
          message = _decode.message,
          msgProject = _decode.project;
      // 校验 project 项目


      if (msgProject === project) {
        // 遍历执行 channel listeners
        for (var i = 0; i < channelListeners.length; i += 1) {
          var _channelListeners$i = channelListeners[i],
              ch = _channelListeners$i.ch,
              cb = _channelListeners$i.cb,
              _once = _channelListeners$i.once;
          // 符合的才执行

          if ((0, _namespace2.default)(ch).match(msgChannel)) {
            if (_once) {
              // 删除监听器
              channelListeners.splice(i, 1);
              i -= 1;
            }
            cb(message, e);
          }
        }
        check();
      }
    };
  };

  var on = function on(ch, cb) {
    var once = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

    // 如果是第一个 on 事件，那么先绑定一下
    if (channelListeners.length === 0) {
      listener = listenerEntry();
      (0, _utils.listen)(listener); // 注册 on message 方法
    }

    channelListeners.push({
      ch: ch,
      cb: cb,
      once: once
    });
  };

  var once = function once(ch, cb) {
    on(ch, cb, true);
  };

  var off = function off(ch, cb) {
    // 清空所有
    if (ch === undefined && cb === undefined) {
      channelListeners = [];
    } else {
      for (var i = 0; i < channelListeners.length; i += 1) {
        var _channelListeners$i2 = channelListeners[i],
            h = _channelListeners$i2.ch,
            b = _channelListeners$i2.cb;
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

  var send = function send(ch, message) {
    // just throw when need to send message.
    (0, _utils.invariant)(target && target.postMessage, 'Messenger\'s target should has `postMessage` function.');

    target.postMessage(encode(ch, message), origin);
  };

  var getListener = function getListener() {
    return listener;
  };

  return {
    // props
    channelListeners: channelListeners,
    // functions
    getListener: getListener,
    on: on,
    once: once,
    off: off,
    send: send
  };
};

module.exports = exports['default'];