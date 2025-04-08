import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { getDeviceToken, registerServiceWorker } from '@/lib/firebase';
import { router } from './router';

const App = () => {
    useEffect(() => {
        const isSafePath = !(
            window.location.pathname.startsWith('/oauth2/authorization') ||
            window.location.pathname.startsWith('/landing')
        );
        if (isSafePath) {
            registerServiceWorker();
            getDeviceToken();
        }
    }, []);

    return <RouterProvider router={router} />;
};

export default App;
