# post-messenger

> A simple wrapper of window.postMessage for iframes.


## Install

> npm i --save post-messenger

or import it by `script` in HTML.


## Usage

```js
import PostMessenger from 'post-messenger';

const messenger = new PostMessenger('uniqueId', window.iframe_name);

messenger.on((message) => {
  console.log(message);
});

messenger.send('Hello world.');

messenger.off();
```

## TODO

 - Multiple listeners, and channel of message.


# License

MIT
