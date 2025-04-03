import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { registerServiceWorker, requestPermission } from '@/lib/firebase';
import { router } from './router';

const App = () => {
    useEffect(() => {
        registerServiceWorker();
        requestPermission();
    }, []);
    return <RouterProvider router={router} />;
};

export default App;
