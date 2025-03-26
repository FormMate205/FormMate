import { BrowserRouter, Route, Routes } from 'react-router-dom';
import {
    Chat,
    FormMatch,
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
    Contract,
    FormCheck,
    FormCreate,
    UserPasswordUpdate,
    PasswordPhoneVerify,
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
                    <Route path='/contract' element={<Contract />} />
                    <Route
                        path='/contract/:contractId'
                        element={<ContractDetail />}
                    />
                    <Route path='/' element={<Home userName='' />} />
                    <Route path='/landing' element={<Landing />} />
                    <Route path='/login' element={<Login />} />
                    <Route path='/landing/signup' element={<Signup />} />
                    <Route path='/login/findPw' element={<PhoneVerify />} />
                    <Route
                        path='/login/findPw/reset'
                        element={<PasswordReset />}
                    />
                    <Route path='/form/create' element={<FormCreate />} />
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
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

export default App;
