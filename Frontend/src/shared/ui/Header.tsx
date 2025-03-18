import { MouseEvent } from 'react';
import Icons from '../icons/Icons';
import { useLocation, useNavigate } from 'react-router-dom';

interface HeaderProps {
    isHome?: boolean;
    title: string;
}

const Header = ({ isHome = false, title }: HeaderProps) => {
    const { pathname } = useLocation();
    const navigate = useNavigate();

    const onClick = (e: MouseEvent) => {
        e.stopPropagation();

        // '/'를 기준으로 경로 분해
        const pathSegments = pathname.split('/').filter(Boolean);

        // 이전 경로로 이동
        if (pathSegments.length > 1) {
            const prevPath = '/' + pathSegments.slice(0, -1).join('/');
            navigate(prevPath);
        } else {
            navigate('/');
        }
    };

    return (
        <div>
            <div className='flex items-center gap-3'>
                {!isHome && (
                    <button aria-label='뒤로가기' onClick={onClick}>
                        <Icons
                            name='chev-left'
                            size={16}
                            className='fill-line-700'
                        />
                    </button>
                )}
                <p>{title}</p>
            </div>
        </div>
    );
};

export default Header;
