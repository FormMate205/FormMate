import { format } from 'date-fns';
import { PlusCircle, MinusCircle, Calendar, User } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
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
import { DatePicker } from '@/shared/ui/DatePicker';
import { specialTermsInfo } from '../config/formDraftQuestions';

const styles = {
    container:
        'flex flex-col gap-4 bg-white text-black w-full overflow-y-auto scrollbar-none',
    section: 'flex w-full flex-col gap-3',
    title: 'text-primary-500 text-lg font-semibold',
    label: 'font-medium',
    divider: 'border-t border-[#d1d5db] my-2',
    subtext: 'text-sm text-[#716b8a] ml-2',
    contractValue: 'flex justify-between items-center',
    groupedValues: 'flex flex-col items-end text-right',
    dateButton: 'flex items-center gap-2 border p-2 rounded-md',
    readOnlyField: 'text-gray-600 flex justify-end items-center gap-2',
    specialTermCard: 'mb-3 border border-gray-200 shadow-sm',
    termHeader: 'flex justify-between items-center',
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

    // 사용자가 선택한/선택하지 않은 특약 분리
    const [selectedTerms, setSelectedTerms] = useState<any[]>([]);
    const [unselectedTerms, setUnselectedTerms] = useState<any[]>([]);

    useEffect(() => {
        setEditableContract(contract);

        // 특약사항 분리 로직
        if (contract.specialTerms) {
            const selectedIds = contract.specialTerms.map(
                (term) =>
                    specialTermsInfo.find(
                        (info) => info.content === term.specialTermDetail,
                    )?.id || '',
            );

            const selected = specialTermsInfo.filter((term) =>
                selectedIds.includes(term.id),
            );

            const unselected = specialTermsInfo.filter(
                (term) => !selectedIds.includes(term.id),
            );

            setSelectedTerms(selected);
            setUnselectedTerms(unselected);
        } else {
            setSelectedTerms([]);
            setUnselectedTerms([...specialTermsInfo]);
        }
    }, [contract]);

    const handleChange = (field: keyof ContractDocs, value: any) => {
        const updatedContract = { ...editableContract, [field]: value };
        setEditableContract(updatedContract);
        onContractChange?.(updatedContract);
    };

    const addSpecialTerm = (termToAdd: any) => {
        // 선택 목록으로 이동
        setSelectedTerms([...selectedTerms, termToAdd]);
        setUnselectedTerms(
            unselectedTerms.filter((term) => term.id !== termToAdd.id),
        );

        // contract 업데이트
        const updatedTerms = [...(editableContract.specialTerms || [])];
        updatedTerms.push({
            specialTermIndex: (updatedTerms.length + 1).toString(),
            specialTermDetail: termToAdd.content,
        });

        handleChange('specialTerms', updatedTerms);
    };

    const removeSpecialTerm = (termToRemove: any) => {
        // 미선택 목록으로 이동
        setUnselectedTerms([...unselectedTerms, termToRemove]);
        setSelectedTerms(
            selectedTerms.filter((term) => term.id !== termToRemove.id),
        );

        // contract에서 삭제
        const termIndex = editableContract.specialTerms.findIndex(
            (term) => term.specialTermDetail === termToRemove.content,
        );

        if (termIndex !== -1) {
            const updatedTerms = [...editableContract.specialTerms];
            updatedTerms.splice(termIndex, 1);

            // Reindex remaining terms
            updatedTerms.forEach((term, idx) => {
                term.specialTermIndex = (idx + 1).toString();
            });

            handleChange('specialTerms', updatedTerms);
        }
    };

    const renderDateField = (
        field: 'contractDate' | 'maturityDate',
        label: string,
        isEditable: boolean = true,
    ) => {
        const dateValue = editableContract[field];

        if (!isEditMode || !isEditable) {
            return (
                <div className={styles.contractValue}>
                    <span className={styles.label}>{label}</span>
                    <div className={styles.readOnlyField}>
                        <Calendar className='h-4 w-4' />
                        <span>{format(new Date(dateValue), 'yyyy.MM.dd')}</span>
                    </div>
                </div>
            );
        }

        return (
            <div className={styles.contractValue}>
                <span className={styles.label}>{label}</span>
                <DatePicker />
            </div>
        );
    };

    return (
        <div id='contract-document' className={styles.container}>
            <article className='flex flex-col gap-6'>
                {/* 채권자 정보 */}
                <div className={styles.section}>
                    <p className={styles.title}>채권자 정보</p>
                    <div className={styles.contractValue}>
                        <span className={styles.label}>이름</span>
                        <div className={styles.readOnlyField}>
                            <User className='h-4 w-4' />
                            <span>{editableContract.creditorName}</span>
                        </div>
                    </div>
                    <div className={styles.contractValue}>
                        <span className={styles.label}>전화번호</span>
                        {isEditMode ? (
                            <Input
                                variant='default'
                                value={editableContract.creditorPhone}
                                onChange={(e) =>
                                    handleChange(
                                        'creditorPhone',
                                        e.target.value,
                                    )
                                }
                                placeholder='전화번호'
                            />
                        ) : (
                            <div>{editableContract.creditorPhone}</div>
                        )}
                    </div>
                </div>

                {/* 채무자 정보 */}
                <div className={styles.section}>
                    <p className={styles.title}>채무자 정보</p>
                    <div className={styles.contractValue}>
                        <span className={styles.label}>이름</span>
                        <div className={styles.readOnlyField}>
                            <User className='h-4 w-4' />
                            <span>{editableContract.debtorName}</span>
                        </div>
                    </div>
                    <div className={styles.contractValue}>
                        <span className={styles.label}>전화번호</span>
                        {isEditMode ? (
                            <Input
                                variant='default'
                                value={editableContract.debtorPhone}
                                onChange={(e) =>
                                    handleChange(
                                        'creditorPhone',
                                        e.target.value,
                                    )
                                }
                                placeholder='전화번호'
                            />
                        ) : (
                            <div>{editableContract.debtorPhone}</div>
                        )}
                    </div>
                </div>

                {/* 계좌 정보 */}
                <div className={styles.section}>
                    <p className={styles.title}>입금 계좌</p>
                    {isEditMode ? (
                        <div className='flex gap-2'>
                            <div className='w-1/2'>
                                <label className='mb-1 block text-sm text-gray-500'>
                                    은행
                                </label>
                                <Input
                                    value={editableContract.creditorBank}
                                    onChange={(e) =>
                                        handleChange(
                                            'creditorBank',
                                            e.target.value,
                                        )
                                    }
                                    placeholder='은행'
                                />
                            </div>
                            <div className='w-1/2'>
                                <label className='mb-1 block text-sm text-gray-500'>
                                    계좌번호
                                </label>
                                <Input
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
                        </div>
                    ) : (
                        <div className='flex gap-2'>
                            <span>{editableContract.creditorBank}</span>
                            <span>{editableContract.creditorAccount}</span>
                        </div>
                    )}
                </div>

                {/* 계약 일자 */}
                <div className={styles.section}>
                    <p className={styles.title}>계약 기간</p>
                    {renderDateField('contractDate', '계약 체결', false)}
                    {renderDateField('maturityDate', '계약 만기')}
                </div>

                {/* 상환 정보 */}
                <div className={styles.section}>
                    <p className={styles.title}>상환 정보</p>
                    <div className={styles.contractValue}>
                        <span className={styles.label}>상환 방식</span>
                        {isEditMode ? (
                            <Select
                                value={editableContract.repaymentMethod}
                                onValueChange={(value) =>
                                    handleChange('repaymentMethod', value)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder='상환 방식 선택' />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value='원리금균등상환'>
                                        원리금균등상환
                                    </SelectItem>
                                    <SelectItem value='원금균등상환'>
                                        원금균등상환
                                    </SelectItem>
                                    <SelectItem value='원금상환'>
                                        원금상환
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        ) : (
                            <span>{editableContract.repaymentMethod}</span>
                        )}
                    </div>

                    <div className={styles.contractValue}>
                        <span className={styles.label}>납부일</span>
                        {isEditMode ? (
                            <div className='w-1/2'>
                                <Input
                                    variant='default'
                                    value={editableContract.repaymentDay}
                                    onChange={(e) =>
                                        handleChange(
                                            'repaymentDay',
                                            e.target.value,
                                        )
                                    }
                                    placeholder='납부일'
                                />
                            </div>
                        ) : (
                            <span>매달 {editableContract.repaymentDay}일</span>
                        )}
                    </div>

                    <div className={styles.contractValue}>
                        <span className={styles.label}>대출 금액</span>
                        {isEditMode ? (
                            <div className='w-1/2'>
                                <Input
                                    variant='default'
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
                        ) : (
                            <span>
                                {formatCurrency(editableContract.loanAmount)}
                            </span>
                        )}
                    </div>

                    <div className={styles.contractValue}>
                        <span className={styles.label}>이자율</span>
                        {isEditMode ? (
                            <div className='flex w-1/4 items-center'>
                                <Input
                                    variant='default'
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
                            <div className='flex w-1/4 items-center'>
                                <Input
                                    variant='default'
                                    value={
                                        editableContract.earlyRepaymentFeeRate
                                    }
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
                            <span>
                                {editableContract.earlyRepaymentFeeRate}%
                            </span>
                        )}
                    </div>
                </div>

                {/* 특약사항 */}
                <div className={styles.section}>
                    <p className={styles.title}>특약 사항</p>
                    {isEditMode ? (
                        <div className='flex flex-col gap-4'>
                            {/* 선택된 특약 */}
                            {selectedTerms.length > 0 && (
                                <div>
                                    <h3 className='mb-2 font-medium text-[#716b8a]'>
                                        선택한 특약
                                    </h3>
                                    <div className='space-y-3'>
                                        {selectedTerms.map((term) => (
                                            <Card
                                                key={term.id}
                                                className={
                                                    styles.specialTermCard
                                                }
                                            >
                                                <CardHeader className='pb-1'>
                                                    <div
                                                        className={
                                                            styles.termHeader
                                                        }
                                                    >
                                                        <CardTitle className='text-base'>
                                                            {term.title}
                                                        </CardTitle>
                                                        <Button
                                                            variant='default'
                                                            onClick={() =>
                                                                removeSpecialTerm(
                                                                    term,
                                                                )
                                                            }
                                                        >
                                                            <MinusCircle className='mr-1 h-4 w-4' />{' '}
                                                            삭제
                                                        </Button>
                                                    </div>
                                                </CardHeader>
                                                <CardContent className='pt-1'>
                                                    <p className='text-sm text-gray-600'>
                                                        {term.content}
                                                    </p>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* 선택되지 않은 특약 */}
                            {unselectedTerms.length > 0 && (
                                <div>
                                    <h3 className='mb-2 font-medium text-[#716b8a]'>
                                        추가 가능한 특약
                                    </h3>
                                    <div className='space-y-3'>
                                        {unselectedTerms.map((term) => (
                                            <Card
                                                key={term.id}
                                                className={
                                                    styles.specialTermCard
                                                }
                                            >
                                                <CardHeader className='pb-1'>
                                                    <div
                                                        className={
                                                            styles.termHeader
                                                        }
                                                    >
                                                        <CardTitle className='text-base'>
                                                            {term.title}
                                                        </CardTitle>
                                                        <Button
                                                            variant='default'
                                                            onClick={() =>
                                                                addSpecialTerm(
                                                                    term,
                                                                )
                                                            }
                                                        >
                                                            <PlusCircle className='mr-1 h-4 w-4' />{' '}
                                                            추가
                                                        </Button>
                                                    </div>
                                                </CardHeader>
                                                <CardContent className='pt-1'>
                                                    <p className='text-sm text-gray-600'>
                                                        {term.content}
                                                    </p>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        // 읽기 전용 모드
                        <div className='flex flex-col gap-2'>
                            {editableContract.specialTerms?.map((term) => (
                                <div
                                    key={term.specialTermIndex}
                                    className='mb-2 border-b pb-2'
                                >
                                    <p className='font-medium'>
                                        {term.specialTermIndex}.{' '}
                                        {specialTermsInfo.find(
                                            (info) =>
                                                info.content ===
                                                term.specialTermDetail,
                                        )?.title || '특약사항'}
                                    </p>
                                    <p className='mt-1 text-sm text-gray-600'>
                                        {term.specialTermDetail}
                                    </p>
                                </div>
                            ))}
                            {(!editableContract.specialTerms ||
                                editableContract.specialTerms.length === 0) && (
                                <p className='text-gray-500 italic'>
                                    특약사항이 없습니다.
                                </p>
                            )}
                        </div>
                    )}
                </div>

                {/* 서명 영역 */}
                <Card className='mt-4 border-gray-200 shadow-sm'>
                    <CardContent className='pt-4'>
                        <div className='flex justify-center p-4 text-lg font-medium'>
                            {format(new Date(), 'yyyy.MM.dd')}
                        </div>

                        <div className='flex flex-col items-end text-right font-medium'>
                            <div className='mb-1'>
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
                    </CardContent>
                </Card>
            </article>
        </div>
    );
};

export default FormUpdateContent;
