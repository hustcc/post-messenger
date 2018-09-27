'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Created by hustcc on 18/1/8.
 * Contract: i@hust.cc
 */

/**
 * 是否支持 post message
 * @returns boolean
 */
var postMessageSupported = exports.postMessageSupported = function postMessageSupported() {
  return typeof window !== 'undefined' && !!window.postMessage;
};

/**
 * 抛错
 * @param condition
 * @param msg
 */
var invariant = exports.invariant = function invariant(condition, msg) {
  if (!condition) {
    throw new Error(msg);
  }
};

var listen = exports.listen = function listen(listener) {
  postMessageSupported() && window.addEventListener('message', listener, false);
};

var unListen = exports.unListen = function unListen(listener) {
  postMessageSupported() && window.removeEventListener('message', listener, false);
};