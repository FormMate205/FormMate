import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Icons } from '@/shared';
import { Header } from '@/widgets';

const TransferComplete = () => {
    const navigate = useNavigate();
    return (
        <div className='flex h-screen flex-col justify-between px-4 py-2 pb-6'>
            <Header title='계약 상대 등록' />
            <div className='flex flex-col items-center gap-6'>
                <div className='bg-primary-500 rounded-4xl p-2'>
                    <Icons name='check' className='fill-white' size={32} />
                </div>
                <div className='flex flex-col items-center gap-4'>
                    <span className='text-center text-2xl font-semibold'>
                        강지은님께 <br />
                        13000원을 송금했어요
                    </span>
                    <span className='text-line-500 text-lg font-medium'>
                        이번 달 예정된 상환 금액을 모두 납부했어요!
                    </span>
                </div>
            </div>

            <Button onClick={() => navigate('/')}>확인</Button>
        </div>
    );
};

export default TransferComplete;
