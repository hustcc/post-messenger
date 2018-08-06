/**
 * Created by hustcc on 18/1/8.
 * Contract: i@hust.cc
 */

import Messenger from '../src/Messenger';

let messenger = null;

beforeEach(() => {
  messenger = Messenger('projectId', window);
});

describe('Messenger', () => {
  test('selector', done => {
    const m = Messenger('projectId', document.querySelector('#iframe_id').contentWindow);
    expect(m.getListener()).toBe(null);
    m.once('*', message => {
      expect(message).toEqual({ hello: 'world' });
      expect(m.channelListeners.length).toBe(0);
      done();
    });
    m.send('a.b', { hello: 'world' });
    expect(m.getListener()).toBe(null);
  });

  test('once', done => {
    expect(messenger.getListener()).toBe(null);
    messenger.once('*', message => {
      expect(message).toEqual({ hello: 'world' });
      expect(messenger.channelListeners.length).toBe(0);
      done();
    });
    messenger.send('a.b', { hello: 'world' });
    expect(messenger.getListener()).toBe(null);
  });

  test('on', done => {
    expect(messenger.getListener()).toBe(null);
    messenger.on('a.b', message => {
      expect(message).toEqual({ hello: 'world' });
      expect(messenger.channelListeners.length).toBe(1);
      done();
    });
    messenger.send('a.b', { hello: 'world' });
    expect(messenger.getListener()).not.toBe(null);
  });

  test('off', done => {
    messenger.on('a.b', message => {
      expect(message).toEqual({ hello: 'world' });
      expect(messenger.channelListeners.length).toBe(1);
      done();
    });
    messenger.send('a.*', { hello: 'world' });

    messenger.off(); // 取消所有
    expect(messenger.getListener()).toBe(null);
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
    expect(messenger.getListener()).toBe(null);
    const l1 = jest.fn();
    const l2 = jest.fn();
    messenger.on('a.b', l1);
    expect(messenger.getListener()).not.toBe(null);
    expect(messenger.channelListeners.length).toBe(1);
    messenger.once('a', l2);
    expect(messenger.getListener()).not.toBe(null);
    expect(messenger.channelListeners.length).toBe(2);

    messenger.off('a.b', l1);
    expect(messenger.getListener()).not.toBe(null);
    expect(messenger.channelListeners.length).toBe(1);
    messenger.off('a.b', l2);
    expect(messenger.getListener()).not.toBe(null);
    expect(messenger.channelListeners.length).toBe(1);
    messenger.off('a', l2);
    expect(messenger.getListener()).toBe(null);
    expect(messenger.channelListeners.length).toBe(0);
  });

  // exception
  test('exception', () => {
    expect(() => {
      Messenger('');
    }).not.toThrow();

    expect(() => {
      Messenger('').send('a', 1);
    }).toThrow('Messenger\'s target should has `postMessage` function.');
  });
});
