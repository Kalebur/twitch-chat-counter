function injectStyles(styles, targetElement) {
  const newStyleElement = document.createElement("style");
  if (Array.isArray(styles)) {
    injectStylesFromArray(styles, newStyleElement);
  } else if (styles.constructor == Object) {
    injectStylesFromDictionary(styles, newStyleElement);
  }
  targetElement.appendChild(newStyleElement);
}

function injectStylesFromArray(styles, targetElement) {
  for (const style of styles) {
    targetElement.innerHTML += style;
  }
}

function injectStylesFromDictionary(styles, targetElement) {
  for (const [key, value] of Object.entries(styles)) {
    targetElement.innerHTML += value;
  }
}
