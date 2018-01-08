/**
 * window.postMessage 的封装
 *
 * Created by hustcc on 18/1/8.
 * Contract: i@hust.cc
 */
import { invariant } from './utils';

// 校验运行环境
invariant(
  window.postMessage, // 最终的原理就是使用 postMessage 实现
  'window.postMessage not defined.'
);

/**
 * const mp = new MessagePoster('di-open');
 *
 * const t1 = new Target('#iframe1');
 * const t2 = new Target('#iframe2');
 *
 * mp.on(t1, 'save', () => {}); // 监听 t1 的消息
 * mp.on(t2, 'selectChild', () => {}); // 监听 t2 的消息
 *
 * mp.send(t1, 'value', JSON.stringify({ a: 1 }));
 *
 * mp.broadcast('*', 'hello world');
 */
export { MessagePoster } from './MessagePoster';
export { Target } from './Target';
