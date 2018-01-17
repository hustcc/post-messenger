/**
 * Created by hustcc on 18/1/8.
 * Contract: i@hust.cc
 */

import { isChannelMatch, invariant } from './utils';

describe('utils', () => {
  test('isChannelMatch', () => {
    expect(isChannelMatch('', '')).toBe(true);
    expect(isChannelMatch('', '*')).toBe(true);
    expect(isChannelMatch('*', '')).toBe(true);
    expect(isChannelMatch('*', '*')).toBe(true);

    expect(isChannelMatch('a', '*')).toBe(true);
    expect(isChannelMatch('*', 'b')).toBe(true);

    expect(isChannelMatch('a.b.c', '*')).toBe(true);
    expect(isChannelMatch('a.b.c', 'a.*')).toBe(true);
    expect(isChannelMatch('a.b.c', 'a.b')).toBe(false);
    expect(isChannelMatch('a.b.*', 'a.b')).toBe(false);

    expect(isChannelMatch('*', 'a.b.c')).toBe(true);
    expect(isChannelMatch('a.*', 'a.b.c')).toBe(true);
    expect(isChannelMatch('a.b', 'a.b.c')).toBe(false);
    expect(isChannelMatch('a.b', 'a.b.*')).toBe(false);

    expect(isChannelMatch('a.b', 'a.b')).toBe(true);
    expect(isChannelMatch('a.b.c', 'a.b.*')).toBe(true);
    expect(isChannelMatch('a.b.*', 'a.b.c')).toBe(true);
    expect(isChannelMatch('a.b.*', 'a.b.*')).toBe(true);
    expect(isChannelMatch('a.b.c', 'a.b.d')).toBe(false);
    expect(isChannelMatch('c.b.a', 'a.b.d')).toBe(false);
  });

  test('invariant', () => {
    expect(() => { invariant(true, '') }).toThrow('invariant requires an error message argument.');

    expect(() => { invariant(true, 'hello') }).not.toThrow();

    expect(() => { invariant('', '%s', 'hello') }).toThrow('hello');
  })
});