import { format } from 'date-fns';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { Contract } from '../model/types';

interface ContractDocumentProps {
    contract: Contract;
}

const ContractDocument = ({ contract }: ContractDocumentProps) => {
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
    } = contract;

    return (
        <div
            id='contract-document'
            style={{
                backgroundColor: '#ffffff',
                color: '#000000',
                fontFamily: 'Pretendard, system-ui, sans-serif',
            }}
            className='flex flex-col gap-4 px-6 py-4'
        >
            <div
                className='flex justify-center border-b py-4 text-2xl font-medium'
                style={{ borderColor: '#bfc0d1' }}
            >
                차용증
            </div>

            <article className='text-md flex flex-col gap-1'>
                <div className='flex justify-between'>
                    <span style={{ fontWeight: 600, color: '#716b8a' }}>
                        채권자
                    </span>
                    <div>
                        {creditorName} / {creditorPhone}
                    </div>
                </div>

                <div className='flex justify-between'>
                    <span style={{ fontWeight: 600, color: '#716b8a' }}>
                        채무자
                    </span>
                    <div>
                        {debtorName} / {debtorPhone}
                    </div>
                </div>

                <hr className='my-2' style={{ borderColor: '#d1d5db' }} />

                <div className='flex justify-between'>
                    <span style={{ fontWeight: 600, color: '#716b8a' }}>
                        입금계좌
                    </span>
                    <div className='flex items-end gap-2'>
                        <span>{creditorBank}</span>
                        <span>{creditorAccount}</span>
                    </div>
                </div>

                <hr className='my-2' style={{ borderColor: '#d1d5db' }} />

                <div className='flex justify-between'>
                    <span style={{ fontWeight: 600, color: '#716b8a' }}>
                        계약 체결
                    </span>
                    <span>{format(new Date(contractDate), 'yyyy.MM.dd')}</span>
                </div>
                <div className='flex justify-between'>
                    <span style={{ fontWeight: 600, color: '#716b8a' }}>
                        계약 만기
                    </span>
                    <span>{format(new Date(maturityDate), 'yyyy.MM.dd')}</span>
                </div>

                <hr className='my-2' style={{ borderColor: '#d1d5db' }} />

                <div className='flex items-start justify-between'>
                    <span style={{ fontWeight: 600, color: '#716b8a' }}>
                        상환 방식
                    </span>
                    <div className='flex flex-col items-end'>
                        <span>{repaymentMethod}</span>
                        <span>
                            매달 {repaymentDay}일 /{' '}
                            {Number(loanAmount).toLocaleString()}원
                        </span>
                    </div>
                </div>

                <div className='flex justify-between'>
                    <span style={{ fontWeight: 600, color: '#716b8a' }}>
                        이자율
                    </span>
                    <span>{interestRate}%</span>
                </div>

                <div className='flex justify-between'>
                    <span style={{ fontWeight: 600, color: '#716b8a' }}>
                        중도상환 수수료
                    </span>
                    <span>{earlyRepaymentFeeRate}%</span>
                </div>

                <hr className='my-2' style={{ borderColor: '#d1d5db' }} />

                {specialTerms?.length > 0 && (
                    <Accordion
                        type='single'
                        collapsible
                        defaultValue='item-1'
                        className='pb-2'
                    >
                        <AccordionItem value='item-1'>
                            <AccordionTrigger>
                                <span
                                    style={{
                                        fontWeight: 600,
                                        color: '#716b8a',
                                    }}
                                >
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

                <div className='flex flex-col items-end justify-center text-right font-medium'>
                    <div>
                        <span>{creditorName}</span>
                        <span
                            style={{
                                marginLeft: 8,
                                fontSize: '0.875rem',
                                color: '#716b8a',
                            }}
                        >
                            (전자서명 완료)
                        </span>
                    </div>
                    <div>
                        <span>{debtorName}</span>
                        <span
                            style={{
                                marginLeft: 8,
                                fontSize: '0.875rem',
                                color: '#716b8a',
                            }}
                        >
                            (전자서명 완료)
                        </span>
                    </div>
                </div>
            </article>
        </div>
    );
};

export default ContractDocument;
