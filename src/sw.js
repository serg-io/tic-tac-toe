/* eslint-env serviceworker */
/* eslint-disable no-restricted-globals */

/**
 * "files" and "version" will be replaced by the prebuild script.
 */
const FILES = '{{ files }}'.split(',');
const CACHE = 'tic-tac-toe-v{{ version }}';

/**
 * Cache all `FILES` when the service worker is installed.
 */
self.oninstall = (event) => {
	event.waitUntil(
		caches.open(CACHE).then(cache => cache.addAll(FILES)),
	);
};

/**
 * When the service worker is activated, delete all caches except the current one (the one that
 * uses `CACHE` as its `key`).
 */
self.onactivate = (event) => {
	event.waitUntil(
		caches.keys().then((keys) => {
			const promises = keys.map((key) => {
				if (key !== CACHE) {
					return caches.delete(key);
				}

				return Promise.resolve();
			});

			return Promise.all(promises);
		}),
	);

	self.clients.claim();
};

/**
 * Intercepts all network requests to check if the requested resource is in the cache. If it is,
 * the cached resource is used, otherwise an actuall request is sent using the `fetch` function.
 */
self.onfetch = (event) => {
	const url = new URL(event.request.url);
	const request = url.pathname === '/' ? '/index.html' : event.request;

	event.respondWith(
		caches.match(request).then(response => response || fetch(event.request)),
	);
};