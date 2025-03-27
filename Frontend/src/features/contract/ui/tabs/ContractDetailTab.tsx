import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';

const ContractDetailTab = () => {
    return (
        <div className='flex flex-col gap-4'>
            <div className='flex justify-end'>
                <Button variant={'choiceEmpty'}>PDF로 내보내기</Button>
            </div>
            <div className='flex flex-col gap-4 bg-white px-6 py-4 shadow-sm'>
                <div className='flex flex-col'>
                    <div className='border-line-300 flex justify-center border-b py-4 text-xl font-medium'>
                        차용증
                    </div>
                </div>

                <article className='flex flex-col'>
                    <div className='text-md flex flex-col gap-1'>
                        <div className='flex justify-between'>
                            <span className='text-line-700 font-medium'>
                                채권자
                            </span>
                            <div className=''>
                                <span>윤이영</span>
                                <span> / </span>
                                <span>010-1234-5678</span>
                            </div>
                        </div>
                        <div className='flex justify-between'>
                            <span className='text-line-700 font-medium'>
                                채무자
                            </span>
                            <div>
                                <span>강지은</span>
                                <span> / </span>
                                <span>010-1234-5678</span>
                            </div>
                        </div>
                        <hr className='my-2 border-t border-gray-300' />

                        <div className='flex items-center justify-between'>
                            <span className='text-line-700 font-medium'>
                                입금계좌
                            </span>
                            <div className='flex flex-col items-end'>
                                <span>카카오뱅크</span>
                                <span>111-1111-111111</span>
                            </div>
                        </div>
                        <hr className='my-2 border-t border-gray-300' />
                        <div className='flex justify-between'>
                            <span className='text-line-700 font-medium'>
                                계약 체결
                            </span>
                            <span>2025.02.12</span>
                        </div>
                        <div className='flex justify-between'>
                            <span className='text-line-700 font-medium'>
                                계약 만기
                            </span>
                            <span>2025.05.12</span>
                        </div>
                        <hr className='my-2 border-t border-gray-300' />
                        <div className='flex items-center justify-between'>
                            <span className='text-line-700 font-medium'>
                                상환 방식
                            </span>
                            <div className='flex flex-col items-end'>
                                <span>원금 균등 상환</span>
                                <span>매달 29일 / 10,000원</span>
                            </div>
                        </div>
                        <div className='flex justify-between'>
                            <span className='text-line-700 font-medium'>
                                이자율
                            </span>
                            <span>0.15%</span>
                        </div>
                        <div className='flex justify-between'>
                            <span className='text-line-700 font-medium'>
                                중도상환 수수료
                            </span>
                            <span>0.15%</span>
                        </div>
                        <hr className='my-2 border-t border-gray-300' />
                    </div>
                    {/* 특약 사항 */}
                    <Accordion
                        type='single'
                        collapsible
                        className='border-line-200 border-b pb-2'
                        defaultValue='item-1'
                    >
                        <AccordionItem value='item-1'>
                            <AccordionTrigger>
                                <span className='text-line-700 font-medium'>
                                    특약사항
                                </span>
                            </AccordionTrigger>
                            <AccordionContent>
                                <div className='flex flex-col gap-2 text-base'>
                                    <span>
                                        1. 계약과 관련한 분쟁이 발생할 경우
                                        대한민국 법률을 따르며, 관할 법원은
                                        채권자 또는 채무자의 주소지를 고려하여
                                        결정할 수 있습니다.
                                    </span>
                                    <span>
                                        2. 채무자가 계약을 위반할 경우, 채권자는
                                        본 계약을 근거로 법적 조치를 취할 수
                                        있습니다. 이는 대여금 반환 소송 등을
                                        의미합니다.
                                    </span>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>

                    <div className='flex justify-center pt-4 text-lg font-medium'>
                        2025.03.17
                    </div>
                    <div className='flex flex-col items-end font-medium'>
                        <span>윤이영 (인)</span>
                        <span>강지은 (인)</span>
                    </div>
                </article>
            </div>
        </div>
    );
};

export default ContractDetailTab;
