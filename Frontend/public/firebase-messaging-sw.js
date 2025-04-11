self.importScripts(
    'https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js',
);
self.importScripts(
    'https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js',
);

let messagingInitialized = false;

// 서비스 워커 설치 이벤트
self.addEventListener('install', (event) => {
    self.skipWaiting();
});

// 서비스 워커 활성화 이벤트
self.addEventListener('activate', (event) => {
    event.waitUntil(clients.claim());
});

// 메시지 이벤트 리스너
self.addEventListener('message', function (event) {
    if (event.data && event.data.type === 'FIREBASE_CONFIG') {
        if (!messagingInitialized) {
            self.firebase.initializeApp(event.data.config);
            const messaging = self.firebase.messaging();
            messagingInitialized = true;

            messaging.onBackgroundMessage(function (payload) {
                const { title, body, image } = payload.notification;
                self.registration.showNotification(title, {
                    body,
                    icon: '/favicon.ico',
                    badge: '/favicon.ico',
                    image: image,
                });
            });
        }
    }
});

// 푸시 이벤트 리스너 - 초기 평가 시점에 등록
self.addEventListener('push', function (event) {
    if (event.data) {
        const payload = event.data.json();
        const { title, body, image } = payload.notification;
        self.registration.showNotification(title, {
            body,
            icon: '/favicon.ico',
            badge: '/favicon.ico',
            image: image,
        });
    }
});

// 알림 클릭 이벤트 - 초기 평가 시점에 등록
self.addEventListener('notificationclick', function (event) {
    event.notification.close();
    event.waitUntil(
        clients.matchAll({ type: 'window' }).then(function (clientList) {
            for (const client of clientList) {
                if (client.url === '/' && 'focus' in client) {
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow('/notifications');
            }
        }),
    );
});
