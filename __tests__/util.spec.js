/**
 * Created by hustcc on 18/1/8.
 * Contract: i@hust.cc
 */

import { invariant } from '../src/utils';

describe('utils', () => {
  test('invariant', () => {
    expect(() => { invariant(true, 'hello') }).not.toThrow();

    expect(() => { invariant('', '%s', 'hello') }).toThrow('hello');
  })
});
