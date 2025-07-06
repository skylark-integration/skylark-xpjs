const ASSET_VERSION = '2.0.0';
const ASSET_PATHS_TO_VERSION = [
    '/js/',
    '/js/apps/',
    '/js/appstore/',
    '/css/',
    '/res/data/',
    '/res/sites/'
];

const FILE_EXTENSIONS_TO_VERSION = ['.js', '.css', '.html'];

const SPECIFIC_FILES_TO_VERSION = [
    '/res/data/drive_c_system.json',
    '/res/data/drive_e_goodies.json'
];

self.addEventListener('install', event => {
    console.log(`SW (Asset Version: ${ASSET_VERSION}): Installing...`);
    event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', event => {
    console.log(`SW (Asset Version: ${ASSET_VERSION}): Activating...`);
    event.waitUntil(self.clients.claim());
    console.log(`SW (Asset Version: ${ASSET_VERSION}): Clients claimed.`);
});

self.addEventListener('fetch', event => {
    const requestUrl = new URL(event.request.url);

    if (requestUrl.origin !== self.origin) {
        return;
    }

    if (event.request.method !== 'GET') {
        return;
    }

    let shouldVersionRequest = false;

    if (SPECIFIC_FILES_TO_VERSION.includes(requestUrl.pathname)) {
        shouldVersionRequest = true;
    } else {
        const isPathMatch = ASSET_PATHS_TO_VERSION.some(pathPrefix => requestUrl.pathname.startsWith(pathPrefix));
        const isExtensionMatch = FILE_EXTENSIONS_TO_VERSION.some(ext => requestUrl.pathname.endsWith(ext));
        shouldVersionRequest = isPathMatch && isExtensionMatch;
    }

    if (shouldVersionRequest) {
        const newUrl = new URL(requestUrl.toString());
        newUrl.searchParams.delete('v');
        newUrl.searchParams.append('v', ASSET_VERSION);

        event.respondWith(
            fetch(newUrl.toString())
            .catch(error => {
                console.error(`SW: Fetch failed for versioned asset ${newUrl.toString()}:`, error);
                console.warn(`SW: Falling back to original request for ${event.request.url}`);
                return fetch(event.request);
            })
        );
    } else {
        return;
    }
});