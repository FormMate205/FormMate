import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LayoutProvider from './provider/LayoutProvider';
import FormCreate from '../pages/form/FormCreate';
import Transaction from '../pages/transaction/Transaction';
import Login from '../pages/login/Login';
import Landing from '../pages/login/Landing';

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<LayoutProvider />}>
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
