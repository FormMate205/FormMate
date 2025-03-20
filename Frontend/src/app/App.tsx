import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { FormCreate, FormMatch } from '../pages';
import LayoutProvider from './provider/LayoutProvider';

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<LayoutProvider />}>
                    <Route path='/form' element={<FormMatch />} />
                    <Route path='/form/create' element={<FormCreate />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

export default App;
