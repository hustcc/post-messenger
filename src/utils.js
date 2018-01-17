/**
 * Created by hustcc on 18/1/8.
 * Contract: i@hust.cc
 */

/**
 * 抛错
 * @param condition
 * @param format
 * @param args
 */
export const invariant = (condition, format, ...args) => {
  if (!format) {
    throw new Error('invariant requires an error message argument.');
  }

  if (!condition) {
    let argIndex = 0;
    const errorMsg = format.replace(/%s/g, () => `${args[argIndex++]}`);
    const error = new Error(errorMsg);
    error.name = 'Invariant Violation';
    error.framesToPop = 1; // we don't care about invariant's own frame
    throw error;
  }
};

const channelMatchLoop = (needles, channels) => {
  const [n, ...on] = needles;
  const [c, ...oc] = channels;
  if (n !== c && [n, c].indexOf('*') === -1) return false;
  // 最后一个，且长度相同
  // a.b.c - a.b.c
  // a.b.* - a.b.c
  // a.b.c - a.b.*
  if (on.length === 0 && oc.length === 0) {
    return n === c || [n, c].indexOf('*') !== -1;
  }

  // a.b - a.b.c false
  // a.b - a.b.* false
  // a.* - a.b.c true
  if (on.length === 0) return n === '*';

  // a.b.c - a.b false
  // a.b.* - a.b false
  // a.b.c - a.* true
  if (oc.length === 0) return c === '*';

  // 递归
  return channelMatchLoop(on, oc);
};

/**
 * 判断 needle 是否在 channel 之内
 * @param needle
 * @param channel
 */
export const isChannelMatch = (needle, channel) => channelMatchLoop(needle.split('.'), channel.split('.'));
