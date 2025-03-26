import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface TodaySettlementProps {
    hasTodayTransaction: boolean;
    isSend?: boolean;
    targetName?: string;
    amount?: number;
    principal?: number;
}

const TodaySettlement = ({
    hasTodayTransaction,
    isSend = true,
    targetName = '',
    amount = 0,
    principal = 0,
}: TodaySettlementProps) => {
    const navigate = useNavigate();

    return (
        <div>
            <p className='mb-4 text-lg font-semibold'>오늘의 정산</p>
            <div className='border-line-200 rounded-lg border bg-white p-4 shadow-sm'>
                {hasTodayTransaction ? (
                    <div className='flex items-end justify-between'>
                        <div>
                            <p className='mb-2'>{targetName}님에게 보낼 금액</p>
                            <p
                                className={`mb-1 text-3xl font-bold ${
                                    isSend
                                        ? 'text-subPink-600'
                                        : 'text-primary-500'
                                }`}
                            >
                                {isSend ? '-' : '+'} {amount.toLocaleString()}원
                            </p>
                            <p className='text-line-500 text-sm'>
                                원금 | {principal.toLocaleString()}원
                            </p>
                        </div>
                        <Button
                            variant='sendMinus'
                            // className='h-10 px-6'
                            onClick={() => navigate('/transaction')}
                        >
                            송금
                        </Button>
                    </div>
                ) : (
                    <div className='flex items-center justify-between'>
                        <div>
                            <p className='mb-2 text-sm'>예정된 내역이 없어요</p>
                            <p className='text-subPink-700 mb-1 text-xl font-bold'>
                                ?원
                            </p>
                            <p className='text-line-500 text-xs'>원금 | ?원</p>
                        </div>
                        <Button
                            variant='primary'
                            className='h-10 px-6'
                            onClick={() => navigate('/contracts')}
                        >
                            거래 내역 보기
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TodaySettlement;
