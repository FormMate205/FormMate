import { format } from 'date-fns';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';

const ContractDetailTab = () => {
    // dummy
    const data = {
        formId: 1,
        status: '상대승인전',
        creatorId: 1,
        creatorName: '생길동',
        receiverId: 2,
        receiverName: '수길동',
        creditorId: 1,
        debtorId: 3,
        creditorName: '홍길동',
        creditorAddress: '서울 강남구 테헤란로 212 멀티캠퍼스 역삼 802호',
        creditorPhone: '010-1234-5678',
        creditorBank: '국민은행',
        creditorAccount: '123-456-789',
        debtorName: '김철수',
        debtorAddress: '서울 강남구 테헤란로 212 멀티캠퍼스 역삼 802호',
        debtorPhone: '010-9876-5432',
        debtorBank: '신한은행',
        debtorAccount: '987-654-321',
        contractDate: '2025-03-21T00:00:00',
        maturityDate: '2025-03-21T00:00:00',
        loanAmount: 10000000,
        repaymentMethod: '원금균등상환',
        repaymentDay: 25,
        interestRate: 5,
        earlyRepaymentFeeRate: 1.5,
        overdueInterestRate: 15,
        overdueLimit: 3,
        specialTerms: [
            {
                specialTermIndex: 1,
                specialTermDetail:
                    '채무자가 계약을 위반할 경우, 채권자는 본 계약을 근거로 법적 조치를 취할 수 있습니다.',
            },
            {
                specialTermIndex: 3,
                specialTermDetail:
                    '계약과 관련한 분쟁이 발생할 경우 대한민국 법률을 따릅니다.',
            },
        ],
    };

    const {
        creditorName,
        creditorPhone,
        debtorName,
        debtorPhone,
        creditorBank,
        creditorAccount,
        contractDate,
        maturityDate,
        repaymentMethod,
        repaymentDay,
        loanAmount,
        interestRate,
        earlyRepaymentFeeRate,
        specialTerms,
    } = data;

    return (
        <div className='flex flex-col gap-4'>
            <div className='flex justify-end'>
                {/* Todo: PDF 내보내기 */}
                <Button variant='choiceEmpty' onClick={() => {}}>
                    PDF로 내보내기
                </Button>
            </div>
            <div className='flex flex-col gap-4 bg-white px-6 py-4 shadow-sm'>
                <div className='flex flex-col'>
                    <div className='border-line-300 flex justify-center border-b py-4 text-2xl font-medium'>
                        차용증
                    </div>
                </div>

                <article className='text-md flex flex-col gap-1'>
                    <div className='flex justify-between'>
                        <span className='text-line-700 font-medium'>
                            채권자
                        </span>
                        <div>
                            {creditorName} / {creditorPhone}
                        </div>
                    </div>
                    <div className='flex justify-between'>
                        <span className='text-line-700 font-medium'>
                            채무자
                        </span>
                        <div>
                            {debtorName} / {debtorPhone}
                        </div>
                    </div>
                    <hr className='my-2 border-t border-gray-300' />

                    <div className='flex items-center justify-between'>
                        <span className='text-line-700 font-medium'>
                            입금계좌
                        </span>
                        <div className='flex items-end gap-2'>
                            <span>{creditorBank}</span>
                            <span>{creditorAccount}</span>
                        </div>
                    </div>
                    <hr className='my-2 border-t border-gray-300' />

                    <div className='flex justify-between'>
                        <span className='text-line-700 font-medium'>
                            계약 체결
                        </span>
                        <span>
                            {format(new Date(contractDate), 'yyyy.MM.dd')}
                        </span>
                    </div>
                    <div className='flex justify-between'>
                        <span className='text-line-700 font-medium'>
                            계약 만기
                        </span>
                        <span>
                            {format(new Date(maturityDate), 'yyyy.MM.dd')}
                        </span>
                    </div>
                    <hr className='my-2 border-t border-gray-300' />

                    <div className='flex items-start justify-between'>
                        <span className='text-line-700 font-medium'>
                            상환 방식
                        </span>
                        <div className='flex flex-col items-end'>
                            <span>{repaymentMethod}</span>
                            <span>
                                매달 {repaymentDay}일 /{' '}
                                {loanAmount.toLocaleString()}원
                            </span>
                        </div>
                    </div>
                    <div className='flex justify-between'>
                        <span className='text-line-700 font-medium'>
                            이자율
                        </span>
                        <span>{interestRate}%</span>
                    </div>
                    <div className='flex justify-between'>
                        <span className='text-line-700 font-medium'>
                            중도상환 수수료
                        </span>
                        <span>{earlyRepaymentFeeRate}%</span>
                    </div>
                    <hr className='my-2 border-t border-gray-300' />

                    {specialTerms.length > 0 && (
                        <Accordion
                            type='single'
                            collapsible
                            defaultValue='item-1'
                            className='border-line-200 border-b pb-2'
                        >
                            <AccordionItem value='item-1'>
                                <AccordionTrigger>
                                    <span className='text-line-700 font-medium'>
                                        특약사항
                                    </span>
                                </AccordionTrigger>
                                <AccordionContent>
                                    <div className='flex flex-col gap-2 text-base'>
                                        {specialTerms.map((term) => (
                                            <span key={term.specialTermIndex}>
                                                {term.specialTermIndex}.{' '}
                                                {term.specialTermDetail}
                                            </span>
                                        ))}
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    )}

                    <div className='flex justify-center pt-4 text-lg font-medium'>
                        {format(new Date(), 'yyyy.MM.dd')}
                    </div>
                    {/* Todo: 싸인 처리 어떻게 할건지...? */}
                    <div className='flex flex-col items-end justify-center text-right font-medium'>
                        <div>
                            <span>{creditorName}</span>
                            <span className='text-line-700 ml-2 text-sm'>
                                (PASS 전자서명 완료)
                            </span>
                        </div>
                        <div>
                            <span>{debtorName}</span>
                            <span className='text-line-700 ml-2 text-sm'>
                                (PASS 전자서명 완료)
                            </span>
                        </div>
                    </div>
                </article>
            </div>
        </div>
    );
};

export default ContractDetailTab;
