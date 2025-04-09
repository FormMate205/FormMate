import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Icons } from '@/shared';

interface ResultStepProps {
    name: string;
    amount: string;
    message?: string;
}

const ResultStep = ({ name, amount, message }: ResultStepProps) => {
    const navigate = useNavigate();

    return (
        <div className='flex h-full flex-col'>
            <div className='mt-[-80px] flex flex-1 flex-col items-center justify-center gap-6'>
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
            </div>
            <div className='sticky bottom-0 left-0 mx-auto w-full max-w-[640px] p-4'>
                <Button variant={'primary'} onClick={() => navigate('/')}>
                    확인
                </Button>
            </div>
        </div>
    );
};

export default ResultStep;
