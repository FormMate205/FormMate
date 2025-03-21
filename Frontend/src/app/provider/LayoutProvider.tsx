import { Outlet } from 'react-router-dom';

const LayoutProvider = () => {
    return (
        <div className='flex min-h-screen w-full justify-center'>
            <div className='min-h-screen w-full max-w-sm overflow-y-auto'>
                <Outlet />
            </div>
        </div>
    );
};

export default LayoutProvider;
