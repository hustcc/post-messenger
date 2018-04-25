/**
 * Created by hustcc on 19/01/18.
 */

import { invariant } from './utils';

function _match(namespaces, needles, option) {
  var n = needles[0];
  var on = needles.slice(1);
  var c = namespaces[0];
  var oc = namespaces.slice(1);
  var wil = option.wil;

  if (n !== c && [n, c].indexOf(wil) === -1) return false;
  // 最后一个，且长度相同
  // a.b.c - a.b.c
  // a.b.* - a.b.c
  // a.b.c - a.b.*
  if (on.length === 0 && oc.length === 0) return n === c || [n, c].indexOf(wil) !== -1;

  // a.b - a.b.c false
  // a.b - a.b.* false
  // a.* - a.b.c true
  if (on.length === 0) return n === wil;

  // a.b.c - a.b false
  // a.b.* - a.b false
  // a.b.c - a.* true
  if (oc.length === 0) return c === wil;

  // 递归
  return _match(oc, on, option);
}

var check = function check(param) {
  invariant(typeof param === 'string', 'namespace should be a string.');
};

export default (function (namespace, opt) {
  check(namespace);

  var option = Object.assign({
    sep: '.',
    wil: '*'
  }, opt);
  return {
    match: function match(needle) {
      check(needle);

      return _match(namespace.split(option.sep), needle.split(option.sep), option);
    }
  };
});
module.exports = exports['default'];