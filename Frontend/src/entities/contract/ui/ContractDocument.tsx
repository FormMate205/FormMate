import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { formatCurrency } from '@/shared/lib/formatCurrency';
import { getSignatureStatus } from '../model/getSignatureStatus';
import { Contract } from '../model/types';

const styles = {
    container:
        'flex flex-col gap-4 pt-4 p-6 bg-white text-black w-full whitespace-nowrap',
    title: 'text-2xl font-medium text-center py-4 border-b border-[#bfc0d1] whitespace-nowrap',
    label: 'font-semibold text-[#716b8a] whitespace-nowrap',
    divider: 'border-t border-[#d1d5db] my-2 whitespace-nowrap',
    subtext: 'text-sm text-[#716b8a] ml-2 whitespace-nowrap',
    contractValue: 'flex justify-between whitespace-nowrap',
    section: 'flex justify-between whitespace-nowrap',
    groupedValues: 'flex flex-col items-end text-right whitespace-nowrap',
};

interface ContractDocumentProps {
    contract: Contract;
    isPdfMode?: boolean;
}

const ContractDocument = ({
    contract,
    isPdfMode = false,
}: ContractDocumentProps) => {
    const {
        status,
        creditorName, // 채권자
        creditorPhone,
        creditorAddress,
        debtorAddress,
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
        overdueLimit,
        overdueInterestRate,
    } = contract;

    const [accordionValue, setAccordionValue] = useState<string | undefined>(
        'item-1',
    );

    useEffect(() => {
        if (isPdfMode) setAccordionValue('item-1');
    }, [isPdfMode]);

    return (
        <div id='contract-document' className={styles.container}>
            <div className={styles.title}>차용증</div>

            <article className='flex flex-col gap-1 text-md'>
                <div className={styles.contractValue}>
                    <span className={styles.label}>채권자</span>
                    <div className='flex flex-col items-end'>
                        <div>
                            {creditorName} / {creditorPhone}
                        </div>
                        <div className={styles.subtext}>{creditorAddress}</div>
                    </div>
                </div>

                <div className={styles.contractValue}>
                    <span className={styles.label}>채무자</span>
                    <div className='flex flex-col items-end'>
                        <div>
                            {debtorName} / {debtorPhone}
                        </div>
                        <div className={styles.subtext}>{debtorAddress}</div>
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
                    <span>
                        {format(new Date(contractDate), 'yyyy년 MM월 dd일')}
                    </span>
                </div>

                <div className={styles.contractValue}>
                    <span className={styles.label}>계약 만기</span>
                    <span>
                        {format(new Date(maturityDate), 'yyyy년 MM월 dd일')}
                    </span>
                </div>

                <hr className={styles.divider} />

                <div className={styles.contractValue}>
                    <span className={styles.label}>원금</span>
                    <span>{formatCurrency(loanAmount)}</span>
                </div>

                <div className={styles.contractValue}>
                    <span className={styles.label}>상환방식</span>
                    <div className={styles.groupedValues}>
                        <span>{repaymentMethod}</span>
                        <span className={styles.subtext}>
                            매월 {repaymentDay}일 상환
                        </span>
                    </div>
                </div>

                <hr className={styles.divider} />

                <div className={styles.contractValue}>
                    <span className={styles.label}>이자율</span>
                    <span>{interestRate}% (연)</span>
                </div>

                <div className={styles.contractValue}>
                    <span className={styles.label}>연체 이자율</span>
                    <span>{overdueInterestRate}% (연)</span>
                </div>

                <div className={styles.contractValue}>
                    <span className={styles.label}>연체 한도</span>
                    <span>{overdueLimit}일</span>
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
                                    {specialTerms.map((term, index) => (
                                        <span key={`special-term-${index}`}>
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
                    {format(new Date(), 'yyyy년 MM월 dd일')}
                </div>

                <div className='flex flex-col items-end font-medium text-right'>
                    <div>
                        <span>{creditorName}</span>
                        <span className={styles.subtext}>
                            {getSignatureStatus(status, 'creditor')}
                        </span>
                    </div>
                    <div>
                        <span>{debtorName}</span>
                        <span className={styles.subtext}>
                            {getSignatureStatus(status, 'debtor')}
                        </span>
                    </div>
                </div>
            </article>
        </div>
    );
};

export default ContractDocument;
