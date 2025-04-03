import { Outlet } from 'react-router-dom';
import { useUserService } from '@/entities/user/model/userService';

const LayoutProvider = () => {
    // 사용자 인증 상태 확인
    useUserService();

    return (
        <div className='flex min-h-screen w-full justify-center'>
            <div className='min-h-screen w-full max-w-[640px] overflow-y-auto'>
                <Outlet />
            </div>
        </div>
    );
};

export default LayoutProvider;
