import { Icons } from '../../shared';

const Transaction = () => {
    return (
        <>
            <div className='bg-primary-50 px-4'>
                <div className='flex flex-col gap-4'>
                    <div className='flex items-center gap-2'>
                        <span className='text-line-500 text-sm font-medium'>
                            싸피뱅크 111-1111-1111
                        </span>
                        <Icons name='copy' size={18} />
                    </div>
                    <div className='text-3xl font-semibold'>12,345 원</div>
                    <div>버튼</div>
                </div>
            </div>
            <div className='p-4'>
                <div className='flex flex-col gap-2'>
                    <div className='text-line-700 border-line-200 border-b pb-1 text-sm font-medium'>
                        2025.03.12
                    </div>
                    <div className='border-line-100 flex justify-between border-b pb-2'>
                        <div className='flex items-center font-medium'>
                            강지은
                        </div>
                        <div className='flex flex-col items-end'>
                            <span className='text-line-700 text-sm font-medium'>
                                출금
                            </span>
                            <span className='text-primary-500 text-sm font-semibold'>
                                -10,000원
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Transaction;
