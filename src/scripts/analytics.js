/**
 * Google Analytics module
 */

globalThis.dataLayer = globalThis.dataLayer || [];

function gtag(...args) {
  globalThis.dataLayer.push(args);
}

gtag("js", new Date());
gtag("config", "G-VXX28RMKDT");
