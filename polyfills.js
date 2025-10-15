// Polyfill for matchMedia (required for Tamagui on React Native)
if (typeof window === 'undefined') {
  global.window = {};
}

if (!global.window.matchMedia) {
  global.window.matchMedia = (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => true,
  });
}
