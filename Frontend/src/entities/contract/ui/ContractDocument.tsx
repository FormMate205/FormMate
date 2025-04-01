import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // 혹은 Next.js의 useRouter
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { formatCurrency } from '@/shared/model/formatCurrency';
import { useGetContractDetail } from '../api/ContractAPI';

const styles = {
    container: 'flex flex-col gap-4 pt-4 p-6 bg-white text-black ',
    title: 'text-2xl font-medium text-center py-4 border-b border-[#bfc0d1]',
    label: 'font-semibold text-[#716b8a]',
    divider: 'border-t border-[#d1d5db] my-2',
    subtext: 'text-sm text-[#716b8a] ml-2',
    contractValue: 'flex justify-between',
    section: 'flex justify-between',
    groupedValues: 'flex flex-col items-end text-right',
};

const ContractDocument = ({ isPdfMode = false }: { isPdfMode?: boolean }) => {
    const { formId } = useParams(); // or props로 받을 수도 있음
    const { data, isLoading, isError } = useGetContractDetail(formId as string);

    const [accordionValue, setAccordionValue] = useState<string | undefined>(
        'item-1',
    );

    useEffect(() => {
        if (isPdfMode) setAccordionValue('item-1');
    }, [isPdfMode]);

    if (isLoading) return <div>로딩 중...</div>;
    if (isError || !data) return <div>데이터를 불러오지 못했습니다.</div>;

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
                        <span className={styles.subtext}>(전자서명 완료)</span>
                    </div>
                    <div>
                        <span>{debtorName}</span>
                        <span className={styles.subtext}>(전자서명 완료)</span>
                    </div>
                </div>
            </article>
        </div>
    );
};

export default ContractDocument;
