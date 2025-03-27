import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';

const InterestInfoTab = () => {
    return (
        <div className='flex flex-col gap-6 rounded-sm bg-white px-6 py-8 shadow-sm'>
            <div className='border-line-300 flex justify-between border-b py-2 text-lg font-semibold'>
                <span>이번달 미납부 금액</span>
                <span>6,124원</span>
            </div>
            <section className='flex flex-col gap-4 text-lg'>
                <div className='border-line-300 flex flex-col gap-1 border-b'>
                    <div className='border-line-300 flex justify-between border-b py-2 text-lg font-semibold'>
                        <span>현재 납부 금액</span>
                        <span>656,124원</span>
                    </div>
                    <div className='ml-14 flex flex-col text-base'>
                        <div className='border-line-200 flex justify-between border-b py-2 pl-2'>
                            <span>원금</span>
                            <span>30,000원</span>
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
                                        <span>25,269원</span>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent>
                                    <div className='flex flex-col items-end'>
                                        <span className='text-primary-500 text-sm'>
                                            이자 2,269원
                                        </span>
                                        <span className='text-primary-500 text-sm'>
                                            +연체이자 12,345원
                                        </span>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                        <div className='ml-2 flex justify-between py-2'>
                            <span>중도 상환 수수료</span>
                            <span>3,567원</span>
                        </div>
                    </div>
                </div>

                <Accordion
                    type='single'
                    collapsible
                    className='border-line-300 border-b'
                >
                    <AccordionItem value='item-1'>
                        <AccordionTrigger>
                            <div className='flex flex-1 items-center justify-between text-lg font-semibold'>
                                <span>만기일 예상 납부액</span>
                                <span>25,269원</span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent>
                            <div className='text-line-900 ml-14 flex flex-col text-base'>
                                <div className='border-line-200 flex justify-between border-b py-2 pl-2'>
                                    <span>원금</span>
                                    <span>1,000,000원</span>
                                </div>
                                <div className='border-line-200 flex justify-between border-b py-2 pl-2'>
                                    <span>이자</span>
                                    <span>30,000원</span>
                                </div>

                                <div className='ml-2 flex justify-between py-2'>
                                    <span>중도 상환 수수료</span>
                                    <span>3,567원</span>
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
