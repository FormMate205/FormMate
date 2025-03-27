import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import TransferResult from '@/entities/transfer/ui/TransferResult';
import { Header } from '@/widgets';

const TransferComplete = () => {
    const navigate = useNavigate();
    return (
        <div className='flex h-screen flex-col justify-between px-4 py-2 pb-6'>
            <Header title='송금 완료' />
            <TransferResult
                name='강지은'
                amount='13,000'
                message='이번 달 예정된 상환 금액을 모두 납부했어요!'
            />
            <Button onClick={() => navigate('/')}>확인</Button>
        </div>
    );
};

export default TransferComplete;
