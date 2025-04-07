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
        }, 1000);
    }, []);

    return (
        <div className='pb-10 text-lg font-semibold'>
            {title} 페이지로 이동합니다.
        </div>
    );
};
