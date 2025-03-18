import { Button } from '../../components/ui/button';
import { Icons } from '../../shared';

const Transaction = () => {
    return (
        <>
            <section className='bg-primary-50 px-4 py-8'>
                <div className='flex flex-col gap-7'>
                    <div className='flex flex-col gap-2'>
                        <div className='flex items-center gap-2'>
                            <span className='text-line-500 font-medium'>
                                싸피뱅크 111-1111-1111
                            </span>
                            <Icons name='copy' size={20} />
                        </div>
                        <div className='text-3xl font-semibold'>12,345 원</div>
                    </div>
                    <Button variant='primary'>이체하기</Button>
                </div>
            </section>
            <section className='p-4'>
                <div className='flex flex-col gap-2'>
                    <div className='text-line-700 border-line-200 border-b pb-1 font-medium'>
                        2025.03.12
                    </div>
                    <div className='border-line-100 flex justify-between border-b pb-2'>
                        <div className='flex items-center text-lg font-semibold'>
                            강지은
                        </div>
                        <div className='flex flex-col items-end'>
                            <span className='text-line-700 font-medium'>
                                출금
                            </span>
                            <span className='text-primary-500 font-semibold'>
                                -10,000원
                            </span>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Transaction;
