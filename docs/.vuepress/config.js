module.exports = {
  title: "node-threadpool",
  base: "/node-threadpool/",
  repo: "psastras/node-threadpool",
  description: "Thread pools using native threads for node.js",
  dest: "dist/docs",
  ga: "UA-121473830-1",
  serviceWorker: true,
  evergreen: true,
  themeConfig: {
    editLinks: true,
    displayAllHeaders: true,
    nav: [
      {
        text: "API Reference",
        link: "https://psastras.github.io/node-threadpool/api"
      },
      {
        text: "Github",
        link: "https://github.com/psastras/node-threadpool"
      }
    ],
    sidebar: ["/", "installation", "usage", "advanced-usage", "examples"]
  }
};
