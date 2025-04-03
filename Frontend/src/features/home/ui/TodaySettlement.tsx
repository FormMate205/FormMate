import { useContractAmount } from '@/entities/home/model/useContractAmount';

const TodaySettlement = () => {
    const { data, isLoading, isError } = useContractAmount();

    if (isLoading) return <p>로딩 중...</p>;
    if (isError || !data) return <p>정산 금액을 불러오지 못했습니다.</p>;

    const { expectedTotalRepayment, expectedTotalReceived } = data;

    return (
        <div>
            <p className='mb-4 text-lg font-semibold'>나의 정산 모아보기</p>

            <div className='grid grid-cols-2 gap-4'>
                <div className='rounded-xl bg-white px-4 py-3 text-center shadow-sm'>
                    <p className='text-line-400 mb-1 text-sm'>보낼 금액</p>
                    <p className='text-subPink-600 font-bold'>
                        - {expectedTotalRepayment.toLocaleString()}
                    </p>
                </div>
                <div className='rounded-xl bg-white px-4 py-3 text-center shadow-sm'>
                    <p className='text-line-400 mb-1 text-sm'>받을 금액</p>
                    <p className='text-primary-500 font-bold'>
                        + {expectedTotalReceived.toLocaleString()}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default TodaySettlement;
