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

/**
 * 消息的构造器，
 * @param channel
 * @param message
 */
export const messageEncode = (name, channel, message) => `${name}-${channel}-${message}`;

/**
 * 消息解构
 * @param msg
 */
export const messageDecode = (msg) => {
  const [ name, channel, ...message ] = msg.split('-');
  return {
    name,
    channel,
    message: message.join('-'),
  }
};

/**
 * 判断 needle 是否在 channel 之内
 * @param channel
 * @param needle
 */
export const isChannelMatch = (channel, needle) => {
  const channels = channel.split('.');
  const needles = channel.split('.');
  for (let i = 0; i < channels.length; i += 1) {
    // 既不是 * 也不和 needles 相同，那么就是不匹配了
    if (!['*', needles[i]].includes(channels[i])) return false;
  }
  return true;
};
