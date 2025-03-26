const InterestInfoTab = () => {
    return (
        <div className='flex flex-col gap-8'>
            <div className='flex flex-col items-center text-xl font-medium'>
                <span>이자 조회</span>
                <span className='text-primary-500 font-semibold'>25,269원</span>
            </div>
            <section className='flex flex-col gap-4'>
                <div className='flex flex-col gap-1'>
                    <div className='flex justify-between font-semibold'>
                        <span>현재 납부 금액</span>
                        <span>656,124원</span>
                    </div>
                    <div className='flex justify-between'>
                        <span>원금</span>
                        <span>30,000원</span>
                    </div>
                    <div className='flex justify-between'>
                        <span>입금계좌</span>
                        <div className='flex flex-col items-end'>
                            <span>25,269원</span>
                            <span className='text-primary-500 text-sm'>
                                이자 2,269원
                            </span>
                            <span className='text-primary-500 text-sm'>
                                +연체이자 12,345원
                            </span>
                        </div>
                    </div>
                    <div className='flex justify-between'>
                        <span>중도 상환 수수료</span>
                        <span>3,567원</span>
                    </div>
                    <div className='flex justify-between'>
                        <span>이자 지급 금액</span>
                        <span>25,269원</span>
                    </div>
                </div>
                <div className='flex justify-between font-semibold'>
                    <span>현재 미납부 금액</span>
                    <span>6,124원</span>
                </div>
                <div className='flex flex-col gap-1'>
                    <div className='flex justify-between'>
                        <span>이자</span>
                        <div className='flex flex-col items-end'>
                            <span>25,269원</span>
                            <span className='text-primary-500 text-sm'>
                                이자 2,269원
                            </span>
                            <span className='text-primary-500 text-sm'>
                                +연체이자 12,345원
                            </span>
                        </div>
                    </div>
                    <div className='flex justify-between'>
                        <span>중도 상환 수수료</span>
                        <span>3,567원</span>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default InterestInfoTab;
