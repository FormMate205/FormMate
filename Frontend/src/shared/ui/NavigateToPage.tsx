import { useEffect } from 'react';

interface NavigateToPageProps {
    title: string;
    handleNavigate: () => void;
}

export const NavigateToPage = ({
    title,
    handleNavigate,
}: NavigateToPageProps) => {
    useEffect(() => {
        setTimeout(() => {
            handleNavigate();
        }, 800);
    }, []);

    return (
        <div className='pb-10 text-lg font-semibold'>
            잠시후 {title} 페이지로 이동합니다.
        </div>
    );
};
