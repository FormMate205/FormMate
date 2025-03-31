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
            className='flex flex-col gap-4 bg-white px-6 py-4 shadow-sm'
        >
            <div className='border-line-300 flex justify-center border-b py-4 text-2xl font-medium'>
                차용증
            </div>
            <article className='text-md flex flex-col gap-1'>
                <div className='flex justify-between'>
                    <span className='text-line-700 font-medium'>채권자</span>
                    <div>
                        {creditorName} / {creditorPhone}
                    </div>
                </div>
                <div className='flex justify-between'>
                    <span className='text-line-700 font-medium'>채무자</span>
                    <div>
                        {debtorName} / {debtorPhone}
                    </div>
                </div>
                <hr className='my-2 border-t border-gray-300' />

                <div className='flex items-center justify-between'>
                    <span className='text-line-700 font-medium'>입금계좌</span>
                    <div className='flex items-end gap-2'>
                        <span>{creditorBank}</span>
                        <span>{creditorAccount}</span>
                    </div>
                </div>
                <hr className='my-2 border-t border-gray-300' />

                <div className='flex justify-between'>
                    <span className='text-line-700 font-medium'>계약 체결</span>
                    <span>{format(new Date(contractDate), 'yyyy.MM.dd')}</span>
                </div>
                <div className='flex justify-between'>
                    <span className='text-line-700 font-medium'>계약 만기</span>
                    <span>{format(new Date(maturityDate), 'yyyy.MM.dd')}</span>
                </div>
                <hr className='my-2 border-t border-gray-300' />

                <div className='flex items-start justify-between'>
                    <span className='text-line-700 font-medium'>상환 방식</span>
                    <div className='flex flex-col items-end'>
                        <span>{repaymentMethod}</span>
                        <span>
                            매달 {repaymentDay}일 /{' '}
                            {loanAmount.toLocaleString()}원
                        </span>
                    </div>
                </div>
                <div className='flex justify-between'>
                    <span className='text-line-700 font-medium'>이자율</span>
                    <span>{interestRate}%</span>
                </div>
                <div className='flex justify-between'>
                    <span className='text-line-700 font-medium'>
                        중도상환 수수료
                    </span>
                    <span>{earlyRepaymentFeeRate}%</span>
                </div>
                <hr className='my-2 border-t border-gray-300' />

                {specialTerms?.length > 0 && (
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
    );
};

export default ContractDocument;
