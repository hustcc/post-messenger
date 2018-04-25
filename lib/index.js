/**
 * window.postMessage 的封装
 *
 * Created by hustcc on 18/1/8.
 * Contract: i@hust.cc
 */
import { invariant } from './utils';

// 校验运行环境
invariant(window.postMessage, // 最终的原理就是使用 postMessage 实现
'window.postMessage is not defined.');

import Messenger from './Messenger';

export default Messenger;
module.exports = exports['default'];