import { Outlet } from 'react-router-dom';
import { useUserService } from '@/entities/user/model/userService';

const LayoutProvider = () => {
    useUserService(); // 일반 로그인 상태 확인

    return (
        <div className='flex min-h-screen w-full justify-center'>
            <div className='min-h-screen w-full max-w-[640px] overflow-y-auto'>
                <Outlet />
            </div>
        </div>
    );
};

export default LayoutProvider;
