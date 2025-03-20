import Icons from '../icons/Icons';
import { useLocation, useNavigate } from 'react-router-dom';

interface HeaderProps {
    isHome?: boolean;
    title: string;
}

const Header = ({ isHome = false, title }: HeaderProps) => {
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
        navigate('/notify');
        return;
    };

    return (
        <div className='py- flex items-center justify-between px-4 py-3'>
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
                <p className='text-lg font-medium'>{title}</p>
            </div>

            {/* 알림 버튼 */}
            {isHome && (
                <button
                    aria-label='알림'
                    onClick={onNavigateNotify}
                    className='flex items-center justify-center'
                >
                    <Icons name='bell' size={18} className='fill-white' />
                </button>
            )}
        </div>
    );
};

export default Header;
