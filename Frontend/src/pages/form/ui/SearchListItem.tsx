import { MouseEvent } from 'react';
import { Icons } from '../../../shared';

interface SearchListItemProps {
    name: string;
    phonenumber: string;
    onClick: (e: MouseEvent<HTMLButtonElement>) => void;
}

const SearchListItem = ({
    name,
    phonenumber,
    onClick,
}: SearchListItemProps) => {
    return (
        <button
            className='bg-line-100 flex items-center justify-between rounded-lg px-5 py-3'
            onClick={onClick}
        >
            <p className='text-line-700'>
                {name}({phonenumber})으로 보내기
            </p>
            <Icons name='chev-right' size={12} color='fill-line-500' />
        </button>
    );
};

export default SearchListItem;
