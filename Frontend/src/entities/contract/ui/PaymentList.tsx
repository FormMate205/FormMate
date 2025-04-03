import { PaymentHistoryItem } from '../model/types';
import PaymentItem from './PaymentItem';

interface PaymentHistoryListProps {
    data: PaymentHistoryItem[];
    lastItemRef: (node: HTMLDivElement | null) => void;
}

const PaymentHistoryList = ({ data, lastItemRef }: PaymentHistoryListProps) => {
    if (data.length === 0) {
        return (
            <div className='text-line-400 py-10 text-center text-sm'>
                납부 내역이 없습니다.
            </div>
        );
    }

    return (
        <>
            {data.map((item, index) => (
                <div
                    key={index}
                    ref={index === data.length - 1 ? lastItemRef : null}
                >
                    <PaymentItem
                        date={item.transactionDate
                            .slice(2, 10)
                            .replace(/-/g, '.')}
                        round={`${item.currentRound}회차`}
                        amount={`${item.amount.toLocaleString()}원`}
                        tagText={item.status}
                        description={
                            item.status === '납부'
                                ? item.paymentDifference > 0
                                    ? `${item.paymentDifference.toLocaleString()}원 초과`
                                    : '정상납부'
                                : item.paymentDifference < 0
                                  ? `${Math.abs(item.paymentDifference).toLocaleString()}원 미납`
                                  : '정상납부'
                        }
                    />
                </div>
            ))}
        </>
    );
};

export default PaymentHistoryList;
