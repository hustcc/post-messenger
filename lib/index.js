'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _utils = require('./utils');

var _Messenger = require('./Messenger');

var _Messenger2 = _interopRequireDefault(_Messenger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// 校验运行环境
(0, _utils.invariant)(window.postMessage, // 最终的原理就是使用 postMessage 实现
'window.postMessage is not defined.'); /**
                                        * window.postMessage 的封装
                                        *
                                        * Created by hustcc on 18/1/8.
                                        * Contract: i@hust.cc
                                        */
exports.default = _Messenger2.default;
module.exports = exports['default'];