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
} from '@/pages';
import Transaction from '@/pages/transaction/Transaction';
import FormDraftLanding from '@/widgets/landing/FormDraftLanding';
import LayoutProvider from './provider/LayoutProvider';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <LayoutProvider />,
        children: [
            { path: '/form', element: <FormMatch /> },
            { path: '/form/check', element: <FormCheck /> },
            { path: '/transaction', element: <Transaction /> },
            { path: '/contracts', element: <Contracts /> },
            {
                path: '/contracts/:contractId',
                element: <ContractDetail />,
            },
            { path: '/notifications', element: <Notifications /> },
            { path: '/', element: <Home userName='' /> },
            { path: '/landing', element: <Landing /> },
            { path: '/login', element: <Login /> },
            { path: '/landing/signup', element: <Signup /> },
            { path: '/login/findPw', element: <PhoneVerify /> },
            {
                path: '/login/findPw/reset',
                element: <PasswordReset />,
            },
            {
                path: '/draft/landing',
                element: <FormDraftLanding />,
            },
            { path: '/draft', element: <FormDraft /> },
            { path: '/chat', element: <Chat /> },
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
