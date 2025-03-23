import PaymentItem from './PaymentItem';

const paymentList = [
    {
        date: '25.07.15',
        round: '6회차',
        amount: '-15,000원',
        tagText: '중도',
        description: '3,000원 초과',
    },
    {
        date: '25.06.15',
        round: '5회차',
        amount: '-12,000원',
        tagText: '납부',
        description: '정상납부',
    },
    {
        date: '25.05.15',
        round: '4회차',
        amount: '-12,000원',
        tagText: '납부',
        description: '정상납부',
    },
    {
        date: '25.05.15',
        round: '3회차',
        amount: '-1,000원',
        tagText: '연체',
        description: '23,000원 미납',
    },
    {
        date: '25.05.15',
        round: '2회차',
        amount: '0원',
        tagText: '연체',
        description: '12,000원 미납',
    },
    {
        date: '25.05.15',
        round: '1회차',
        amount: '12,000원',
        tagText: '납부',
        description: '정상 납부',
    },
];

const PaymentHistoryTab = () => {
    return (
        <div className='flex flex-col gap-4'>
            {paymentList.map((item, idx) => (
                <PaymentItem key={idx} {...item} />
            ))}
        </div>
    );
};

export default PaymentHistoryTab;
