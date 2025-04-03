const TodaySettlement = () => {
    return (
        <div>
            <p className='mb-4 text-lg font-semibold'>나의 정산 모아보기</p>

            <div className='grid grid-cols-2 gap-4'>
                <div className='rounded-xl bg-white px-4 py-3 text-center shadow-sm'>
                    <p className='text-line-400 mb-1 text-sm'>보낼 금액</p>
                    <p className='text-subPink-600 font-bold'>
                        - {`{보내야 할 누적 금액}`}
                    </p>
                </div>
                <div className='rounded-xl bg-white px-4 py-3 text-center shadow-sm'>
                    <p className='text-line-400 mb-1 text-sm'>받을 금액</p>
                    <p className='text-primary-500 font-bold'>
                        + {`{받아야 할 누적 금액}`}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default TodaySettlement;
