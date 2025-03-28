import { BrowserRouter, Route, Routes } from 'react-router-dom';
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
    FormDraftLanding,
} from '@/pages';
import Transaction from '@/pages/transaction/Transaction';
import LayoutProvider from './provider/LayoutProvider';

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<LayoutProvider />}>
                    <Route path='/form' element={<FormMatch />} />
                    <Route path='/form/check' element={<FormCheck />} />
                    <Route path='/transaction' element={<Transaction />} />
                    <Route path='/contracts' element={<Contracts />} />
                    <Route
                        path='/contracts/:contractId'
                        element={<ContractDetail />}
                    />
                    <Route path='/notifications' element={<Notifications />} />
                    <Route path='/' element={<Home userName='' />} />
                    <Route path='/landing' element={<Landing />} />
                    <Route path='/login' element={<Login />} />
                    <Route path='/landing/signup' element={<Signup />} />
                    <Route path='/login/findPw' element={<PhoneVerify />} />
                    <Route
                        path='/login/findPw/reset'
                        element={<PasswordReset />}
                    />
                    <Route
                        path='/draft/landing'
                        element={<FormDraftLanding />}
                    />
                    <Route path='/draft' element={<FormDraft />} />
                    <Route path='/chat' element={<Chat />} />
                    <Route path='/account' element={<AccountRegist />} />
                    <Route path='/account/verify' element={<AccountVerify />} />
                    <Route
                        path='/account/password'
                        element={<AccountPassword />}
                    />
                    <Route path='/myinfo' element={<MyInfo />} />
                    <Route
                        path='/myinfo/password'
                        element={<UserPasswordUpdate />}
                    />
                    <Route
                        path='/myinfo/password/findPw'
                        element={<PasswordPhoneVerify />}
                    />
                    <Route path='/transfer' element={<SelectRecipient />} />
                    <Route
                        path='/transfer/complete'
                        element={<TransferComplete />}
                    />
                    <Route
                        path='/transfer/password'
                        element={<EnterPassword />}
                    />
                    <Route path='/transfer/amount' element={<EnterAmount />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

export default App;
