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

  if (!format) {
    throw new Error('invariant requires an error message argument.');
  }

  if (!condition) {
    var argIndex = 0;
    var errorMsg = format.replace(/%s/g, function () {
      return '' + args[argIndex++];
    });
    var error = new Error(errorMsg);
    error.name = 'Invariant Violation';
    error.framesToPop = 1; // we don't care about invariant's own frame
    throw error;
  }
};