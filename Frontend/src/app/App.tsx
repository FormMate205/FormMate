import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LayoutProvider from './provider/LayoutProvider';
import { FormCreate } from '../pages';

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<LayoutProvider />}>
                    <Route path='/form/create' element={<FormCreate />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

export default App;
