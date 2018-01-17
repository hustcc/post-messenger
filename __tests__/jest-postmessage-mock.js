/**
 * Mock postMessage
 * Created by hustcc on 18/1/8.
 * Contract: i@hust.cc
 */
import mitt from 'mitt'

const emitter = mitt();

const mockPostMessage = win => {
  win.postMessage = (message, origin) => {
    emitter.emit('message', message);
  }
};

const mockEvent = win => {
  const addEventListener = win.addEventListener;
  const removeEventListener = win.removeEventListener;

  win.addEventListener = (eventName, listener, useCapture) => {
    if (eventName === 'message') {
      // 使用 mitt 代替
      emitter.on(eventName, message => {
        listener({
          data: message,
        });
      });
    } else {
      addEventListener(eventName, listener, useCapture);
    }
  };

  win.removeEventListener = (eventName, listener) => {
    if (eventName === 'message') {
      // 使用 mitt 代替
      emitter.off(eventName, listener);
    } else {
      removeEventListener(eventName, listener);
    }
  }
};

const mockWindow = win => {
  mockEvent(win);
  mockPostMessage(win);
  return win;
};

// mock global window
global.window = mockWindow(window);
