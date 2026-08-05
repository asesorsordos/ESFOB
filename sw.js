// Nombre del archivo de caché y lista de archivos a guardar
const CACHE_NAME = 'esfob-v1';
const ASSETS = [
    './',
    './index.html'
    // Si agregas imágenes o archivos CSS/JS externos, agrégalos aquí.
];

// 1. Instalar el Service Worker y guardar archivos en caché
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('Archivos guardados en caché correctamente');
            return cache.addAll(ASSETS);
        })
    );
    self.skipWaiting();
});

// 2. Activar y limpiar cachés antiguas si actualizas la versión
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.map((key) => {
                    if (key !== CACHE_NAME) {
                        return caches.delete(key);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// 3. Interceptar las peticiones: Servir desde la caché cuando no haya red
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            // Si está en la caché, devuélvelo; si no, búscalo en Internet
            return cachedResponse || fetch(event.request);
        })
    );
});