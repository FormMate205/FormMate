// src/firebase.ts
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken } from 'firebase/messaging';

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);
// Firebase 서비스 사용 준비
const messaging = getMessaging(app);

export async function registerServiceWorker() {
    const registration = await navigator.serviceWorker.register(
        'firebase-messaging-sw.js',
    );

    // Firebase 설정 전달
    registration.active?.postMessage({
        type: 'FIREBASE_CONFIG',
        config: firebaseConfig,
    });
}

export async function requestPermission() {
    const permission = await Notification.requestPermission();

    if (permission === 'granted') {
        const registration = await navigator.serviceWorker.getRegistration();
        if (!registration) {
            console.warn('Service worker not found.');
            return;
        }
        const currentToken = await getToken(messaging, {
            vapidKey: import.meta.env.VITE_VAPID,
            serviceWorkerRegistration: registration,
        });

        // 토큰 등록

        console.log('FCM 토큰:', currentToken);
    }
}
