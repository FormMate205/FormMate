self.importScripts(
    'https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js',
);
self.importScripts(
    'https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js',
);

let messagingInitialized = false;

self.addEventListener('message', function (event) {
    if (event.data && event.data.type === 'FIREBASE_CONFIG') {
        if (!messagingInitialized) {
            self.firebase.initializeApp(event.data.config);
            const messaging = self.firebase.messaging();
            messagingInitialized = true;

            messaging.onBackgroundMessage(function (payload) {
                console.log(
                    '[firebase-messaging-sw.js] 백그라운드 메시지:',
                    payload,
                );

                const { title, body, image, tag } = payload.notification;

                const notificationOptions = {
                    body,
                    tag,
                };
                self.registration.showNotification(title, notificationOptions);
            });
        }
    }
});
