import { Signature } from 'lucide-react';
import { createBrowserRouter } from 'react-router-dom';
import {
    Chat,
    Home,
    Login,
    Landing,
    Signup,
    PasswordReset,
    PhoneVerify,
    ContractDetail,
    AccountRegist,
    AccountVerify,
    AccountPassword,
    MyInfo,
    UserPasswordUpdate,
    PasswordPhoneVerify,
    FormMatch,
    FormCheck,
    FormDraft,
    Contracts,
    Notifications,
    TransferComplete,
    SelectRecipient,
    EnterAmount,
    EnterPassword,
    OauthAddInfoPage,
    ChatRooms,
} from '@/pages';
import OAuthCallback from '@/pages/login/OAuthCallback';
import Transaction from '@/pages/transaction/Transaction';
import { ErrorFallBack } from '@/shared/ui/ErrorFallBack';
import FormDraftLanding from '@/widgets/landing/FormDraftLanding';
import LayoutProvider from './provider/LayoutProvider';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <LayoutProvider />,
        errorElement: <ErrorFallBack />,
        children: [
            // 홈, 회원가입, 로그인
            { path: '/', element: <Home userName='' /> },
            { path: '/landing', element: <Landing /> },
            { path: '/landing/signup', element: <Signup /> },
            { path: '/login', element: <Login /> },
            { path: '/login/findPw', element: <PhoneVerify /> },
            {
                path: '/login/findPw/reset',
                element: <PasswordReset />,
            },
            {
                path: '/login/oauthInfo',
                element: <OauthAddInfoPage />,
            },
            { path: '/oauth/callback', element: <OAuthCallback /> },

            // 계약 생성
            { path: '/form', element: <FormMatch /> },
            { path: '/form/check', element: <FormCheck /> },
            {
                path: '/draft/landing',
                element: <FormDraftLanding />,
            },
            { path: '/draft', element: <FormDraft /> },

            // 채팅
            { path: '/chat', element: <ChatRooms /> },
            { path: '/chat/:roomId', element: <Chat /> },

            // 전자 서명
            { path: '/signature', element: <Signature /> },

            // 계약 관리
            { path: '/transaction', element: <Transaction /> },
            { path: '/contracts', element: <Contracts /> },
            {
                path: '/contracts/:formId',
                element: <ContractDetail />,
            },
            { path: '/notifications', element: <Notifications /> },
            { path: '/account', element: <AccountRegist /> },
            { path: '/account/verify', element: <AccountVerify /> },
            {
                path: '/account/password',
                element: <AccountPassword />,
            },
            { path: '/myinfo', element: <MyInfo /> },
            {
                path: '/myinfo/password',
                element: <UserPasswordUpdate />,
            },
            {
                path: '/myinfo/password/findPw',
                element: <PasswordPhoneVerify />,
            },
            { path: '/transfer', element: <SelectRecipient /> },
            {
                path: '/transfer/complete',
                element: <TransferComplete />,
            },
            {
                path: '/transfer/password',
                element: <EnterPassword />,
            },
            { path: '/transfer/amount', element: <EnterAmount /> },
        ],
    },
]);
