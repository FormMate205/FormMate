import { lazy } from 'react';
import { Login } from '@/pages';
import LayoutProvider from '../provider/LayoutProvider';

const Signup = lazy(() => import('@/pages/signup/Signup'));
const PasswordPhoneVerify = lazy(() => import('@/pages/password/PhoneVerify'));
const PasswordReset = lazy(() => import('@/pages/password/PasswordReset'));
const OauthAddInfoPage = lazy(() => import('@/pages/signup/OauthAddInfo'));

export const loginRoutes = [
    {
        path: 'login',
        element: <LayoutProvider />,
        children: [
            {
                index: true,
                element: <Login />,
            },
            {
                path: 'signup',
                element: <Signup />,
            },
            { path: 'findPw', element: <PasswordPhoneVerify /> },
            {
                path: 'findPw/reset',
                element: <PasswordReset />,
            },
            {
                path: 'oauthInfo',
                element: <OauthAddInfoPage />,
            },
        ],
    },
];
