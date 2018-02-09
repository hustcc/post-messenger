'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _namespace = require('./namespace');

var _namespace2 = _interopRequireDefault(_namespace);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } } /**
                                                                                                                                                           * Created by hustcc on 18/1/8.
                                                                                                                                                           * Contract: i@hust.cc
                                                                                                                                                           */

/**
 * const messenger = new Messenger('appid', window.parent);
 *
 * messenger.on('channel', message => { }); // listen channel
 *
 * messenger.send('Hello world'); // send message to window.parent
 *
 * messenger.off(func); // un listen
 */
var Messenger = function Messenger(project, target) {
  var origin = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '*';

  _classCallCheck(this, Messenger);

  _initialiseProps.call(this);

  this.project = project; // project 是一个唯一的 id，可以用于做消息验证，区分大应用

  // target can be selector, dom, contentWindow
  this.target = typeof target === 'string' ? document.querySelector(target) : target;
  this.target = this.target.postMessage ? this.target : this.target.contentWindow;

  (0, _utils.invariant)(this.target.postMessage, 'Messenger target should be a contentWindow.');

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


/**
 * listen channel by listener
 * @param channel
 * @param listener
 * @param once
 */


/**
 * cancel listen with listener
 * @param channel
 * @param listener
 */


/**
 * send message to channel
 * @param channel
 * @param message
 */


/**
 * 包装的 on message 监听器方法
 * @returns {function(*)}
 * @private
 */
;

var _initialiseProps = function _initialiseProps() {
  var _this = this;

  this.once = function (channel, listener) {
    _this.on(channel, listener, true);
  };

  this.on = function (channel, listener) {
    var once = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

    // 如果是第一个 on 事件，那么先绑定一下
    if (_this.channelListeners.length === 0) {
      _this.listener = _this._listenerEntry();
      _this._onMessage(_this.listener); // 注册 on message 方法
    }

    _this.channelListeners.push({
      channel: channel,
      listener: listener,
      once: once
    });
  };

  this.off = function (channel, listener) {
    // 清空所有
    if (listener === undefined && channel === undefined) {
      _this.channelListeners = [];
    } else {
      for (var i = 0; i < _this.channelListeners.length; i += 1) {
        var _channelListeners$i = _this.channelListeners[i],
            c = _channelListeners$i.channel,
            l = _channelListeners$i.listener;
        // 找到 listener

        if (c === channel && l === listener) {
          // 删除这一个
          _this.channelListeners.splice(i, 1);
          i -= 1;
        }
      }
    }

    // 如果是最后一个 on 事件，那么需要取消绑定
    if (_this.channelListeners.length === 0 && _this.listener) {
      _this._offMessage(_this.listener); // 取消注册 on message 方法
      _this.listener = null;
    }
  };

  this.send = function (channel, message) {
    _this.target.postMessage(_this._encode(channel, message), _this.origin);
  };

  this._listenerEntry = function () {
    return function (e) {
      var _decode = _this._decode(e.data),
          msgChannel = _decode.channel,
          message = _decode.message,
          project = _decode.project;
      // 校验 project 项目


      if (project === _this.project) {
        // 遍历执行 channel listeners
        _this.channelListeners.forEach(function (_ref) {
          var channel = _ref.channel,
              listener = _ref.listener,
              once = _ref.once;

          // 符合的才执行
          if ((0, _namespace2.default)(channel).match(msgChannel)) {
            if (once) {
              // 取消
              _this.off(channel, listener);
            }
            listener(message, e);
          }
        });
      }
    };
  };

  this._onMessage = function (listener) {
    // 监听事件
    window.addEventListener('message', listener, false);
  };

  this._offMessage = function (listener) {
    // 取消事件
    window.removeEventListener('message', listener, false);
  };

  this._encode = function (channel, message) {
    return {
      channel: channel,
      message: message,
      project: _this.project
    };
  };

  this._decode = function (message) {
    return message;
  };
};

exports.default = Messenger;
module.exports = exports['default'];