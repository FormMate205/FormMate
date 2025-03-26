import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import LandingVisual from './ui/LandingVisual';

const Landing = () => {
    const [showButtons, setShowButtons] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => setShowButtons(true), 500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className='relative min-h-screen w-full'>
            {/* 배경 비주얼 */}
            <LandingVisual />

            {/* 서비스명 */}
            <div className='absolute top-1/3 left-1/2 -translate-x-1/2 text-center'>
                <p className='text-3xl font-medium'>폼메이트</p>
                <p className='text-4xl font-bold'>FormMate</p>
            </div>

            {/* 로그인 / 회원가입 버튼 그룹 */}
            {showButtons && (
                <div className='animate-fade-in absolute bottom-20 left-1/2 flex w-full max-w-xs -translate-x-1/2 flex-col items-center gap-4'>
                    <Button
                        variant='primary'
                        onClick={() => navigate('/login')}
                    >
                        로그인
                    </Button>
                    <button
                        className='text-line-700 underline'
                        onClick={() => navigate('/login/signup')}
                    >
                        회원가입
                    </button>
                </div>
            )}
        </div>
    );
};

export default Landing;
