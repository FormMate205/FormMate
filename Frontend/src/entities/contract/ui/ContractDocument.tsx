import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { formatCurrency } from '@/shared/model/formatCurrency';
import { ContractDocs } from '../model/types';

const styles = {
    container: 'flex flex-col gap-4 pt-4 p-6 bg-white text-black w-full',
    title: 'text-2xl font-medium text-center py-4 border-b border-[#bfc0d1]',
    label: 'font-semibold text-[#716b8a]',
    divider: 'border-t border-[#d1d5db] my-2',
    subtext: 'text-sm text-[#716b8a] ml-2',
    contractValue: 'flex justify-between',
    section: 'flex justify-between',
    groupedValues: 'flex flex-col items-end text-right',
};

interface ContractDocumentProps {
    contract: ContractDocs;
    isPdfMode?: boolean;
}

const ContractDocument = ({
    contract,
    isPdfMode = false,
}: ContractDocumentProps) => {
    const {
        status,
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

    const [accordionValue, setAccordionValue] = useState<string | undefined>(
        'item-1',
    );

    const getSignatureStatus = (role: 'creditor' | 'debtor') => {
        if (status === '상대 승인전') return '(전자서명 미완료)';
        if (status === '상대승인후') {
            return role === 'debtor' ? '(전자서명 완료)' : '(전자서명 미완료)';
        }
        return '(전자서명 완료)';
    };

    useEffect(() => {
        if (isPdfMode) setAccordionValue('item-1');
    }, [isPdfMode]);

    return (
        <div id='contract-document' className={styles.container}>
            <div className={styles.title}>차용증</div>

            <article className='text-md flex flex-col gap-1'>
                <div className={styles.contractValue}>
                    <span className={styles.label}>채권자</span>
                    <div>
                        {creditorName} / {creditorPhone}
                    </div>
                </div>

                <div className={styles.contractValue}>
                    <span className={styles.label}>채무자</span>
                    <div>
                        {debtorName} / {debtorPhone}
                    </div>
                </div>

                <hr className={styles.divider} />

                <div className={styles.contractValue}>
                    <span className={styles.label}>입금계좌</span>
                    <div className='flex gap-2'>
                        <span>{creditorBank}</span>
                        <span>{creditorAccount}</span>
                    </div>
                </div>

                <hr className={styles.divider} />

                <div className={styles.contractValue}>
                    <span className={styles.label}>계약 체결</span>
                    <span>{format(new Date(contractDate), 'yyyy.MM.dd')}</span>
                </div>

                <div className={styles.contractValue}>
                    <span className={styles.label}>계약 만기</span>
                    <span>{format(new Date(maturityDate), 'yyyy.MM.dd')}</span>
                </div>

                <hr className={styles.divider} />

                <div className={styles.contractValue}>
                    <span className={styles.label}>상환 방식</span>
                    <div className={styles.groupedValues}>
                        <span>{repaymentMethod}</span>
                        <span>
                            매달 {repaymentDay}일 / {formatCurrency(loanAmount)}
                        </span>
                    </div>
                </div>

                <div className={styles.contractValue}>
                    <span className={styles.label}>이자율</span>
                    <span>{interestRate}%</span>
                </div>

                <div className={styles.contractValue}>
                    <span className={styles.label}>중도상환 수수료</span>
                    <span>{earlyRepaymentFeeRate}%</span>
                </div>

                <hr className={styles.divider} />

                {specialTerms?.length > 0 && (
                    <Accordion
                        type='single'
                        collapsible
                        value={accordionValue}
                        onValueChange={setAccordionValue}
                        className='pb-2'
                    >
                        <AccordionItem value='item-1'>
                            <AccordionTrigger>
                                <span className={styles.label}>특약사항</span>
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

                <div className='flex justify-center p-4 text-lg font-medium'>
                    {format(new Date(), 'yyyy.MM.dd')}
                </div>

                <div className='flex flex-col items-end text-right font-medium'>
                    <div>
                        <span>{creditorName}</span>
                        <span className={styles.subtext}>
                            {getSignatureStatus('creditor')}
                        </span>
                    </div>
                    <div>
                        <span>{debtorName}</span>
                        <span className={styles.subtext}>
                            {getSignatureStatus('debtor')}
                        </span>
                    </div>
                </div>
            </article>
        </div>
    );
};

export default ContractDocument;
