import { BrowserRouter, Route, Routes } from 'react-router-dom';
import {
    Chat,
    ChatBot,
    FormCreate,
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
} from '@/pages';
import Transaction from '@/pages/transaction/Transaction';
import LayoutProvider from './provider/LayoutProvider';

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<LayoutProvider />}>
                    <Route path='/form' element={<FormMatch />} />
                    <Route path='/form/create' element={<FormCreate />} />
                    <Route path='/transaction' element={<Transaction />} />
                    <Route path='/contract' element={<Contract />} />
                    <Route
                        path='/contract/:contractId'
                        element={<ContractDetail />}
                    />
                    <Route path='/' element={<Home />} />
                    <Route path='/landing' element={<Landing />} />
                    <Route path='/login' element={<Login />} />
                    <Route path='/login/signup' element={<Signup />} />
                    <Route path='/login/findPw' element={<PhoneVerify />} />
                    <Route
                        path='/login/findPw/reset'
                        element={<PasswordReset />}
                    />
                    <Route path='/chatbot' element={<ChatBot />} />
                    <Route path='/chat' element={<Chat />} />
                    <Route path='/account' element={<AccountRegist />} />
                    <Route path='/account/verify' element={<AccountVerify />} />
                    <Route
                        path='/account/password'
                        element={<AccountPassword />}
                    />
                    <Route path='/myinfo' element={<MyInfo />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

export default App;
