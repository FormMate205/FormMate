import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { getSignatureStatus } from '@/entities/contract/model/getSignatureStatus';
import { ContractDocs } from '@/entities/contract/model/types';
import { formatCurrency } from '@/shared/lib/formatCurrency';

const styles = {
    container:
        'flex flex-col gap-4 pt-4 p-6 bg-white text-black w-full overflow-y-auto scrollbar-none',
    title: 'text-2xl font-medium text-center py-4 border-b border-[#bfc0d1]',
    label: 'font-semibold text-[#716b8a]',
    divider: 'border-t border-[#d1d5db] my-2',
    subtext: 'text-sm text-[#716b8a] ml-2',
    contractValue: 'flex justify-between',
    section: 'flex justify-between',
    groupedValues: 'flex flex-col items-end text-right',
    inputField: 'w-1/2 text-right',
    dateButton: 'flex items-center gap-2 border p-2 rounded-md',
};

interface EditableContractDocumentProps {
    contract: ContractDocs;
    isEditMode: boolean;
    onContractChange: (updatedContract: ContractDocs) => void;
}

const FormUpdateContent = ({
    contract,
    isEditMode,
    onContractChange,
}: EditableContractDocumentProps) => {
    const [editableContract, setEditableContract] =
        useState<ContractDocs>(contract);
    const [accordionValue, setAccordionValue] = useState<string | undefined>(
        'item-1',
    );
    const [newSpecialTerm, setNewSpecialTerm] = useState<string>('');

    useEffect(() => {
        setEditableContract(contract);
    }, [contract]);

    const handleChange = (field: keyof ContractDocs, value: any) => {
        const updatedContract = { ...editableContract, [field]: value };
        setEditableContract(updatedContract);
        onContractChange?.(updatedContract);
    };

    // const handleSpecialTermChange = (index: number, value: string) => {
    //     const updatedTerms = [...editableContract.specialTerms];
    //     updatedTerms[index] = {
    //         ...updatedTerms[index],
    //         specialTermDetail: value,
    //     };

    //     handleChange('specialTerms', updatedTerms);
    // };

    const addSpecialTerm = () => {
        if (!newSpecialTerm.trim()) return;

        const updatedTerms = [...(editableContract.specialTerms || [])];
        updatedTerms.push({
            specialTermIndex: (updatedTerms.length + 1).toString(),
            specialTermDetail: newSpecialTerm,
        });

        handleChange('specialTerms', updatedTerms);
        setNewSpecialTerm('');
    };

    const removeSpecialTerm = (index: number) => {
        const updatedTerms = [...editableContract.specialTerms];
        updatedTerms.splice(index, 1);

        // Reindex remaining terms
        updatedTerms.forEach((term, idx) => {
            term.specialTermIndex = (idx + 1).toString();
        });

        handleChange('specialTerms', updatedTerms);
    };

    const renderDateField = (
        field: 'contractDate' | 'maturityDate',
        label: string,
    ) => {
        const dateValue = editableContract[field];

        if (!isEditMode) {
            return (
                <div className={styles.contractValue}>
                    <span className={styles.label}>{label}</span>
                    <span>{format(new Date(dateValue), 'yyyy.MM.dd')}</span>
                </div>
            );
        }

        return (
            <div className={styles.contractValue}>
                <span className={styles.label}>{label}</span>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant='default' className={styles.dateButton}>
                            {dateValue
                                ? format(new Date(dateValue), 'yyyy.MM.dd')
                                : '날짜 선택'}
                            <CalendarIcon className='h-4 w-4' />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className='w-auto p-0'>
                        <Calendar
                            mode='single'
                            selected={new Date(dateValue)}
                            onSelect={(date) =>
                                handleChange(
                                    field,
                                    date?.toISOString() ||
                                        new Date().toISOString(),
                                )
                            }
                        />
                    </PopoverContent>
                </Popover>
            </div>
        );
    };

    return (
        <div id='contract-document' className={styles.container}>
            <div className={styles.title}>차용증</div>

            <article className='text-md flex flex-col gap-1'>
                <div className={styles.contractValue}>
                    <span className={styles.label}>채권자</span>
                    {isEditMode ? (
                        <div className='flex gap-2'>
                            <Input
                                className={styles.inputField}
                                value={editableContract.creditorName}
                                onChange={(e) =>
                                    handleChange('creditorName', e.target.value)
                                }
                                placeholder='이름'
                            />
                            <Input
                                className={styles.inputField}
                                value={editableContract.creditorPhone}
                                onChange={(e) =>
                                    handleChange(
                                        'creditorPhone',
                                        e.target.value,
                                    )
                                }
                                placeholder='전화번호'
                            />
                        </div>
                    ) : (
                        <div>
                            {editableContract.creditorName} /{' '}
                            {editableContract.creditorPhone}
                        </div>
                    )}
                </div>

                <div className={styles.contractValue}>
                    <span className={styles.label}>채무자</span>
                    {isEditMode ? (
                        <div className='flex gap-2'>
                            <Input
                                className={styles.inputField}
                                value={editableContract.debtorName}
                                onChange={(e) =>
                                    handleChange('debtorName', e.target.value)
                                }
                                placeholder='이름'
                            />
                            <Input
                                className={styles.inputField}
                                value={editableContract.debtorPhone}
                                onChange={(e) =>
                                    handleChange('debtorPhone', e.target.value)
                                }
                                placeholder='전화번호'
                            />
                        </div>
                    ) : (
                        <div>
                            {editableContract.debtorName} /{' '}
                            {editableContract.debtorPhone}
                        </div>
                    )}
                </div>

                <hr className={styles.divider} />

                <div className={styles.contractValue}>
                    <span className={styles.label}>입금계좌</span>
                    {isEditMode ? (
                        <div className='flex gap-2'>
                            <Input
                                className={styles.inputField}
                                value={editableContract.creditorBank}
                                onChange={(e) =>
                                    handleChange('creditorBank', e.target.value)
                                }
                                placeholder='은행'
                            />
                            <Input
                                className={styles.inputField}
                                value={editableContract.creditorAccount}
                                onChange={(e) =>
                                    handleChange(
                                        'creditorAccount',
                                        e.target.value,
                                    )
                                }
                                placeholder='계좌번호'
                            />
                        </div>
                    ) : (
                        <div className='flex gap-2'>
                            <span>{editableContract.creditorBank}</span>
                            <span>{editableContract.creditorAccount}</span>
                        </div>
                    )}
                </div>

                <hr className={styles.divider} />

                {renderDateField('contractDate', '계약 체결')}
                {renderDateField('maturityDate', '계약 만기')}

                <hr className={styles.divider} />

                <div className={styles.contractValue}>
                    <span className={styles.label}>상환 방식</span>
                    {isEditMode ? (
                        <div className={styles.groupedValues}>
                            <Select
                                value={editableContract.repaymentMethod}
                                onValueChange={(value) =>
                                    handleChange('repaymentMethod', value)
                                }
                            >
                                <SelectTrigger className='w-40'>
                                    <SelectValue placeholder='상환 방식 선택' />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value='원리금균등'>
                                        원리금균등
                                    </SelectItem>
                                    <SelectItem value='원금균등'>
                                        원금균등
                                    </SelectItem>
                                    <SelectItem value='만기일시'>
                                        만기일시
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            <div className='mt-2 flex gap-2'>
                                <Input
                                    type='number'
                                    className='w-20'
                                    value={editableContract.repaymentDay}
                                    onChange={(e) =>
                                        handleChange(
                                            'repaymentDay',
                                            e.target.value,
                                        )
                                    }
                                    placeholder='일'
                                />
                                <Input
                                    type='number'
                                    className='w-40'
                                    value={editableContract.loanAmount}
                                    onChange={(e) =>
                                        handleChange(
                                            'loanAmount',
                                            Number(e.target.value),
                                        )
                                    }
                                    placeholder='금액'
                                />
                            </div>
                        </div>
                    ) : (
                        <div className={styles.groupedValues}>
                            <span>{editableContract.repaymentMethod}</span>
                            <span>
                                매달 {editableContract.repaymentDay}일 /{' '}
                                {formatCurrency(editableContract.loanAmount)}
                            </span>
                        </div>
                    )}
                </div>

                <div className={styles.contractValue}>
                    <span className={styles.label}>이자율</span>
                    {isEditMode ? (
                        <div className='flex items-center'>
                            <Input
                                type='number'
                                className='w-20'
                                value={editableContract.interestRate}
                                onChange={(e) =>
                                    handleChange(
                                        'interestRate',
                                        Number(e.target.value),
                                    )
                                }
                                placeholder='이자율'
                            />
                            <span className='ml-2'>%</span>
                        </div>
                    ) : (
                        <span>{editableContract.interestRate}%</span>
                    )}
                </div>

                <div className={styles.contractValue}>
                    <span className={styles.label}>중도상환 수수료</span>
                    {isEditMode ? (
                        <div className='flex items-center'>
                            <Input
                                type='number'
                                className='w-20'
                                value={editableContract.earlyRepaymentFeeRate}
                                onChange={(e) =>
                                    handleChange(
                                        'earlyRepaymentFeeRate',
                                        Number(e.target.value),
                                    )
                                }
                                placeholder='수수료'
                            />
                            <span className='ml-2'>%</span>
                        </div>
                    ) : (
                        <span>{editableContract.earlyRepaymentFeeRate}%</span>
                    )}
                </div>

                <hr className={styles.divider} />

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
                            {isEditMode ? (
                                <div className='flex flex-col gap-3'>
                                    {editableContract.specialTerms?.map(
                                        (term, index) => (
                                            <div
                                                key={index}
                                                className='flex gap-2'
                                            >
                                                <span className='mt-2'>
                                                    {term.specialTermIndex}.
                                                </span>
                                                <p>{term.specialTermDetail}</p>
                                                <Button
                                                    variant='primary'
                                                    onClick={() =>
                                                        removeSpecialTerm(index)
                                                    }
                                                    className='mt-2'
                                                >
                                                    삭제
                                                </Button>
                                            </div>
                                        ),
                                    )}
                                    <div className='mt-2 flex gap-2'>
                                        <Button
                                            onClick={addSpecialTerm}
                                            className='mt-2'
                                        >
                                            추가
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div className='flex flex-col gap-2 text-base'>
                                    {editableContract.specialTerms?.map(
                                        (term) => (
                                            <span key={term.specialTermIndex}>
                                                {term.specialTermIndex}.{' '}
                                                {term.specialTermDetail}
                                            </span>
                                        ),
                                    )}
                                </div>
                            )}
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>

                <div className='flex justify-center p-4 text-lg font-medium'>
                    {format(new Date(), 'yyyy.MM.dd')}
                </div>

                <div className='flex flex-col items-end text-right font-medium'>
                    <div>
                        <span>{editableContract.creditorName}</span>
                        <span className={styles.subtext}>
                            {getSignatureStatus(
                                editableContract.status,
                                'creditor',
                            )}
                        </span>
                    </div>
                    <div>
                        <span>{editableContract.debtorName}</span>
                        <span className={styles.subtext}>
                            {getSignatureStatus(
                                editableContract.status,
                                'debtor',
                            )}
                        </span>
                    </div>
                </div>
            </article>
        </div>
    );
};

export default FormUpdateContent;
