import { Icons } from '@/shared';

interface TransferResultProps {
    name: string;
    amount: string;
    message?: string;
}

const TransferResult = ({ name, amount, message }: TransferResultProps) => {
    return (
        <div className='flex flex-col items-center gap-6'>
            <div className='bg-primary-500 rounded-4xl p-2'>
                <Icons name='check' className='fill-white' size={32} />
            </div>
            <div className='flex flex-col items-center gap-4'>
                <span className='text-center text-2xl font-semibold'>
                    {name}님께 <br />
                    {amount}원을 송금했어요
                </span>
                <span className='text-line-500 text-lg font-medium'>
                    {message}
                </span>
            </div>
        </div>
    );
};

export default TransferResult;
