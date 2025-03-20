import { MouseEvent } from 'react';
import Icons from '../icons/Icons';

interface ArrowListItemProps {
    hasFilter?: boolean;
    title: string;
    subString: string;
    onClick: (e: MouseEvent<HTMLButtonElement>) => void;
}

const ArrowListItem = ({
    hasFilter = false,
    title,
    subString,
    onClick,
}: ArrowListItemProps) => {
    return (
        <button
            className='border-line-100 flex w-full items-center justify-between border-b py-2'
            onClick={onClick}
        >
            <div className='flex items-center gap-4'>
                {hasFilter && <div></div>}
                <div className='flex flex-col items-start gap-1'>
                    <p className='font-medium'>{title}</p>
                    <p className='text-line-700'>{subString}</p>
                </div>
            </div>
            <Icons name='chev-right' size={16} color='fill-line-700' />
        </button>
    );
};

export default ArrowListItem;
