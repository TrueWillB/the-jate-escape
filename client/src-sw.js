const { offlineFallback, warmStrategyCache } = require("workbox-recipes");
const { CacheFirst, StaleWhileRevalidate } = require("workbox-strategies");
const { registerRoute } = require("workbox-routing");
const { CacheableResponsePlugin } = require("workbox-cacheable-response");
const { ExpirationPlugin } = require("workbox-expiration");
const { precacheAndRoute } = require("workbox-precaching/precacheAndRoute");

precacheAndRoute(self.__WB_MANIFEST);

const pageCache = new CacheFirst({
  cacheName: "page-cache",
  plugins: [
    new CacheableResponsePlugin({
      statuses: [0, 200],
    }),
    new ExpirationPlugin({
      maxAgeSeconds: 30 * 24 * 60 * 60,
    }),
  ],
});

warmStrategyCache({
  urls: ["/index.html", "/"],
  strategy: pageCache,
});
// console.log("IN THE SERVICE WORKER FILE");
registerRoute(({ request }) => request.mode === "navigate", pageCache);

// DONE: Implement asset caching
//So, the detailed explanation of what this does is:
registerRoute(
  //QUESTION: What exactly is going on in this line below?
  //Also, how do I get the image to load? And how do I get the favicon to load?

  // Here we define the callback function that will filter the requests we want to cache (in this case, JS and CSS files)
  ({ request }) => {
    console.log(request);
    return ["style", "script", "worker"].includes(request.destination);
  },
  //It seems important to always check that the assets are up to date, so I'm going to use the StaleWhileRevalidate strategy
  new StaleWhileRevalidate({
    // Name of the cache storage.
    cacheName: "asset-cache",
    plugins: [
      // This plugin will cache responses with these headers to a maximum-age of 30 days
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  })
);

//What's left, get image and icon working, get install button to go away when after installing
