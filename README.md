# post-messenger [![npm](https://img.shields.io/npm/v/post-messenger.svg)](https://www.npmjs.com/package/post-messenger)

> A simple wrapper of window.postMessage for iframes.


## Install

> npm i --save post-messenger

or import it by `script` in HTML.


## Usage

Show you the demo code.

```js
import PostMessenger from 'post-messenger';

const messenger = new PostMessenger('uniqueId', window.iframe_name);

const listener = message => {
  console.log(message);
}
messenger.on('iframe1.*', listener);

messenger.send('parent', 'Hello world.');

messenger.off(listener);
```


## API

There is only one class named `PostMessenger`, you can get the instance by:

```js
// projectId is a unique id for namespance.
// targetDocument is parent window or the iframe which you want to send message.

const messenger = new PostMessenger(projectId, targetDocument);
```

The instance has 3 apis.

 - **messenger.on(channel, listener)**: add one message listener on channel.
 - **messenger.off([listener])**: remove listener, if listener is undefined, remove all.
 - **messenger.send(channel, message)**: send one message to channel.


# License

MIT
