import { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { Login, Home, ChatRooms } from '@/pages';
import OAuthCallback from '@/pages/login/OAuthCallback';
import Transaction from '@/pages/transaction/Transaction';
import { ErrorFallBack } from '@/shared/ui/ErrorFallBack';
import LayoutProvider from './provider/LayoutProvider';

const Signup = lazy(() => import('@/pages/signup/Signup'));
const PasswordPhoneVerify = lazy(() => import('@/pages/password/PhoneVerify'));
const PasswordReset = lazy(() => import('@/pages/password/PasswordReset'));
const OauthAddInfoPage = lazy(() => import('@/pages/signup/OauthAddInfo'));

const FormMatch = lazy(() => import('@/pages/formPartner/FormMatch'));
const FormCheck = lazy(() => import('@/pages/formPartner/FormCheck'));

const FormDraftLanding = lazy(
    () => import('@/widgets/landing/FormDraftLanding'),
);
const FormDraft = lazy(() => import('@/pages/formDraft/FormDraft'));

const Chat = lazy(() => import('@/pages/chat/Chat'));
const Signature = lazy(() => import('@/pages/signature/Signature'));

const Contracts = lazy(() => import('@/pages/contract/Contracts'));
const ContractDetail = lazy(() => import('@/pages/contract/ContractDetail'));

const AccountRegist = lazy(() => import('@/pages/account/AccountRegist'));
const AccountVerify = lazy(() => import('@/pages/account/AccountVerify'));
const AccountPassword = lazy(() => import('@/pages/account/AccountPassword'));

const MyInfo = lazy(() => import('@/pages/myinfo/MyInfo'));
const UserPasswordUpdate = lazy(
    () => import('@/pages/myinfo/UserPasswordUpdate'),
);

const Notifications = lazy(() => import('@/pages/notification/Notifiactions'));

const Transfer = lazy(() => import('@/pages/transfer/Transfer'));

export const router = createBrowserRouter([
    {
        path: '/',
        element: <LayoutProvider />,
        errorElement: <ErrorFallBack />,
        children: [
            // 홈
            { index: true, element: <Home userName='' /> },

            // 로그인, 회원가입
            {
                path: 'login',
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
            { path: 'oauth/callback', element: <OAuthCallback /> },

            // 계약 상대 찾기
            {
                path: 'form',
                children: [
                    {
                        index: true,
                        element: <FormMatch />,
                    },
                    {
                        path: 'check',
                        element: <FormCheck />,
                    },
                ],
            },

            // 계약 생성
            {
                path: 'draft/landing',
                element: <FormDraftLanding />,
            },
            { path: 'draft', element: <FormDraft /> },

            // 채팅
            {
                path: 'chat',
                children: [
                    {
                        index: true,
                        element: <ChatRooms />,
                    },
                    {
                        path: ':roomId',
                        element: <Chat />,
                    },
                    {
                        path: ':roomId/signature',
                        element: <Signature />,
                    },
                ],
            },

            // 계약 관리
            { path: 'transaction', element: <Transaction /> },
            {
                path: 'contracts',
                children: [
                    {
                        index: true,
                        element: <Contracts />,
                    },
                    {
                        path: ':formId',
                        element: <ContractDetail />,
                    },
                ],
            },

            // 계좌
            {
                path: 'account',
                children: [
                    {
                        index: true,
                        element: <AccountRegist />,
                    },
                    { path: 'verify', element: <AccountVerify /> },
                    {
                        path: 'password',
                        element: <AccountPassword />,
                    },
                ],
            },

            // 송금
            { path: 'transfer', element: <Transfer /> },

            // 내 정보
            {
                path: 'myinfo',
                children: [
                    {
                        index: true,
                        element: <MyInfo />,
                    },
                    {
                        path: 'password',
                        element: <UserPasswordUpdate />,
                    },
                    {
                        path: 'password/findPw',
                        element: <PasswordPhoneVerify />,
                    },
                ],
            },

            // 알림
            { path: 'notifications', element: <Notifications /> },
        ],
    },
]);
