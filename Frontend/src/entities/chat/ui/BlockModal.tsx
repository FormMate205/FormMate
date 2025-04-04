import { Icons } from '@/shared';

const BlockModal = () => {
    return (
        <div className='flex w-full flex-col items-center gap-4'>
            <Icons name={'exclamation'} />
            <div className='flex flex-col items-center gap-2 text-lg font-semibold'>
                <p className='text-primary-500'>서명 대상이 아닙니다.</p>
                <p>상대방의 서명을 기다려주세요.</p>
            </div>
        </div>
    );
};

export default BlockModal;
