import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';

const InterestInfoTab = () => {
    // dummy
    const data = {
        paidPrincipalAmount: 656124,
        paidInterestAmount: 25269,
        paidOverdueInterestAmount: 12345,
        totalEarlyRepaymentFee: 3567,
        unpaidAmount: 6124,
        expectedPaymentAmountAtMaturity: 1656124,
        expectedPrincipalAmountAtMaturity: 1000000,
        expectedInterestAmountAtMaturity: 25269,
    };

    const {
        paidPrincipalAmount,
        paidInterestAmount,
        paidOverdueInterestAmount,
        totalEarlyRepaymentFee,
        unpaidAmount,
        expectedPaymentAmountAtMaturity,
        expectedPrincipalAmountAtMaturity,
        expectedInterestAmountAtMaturity,
    } = data;

    return (
        <div className='flex flex-col gap-6 rounded-sm bg-white px-6 py-8 shadow-sm'>
            <div className='border-line-300 flex justify-between border-b py-2 text-lg font-semibold'>
                <span>이번달 미납부 금액</span>
                <span>{unpaidAmount.toLocaleString()}원</span>
            </div>
            <section className='flex flex-col gap-4 text-lg'>
                <div className='border-line-300 flex flex-col gap-1 border-b'>
                    <div className='border-line-300 flex justify-between border-b py-2 text-lg font-semibold'>
                        <span>현재 납부 금액</span>
                        <span>
                            {(
                                paidPrincipalAmount +
                                paidInterestAmount +
                                paidOverdueInterestAmount +
                                totalEarlyRepaymentFee
                            ).toLocaleString()}
                            원
                        </span>
                    </div>
                    <div className='ml-14 flex flex-col text-base'>
                        <div className='border-line-200 flex justify-between border-b py-2 pl-2'>
                            <span>원금</span>
                            <span>
                                {paidPrincipalAmount.toLocaleString()}원
                            </span>
                        </div>
                        <Accordion
                            type='single'
                            collapsible
                            className='border-line-200 border-b'
                        >
                            <AccordionItem value='item-1'>
                                <AccordionTrigger>
                                    <div className='flex flex-1 justify-between pl-2'>
                                        <span>이자</span>
                                        <span>
                                            {(
                                                paidInterestAmount +
                                                paidOverdueInterestAmount
                                            ).toLocaleString()}
                                            원
                                        </span>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent>
                                    <div className='flex flex-col items-end'>
                                        <span className='text-primary-500 text-sm'>
                                            이자{' '}
                                            {paidInterestAmount.toLocaleString()}
                                            원
                                        </span>
                                        <span className='text-primary-500 text-sm'>
                                            +연체이자{' '}
                                            {paidOverdueInterestAmount.toLocaleString()}
                                            원
                                        </span>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                        <div className='ml-2 flex justify-between py-2'>
                            <span>중도 상환 수수료</span>
                            <span>
                                {totalEarlyRepaymentFee.toLocaleString()}원
                            </span>
                        </div>
                    </div>
                </div>

                <Accordion
                    type='single'
                    collapsible
                    defaultValue='item-2'
                    className='border-line-300 border-b'
                >
                    <AccordionItem value='item-2'>
                        <AccordionTrigger>
                            <div className='flex flex-1 items-center justify-between text-lg font-semibold'>
                                <span>만기일 예상 납부액</span>
                                <span>
                                    {expectedPaymentAmountAtMaturity.toLocaleString()}
                                    원
                                </span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent>
                            <div className='text-line-900 ml-14 flex flex-col text-base'>
                                <div className='border-line-200 flex justify-between border-b py-2 pl-2'>
                                    <span>원금</span>
                                    <span>
                                        {expectedPrincipalAmountAtMaturity.toLocaleString()}
                                        원
                                    </span>
                                </div>
                                <div className='border-line-200 flex justify-between border-b py-2 pl-2'>
                                    <span>이자</span>
                                    <span>
                                        {expectedInterestAmountAtMaturity.toLocaleString()}
                                        원
                                    </span>
                                </div>
                                <div className='ml-2 flex justify-between py-2'>
                                    <span>중도 상환 수수료</span>
                                    <span>
                                        {totalEarlyRepaymentFee.toLocaleString()}
                                        원
                                    </span>
                                </div>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </section>
        </div>
    );
};

export default InterestInfoTab;
