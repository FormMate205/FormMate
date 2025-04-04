import { useLocation, useNavigate } from 'react-router-dom';
import { Icons } from '@/shared';

interface HeaderProps {
    title: string;
    isHome?: boolean;
    unreadCount?: number;
}

const Header = ({ isHome = false, title, unreadCount }: HeaderProps) => {
    const { pathname } = useLocation();
    const navigate = useNavigate();

    // 이전 페이지 이동
    const onNavigateBack = () => {
        // '/'를 기준으로 경로 분해
        const pathSegments = pathname.split('/').filter(Boolean);

        // 이전 경로로 이동
        if (pathSegments.length > 1) {
            const prevPath = '/' + pathSegments.slice(0, -1).join('/');
            navigate(prevPath);
            return;
        } else {
            navigate('/');
            return;
        }
    };

    // 알림 페이지 이동
    const onNavigateNotify = () => {
        navigate('/notifications');
        return;
    };

    return (
        <div className='flex w-full items-center justify-between py-4'>
            {/* 경로 표시 */}
            <div className='flex items-center gap-3'>
                {!isHome && (
                    <button aria-label='뒤로가기' onClick={onNavigateBack}>
                        <Icons
                            name='chev-left'
                            size={18}
                            className='fill-line-700'
                        />
                    </button>
                )}
                <p className='font-semibold'>{title}</p>
            </div>

            {/* 알림 버튼 */}
            {isHome && (
                <button
                    aria-label='알림'
                    onClick={onNavigateNotify}
                    className='relative mr-1 flex items-center justify-center'
                >
                    <Icons name='bell' size={18} className='fill-line-900' />
                    {(unreadCount ?? 0) > 0 && (
                        <span className='animate-pop absolute -top-[3px] -right-[2px] h-[6px] w-[6px] rounded-full bg-red-500'></span>
                    )}
                </button>
            )}
        </div>
    );
};

export default Header;
