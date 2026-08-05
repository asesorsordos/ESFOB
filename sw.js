// Nombre de la caché
const CACHE_NAME = 'esfob-v2';

// Detectar automáticamente la ruta base de GitHub Pages (/ESFOB/)
const GH_PATH = location.pathname.substring(0, location.pathname.lastIndexOf('/'));

// Archivos exactos que se van a guardar
const ASSETS = [
    GH_PATH + '/',
    GH_PATH + '/index.html',
    GH_PATH + '/manifest.json'
];

// 1. Instalar y guardar en caché
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('Caché guardada en:', GH_PATH);
            return cache.addAll(ASSETS);
        })
    );
    self.skipWaiting();
});

// 2. Activar y limpiar cachés anteriores
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

// 3. Responder desde la caché cuando no hay red
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});