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
    "revision": "0b4030831dcc73d245d1d1b6029359fb"
  },
  {
    "url": "advanced-usage.html",
    "revision": "ca59d5dc5ba2d5b5134b6d42b863fe26"
  },
  {
    "url": "assets/css/5.styles.81009e00.css",
    "revision": "0400f5e3e8226522d642a653cd2e113e"
  },
  {
    "url": "assets/img/search.83621669.svg",
    "revision": "83621669651b9a3d4bf64d1a670ad856"
  },
  {
    "url": "assets/js/0.cfb2b095.js",
    "revision": "b455529901b51f531579571c97d9437f"
  },
  {
    "url": "assets/js/1.c4614d47.js",
    "revision": "d15809f08aefda1b6233b61b62019432"
  },
  {
    "url": "assets/js/2.41244517.js",
    "revision": "9c5fbcc1a76ea1993a59a22c7e39049f"
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
    "url": "assets/js/app.8926b57b.js",
    "revision": "c327024f375767acd7636fefe4266ddb"
  },
  {
    "url": "examples.html",
    "revision": "2fa14b84186fedc57ca5e51dbea29013"
  },
  {
    "url": "index.html",
    "revision": "e1458e4cd7ed48a3b8d02f469733c7f1"
  },
  {
    "url": "installation.html",
    "revision": "4c9a840b26ee40584dc27dd88b83023b"
  },
  {
    "url": "usage.html",
    "revision": "346ecff9a77cb20309ba2a99d9f5f2ed"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.suppressWarnings();
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
