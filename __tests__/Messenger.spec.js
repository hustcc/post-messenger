/**
 * Created by hustcc on 18/1/8.
 * Contract: i@hust.cc
 */

import Messenger from '../src/Messenger';

let messenger = null;

beforeEach(() => {
  messenger = new Messenger('projectId', window);
});

describe('Messenger', () => {
  test('selector', done => {
    const m = new Messenger('projectId', '#iframe_id');
    expect(m.listener).toBe(null);
    m.once('*', message => {
      expect(message).toEqual({ hello: 'world' });
      expect(m.channelListeners.length).toBe(0);
      done();
    });
    m.send('a.b', { hello: 'world' });
    expect(m.listener).toBe(null);
  });

  test('once', done => {
    expect(messenger.listener).toBe(null);
    messenger.once('*', message => {
      expect(message).toEqual({ hello: 'world' });
      expect(messenger.channelListeners.length).toBe(0);
      done();
    });
    messenger.send('a.b', { hello: 'world' });
    expect(messenger.listener).toBe(null);
  });

  test('on', done => {
    expect(messenger.listener).toBe(null);
    messenger.on('a.b', message => {
      expect(message).toEqual({ hello: 'world' });
      expect(messenger.channelListeners.length).toBe(1);
      done();
    });
    messenger.send('a.b', { hello: 'world' });
    expect(messenger.listener).not.toBe(null);
  });

  test('off', done => {
    messenger.on('a.b', message => {
      expect(message).toEqual({ hello: 'world' });
      expect(messenger.channelListeners.length).toBe(1);
      done();
    });
    messenger.send('a.*', { hello: 'world' });

    messenger.off(); // 取消所有
    expect(messenger.listener).toBe(null);
  });

  test('namespace not match', done => {
    messenger.on('a.b', message => {
      done();
    });
    messenger.send('a.b', { hello: 'world' });
    messenger.send('a.c', { hello: 'alipay' });
  });

  // when no listener, remove message listener
  test('message listener', () => {
    expect(messenger.listener).toBe(null);
    const l1 = jest.fn();
    const l2 = jest.fn();
    messenger.on('a.b', l1);
    expect(messenger.listener).not.toBe(null);
    expect(messenger.channelListeners.length).toBe(1);
    messenger.once('a', l2);
    expect(messenger.listener).not.toBe(null);
    expect(messenger.channelListeners.length).toBe(2);

    messenger.off('a.b', l1);
    expect(messenger.listener).not.toBe(null);
    expect(messenger.channelListeners.length).toBe(1);
    messenger.off('a.b', l2);
    expect(messenger.listener).not.toBe(null);
    expect(messenger.channelListeners.length).toBe(1);
    messenger.off('a', l2);
    expect(messenger.listener).toBe(null);
    expect(messenger.channelListeners.length).toBe(0);
  });

  // exception
  test('exception', () => {
    expect(() => {
      new Messenger('');
    }).toThrow('Messenger\'s target should be a contentWindow.');
  });
});
