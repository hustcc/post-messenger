/**
 * Created by hustcc on 18/1/8.
 * Contract: i@hust.cc
 */

/**
 * 是否支持 post message
 * @returns boolean
 */
export const postMessageSupported = () => typeof window !== 'undefined' && !!window.postMessage;

/**
 * 抛错
 * @param condition
 * @param msg
 */
export const invariant = (condition, msg) => {
  if (!condition) {
    throw new Error(msg);
  }
};


export const listen = listener => {
  postMessageSupported() && window.addEventListener('message', listener, false);
};

export const unListen = listener => {
  postMessageSupported() && window.removeEventListener('message', listener, false);
};
