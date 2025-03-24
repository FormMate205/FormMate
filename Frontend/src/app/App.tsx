import { BrowserRouter, Route, Routes } from 'react-router-dom';
import {
    Chat,
    ChatBot,
    FormCreate,
    FormMatch,
    Home,
    Login,
    Landing,
} from '@/pages';
import PasswordReset from '@/pages/password/PasswordReset';
import PhoneVerify from '@/pages/password/PhoneVerify';
import Signup from '@/pages/signup/Signup';
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
                    <Route path='/login' element={<Login />} />
                    <Route path='/' element={<Landing />} />
                    <Route path='/signup' element={<Signup />} />
                    <Route path='/chatbot' element={<ChatBot />} />
                    <Route path='/chat' element={<Chat />} />
                    <Route path='/login/findPw' element={<PhoneVerify />} />
                    <Route
                        path='/login/findPw/reset'
                        element={<PasswordReset />}
                    />
                    <Route path='/home' element={<Home />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

export default App;
