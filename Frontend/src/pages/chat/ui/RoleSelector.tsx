import { MouseEvent } from 'react';

interface RoleSelectorProps {
    type: 'creditor' | 'debtor';
    isSelect?: boolean;
    onClick: (e: MouseEvent<HTMLButtonElement>) => void;
}

const RoleSelector = ({
    type,
    isSelect = false,
    onClick,
}: RoleSelectorProps) => {
    const role = type === 'creditor' ? '채권자' : '채무자';

    return (
        <button
            className={`${type === 'creditor' ? 'border-primary-200 bg-primary-50' : 'border-primary-500 bg-white'} flex w-[140px] flex-col rounded-lg border p-5`}
            onClick={onClick}
        >
            <div className='flex flex-col gap-4'>
                <p className='text-xl font-semibold'>{role}</p>
                <p className='text-line-700'>
                    <span>{role}는 돈을 </span>
                    <span className='font-bold'>
                        {type === 'creditor' ? '빌려준 사람' : '빌린 사람'}
                    </span>
                    <span>을 말합니다.</span>
                </p>
            </div>

            <div className='mt-3 flex justify-end'>
                <div className='border-primary-200 flex h-6 w-6 items-center justify-center rounded-full border-2 bg-white p-1'>
                    <div
                        className={`h-4 w-4 rounded-full ${isSelect ? 'bg-primary-500' : 'bg-white'}}`}
                    ></div>
                </div>
            </div>
        </button>
    );
};

export default RoleSelector;
