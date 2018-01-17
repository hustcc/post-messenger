
global.window.document.querySelector = selectors => {
  return {
    contentWindow: window,
  };
};
