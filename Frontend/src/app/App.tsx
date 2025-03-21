import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { FormCreate, FormMatch } from '@/pages';
import Landing from '@/pages/login/Landing';
import Login from '@/pages/login/Login';
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
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

export default App;
