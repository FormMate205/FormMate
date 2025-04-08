import { Outlet } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { useUserService } from '@/entities/user/model/userService';

const LayoutProvider = () => {
    useUserService(); // 일반 로그인 상태 확인

    return (
        <div className='flex min-h-screen w-full justify-center'>
            <div className='min-h-screen w-full max-w-[640px] overflow-y-auto'>
                <Outlet />
                <Toaster
                    position='top-right'
                    toastOptions={{
                        style: {
                            marginTop: '8px', // 헤더 높이에 맞게 조정
                        },
                    }}
                />
            </div>
        </div>
    );
};

export default LayoutProvider;
