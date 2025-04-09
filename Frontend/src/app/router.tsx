import { Signature } from 'lucide-react';
import { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import {
    AccountRegist,
    AccountVerify,
    AccountPassword,
    UserPasswordUpdate,
    FormDraft,
    SelectRecipient,
    Login,
    FormMatch,
    Signup,
    PasswordPhoneVerify,
    PasswordReset,
    OauthAddInfoPage,
    FormCheck,
    TransferComplete,
    EnterPassword,
    EnterAmount,
    Home,
    ChatRooms,
} from '@/pages';
import OAuthCallback from '@/pages/login/OAuthCallback';
import Transaction from '@/pages/transaction/Transaction';
import { ErrorFallBack } from '@/shared/ui/ErrorFallBack';
import FormDraftLanding from '@/widgets/landing/FormDraftLanding';
import LayoutProvider from './provider/LayoutProvider';

const Chat = lazy(() => import('@/pages/chat/Chat'));

const Contracts = lazy(() => import('@/pages/contract/Contracts'));
const ContractDetail = lazy(() => import('@/pages/contract/ContractDetail'));

const MyInfo = lazy(() => import('@/pages/myinfo/MyInfo'));

const Notifications = lazy(() => import('@/pages/notification/Notifiactions'));

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
            { path: 'transfer', element: <SelectRecipient /> },
            {
                path: '/transfer/complete',
                element: <TransferComplete />,
            },
            {
                path: '/transfer/password',
                element: <EnterPassword />,
            },
            { path: '/transfer/amount', element: <EnterAmount /> },

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
