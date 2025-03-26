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
    ContractList,
    ContractDetail,
    AccountRegist,
    AccountVerify,
    AccountPassword,
    FormCheck,
    FormCreate,
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
                    <Route path='/contract' element={<ContractList />} />
                    <Route
                        path='/contract/detail'
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
                    <Route path='/form/create' element={<FormCreate />} />
                    <Route path='/chat' element={<Chat />} />
                    <Route path='/account' element={<AccountRegist />} />
                    <Route path='/account/verify' element={<AccountVerify />} />
                    <Route
                        path='/account/password'
                        element={<AccountPassword />}
                    />
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

export default App;
