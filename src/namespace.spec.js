const namespace = require('./namespace');

describe('namespace', () => {
  test(' - match', function() {
    expect(namespace('').match('')).toBe(true);
    expect(namespace('').match('*')).toBe(true);
    expect(namespace('*').match('')).toBe(true);
    expect(namespace('*').match('*')).toBe(true);

    expect(namespace('a').match('*')).toBe(true);
    expect(namespace('*').match('b')).toBe(true);

    expect(namespace('a.b.c').match('*')).toBe(true);
    expect(namespace('a.b.c').match('a.*')).toBe(true);
    expect(namespace('a.b.c').match('a.b')).toBe(false);
    expect(namespace('a.b.*').match('a.b')).toBe(false);

    expect(namespace('*').match('a.b.c')).toBe(true);
    expect(namespace('a.*').match('a.b.c')).toBe(true);
    expect(namespace('a.b').match('a.b.c')).toBe(false);
    expect(namespace('a.b').match('a.b.*')).toBe(false);

    expect(namespace('a.b').match('a.b')).toBe(true);
    expect(namespace('a.b.c').match('a.b.*')).toBe(true);
    expect(namespace('a.b.*').match('a.b.c')).toBe(true);
    expect(namespace('a.b.*').match('a.b.*')).toBe(true);
    expect(namespace('a.b.c').match('a.b.d')).toBe(false);
    expect(namespace('c.b.a').match('a.b.d')).toBe(false);
  });

  test(' - opt', () => {
    expect(namespace('a-b', { sep: '-' }).match('a-b')).toBe(true);
    expect(namespace('a-b-c', { sep: '-' }).match('a-b-*')).toBe(true);
    expect(namespace('a-b-*', { sep: '-' }).match('a-b-c')).toBe(true);
    expect(namespace('a-b-$', { sep: '-', wil: '$' }).match('a-b-$')).toBe(true);
    expect(namespace('a-$', { sep: '-', wil: '$' }).match('a-b')).toBe(true);
    expect(namespace('a-b-$', { sep: '-', wil: '$' }).match('a-b')).toBe(false);
  });

  test(' - exception input', () => {
    expect(namespace('a.*.c').match('a.b.c')).toBe(true);
    expect(namespace('a.*.*').match('a.b.c')).toBe(true);
    expect(namespace('*.*.*').match('a.b.c')).toBe(true);
    expect(namespace('*.b.*').match('a.b.c')).toBe(true);

    expect(namespace('*.a.*').match('a.b.c')).toBe(false);
    expect(namespace('a.*.d').match('a.b.c')).toBe(false);

    const error = 'namespace shoule be a string.';
    expect(function() { namespace(null).match(''); }).toThrow(Error, error);
    expect(function() { namespace(null).match(null); }).toThrow(Error, error);
    expect(function() { namespace(null).match(); }).toThrow(Error, error);
    expect(function() { namespace().match(); }).toThrow(Error, error);
    expect(function() { namespace().match(''); }).toThrow(Error, error);
    expect(function() { namespace('').match(); }).toThrow(Error, error);
    expect(function() { namespace(1).match(''); }).toThrow(Error, error);
    expect(function() { namespace().match(1); }).toThrow(Error, error);
  });
});