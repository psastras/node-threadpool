/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("https://storage.googleapis.com/workbox-cdn/releases/3.3.1/workbox-sw.js");

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [
  {
    "url": "404.html",
    "revision": "a821fb49b5445b1c7d0a8a5ca960c626"
  },
  {
    "url": "advanced-usage.html",
    "revision": "b76ede5d87620a164de30a2f472bfc9a"
  },
  {
    "url": "assets/css/5.styles.aadff285.css",
    "revision": "0160bf85c09789bc0e6ba87aaa0f57eb"
  },
  {
    "url": "assets/img/search.83621669.svg",
    "revision": "83621669651b9a3d4bf64d1a670ad856"
  },
  {
    "url": "assets/js/0.754dcb0b.js",
    "revision": "50e04a97f966c41bade6e76164508882"
  },
  {
    "url": "assets/js/1.7e5ebd19.js",
    "revision": "1a1037f758a9dfcb999389b7c78f3ef4"
  },
  {
    "url": "assets/js/2.b1534575.js",
    "revision": "15fc2860d8ece82829b717d3cb697479"
  },
  {
    "url": "assets/js/3.1a8f0c72.js",
    "revision": "49ea06b19e30201a7ddc18743c2825dc"
  },
  {
    "url": "assets/js/4.76eb9d95.js",
    "revision": "38a1c4849cefc1ca557f6ed1a45d17a6"
  },
  {
    "url": "assets/js/app.7afa63a1.js",
    "revision": "2c30327ecb2833a51a440ff50f77285c"
  },
  {
    "url": "examples.html",
    "revision": "7ec7b69d8450c4f1cb3296745e236704"
  },
  {
    "url": "index.html",
    "revision": "7fa410a4c36ce0db90a5e76f857afe2c"
  },
  {
    "url": "installation.html",
    "revision": "625e9db79d7926bc6ae3af390614185a"
  },
  {
    "url": "usage.html",
    "revision": "c1a37fd7c186061d8bb044f19cc94dbb"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.suppressWarnings();
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
