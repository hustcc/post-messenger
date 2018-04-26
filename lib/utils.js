'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
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
var invariant = exports.invariant = function invariant(condition, format) {
  for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    args[_key - 2] = arguments[_key];
  }

  if (!condition) {
    var argIndex = 0;
    var errorMsg = format.replace(/%s/g, function () {
      return '' + args[argIndex++];
    });
    var error = new Error(errorMsg);
    error.name = 'Invariant';
    error.framesToPop = 1; // we don't care about invariant's own frame
    throw error;
  }
};

var listen = exports.listen = function listen(listener) {
  window.addEventListener('message', listener, false);
};

var unListen = exports.unListen = function unListen(listener) {
  window.removeEventListener('message', listener, false);
};