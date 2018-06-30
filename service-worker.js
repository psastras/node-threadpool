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
    "revision": "b3d216f4931b009fd7a87c5232973858"
  },
  {
    "url": "advanced-usage.html",
    "revision": "46032d6788198994c3c6866e09a10668"
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
    "url": "assets/js/1.1a225d14.js",
    "revision": "d8d120839ee094bd46dbf7078730afd6"
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
    "url": "assets/js/4.c0fc3d12.js",
    "revision": "cfc0cfe7935ddb9cd4c74299de758e4b"
  },
  {
    "url": "assets/js/app.203b2191.js",
    "revision": "ee2e300c8dddada27a77422035fffac2"
  },
  {
    "url": "examples.html",
    "revision": "bd391efcb2fbd3d0bdfd09c8dade9897"
  },
  {
    "url": "index.html",
    "revision": "3cbc737d53b532c95374b1588c5c8c3d"
  },
  {
    "url": "installation.html",
    "revision": "2b8c903389e0a62d2ab21ac101c46f3f"
  },
  {
    "url": "usage.html",
    "revision": "d678cbdebb1f2810e2ea26ca12f304bd"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.suppressWarnings();
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
