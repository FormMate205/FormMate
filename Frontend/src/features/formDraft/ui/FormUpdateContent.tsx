import { format } from 'date-fns';
import { Calendar, User } from 'lucide-react';
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
import { SpecialTerm } from '@/entities/contract/model/types';
import { usePutFormDraft } from '@/features/formDraft/api/formDraftAPI';
import { formatCurrency } from '@/shared/lib/formatCurrency';
import { DatePicker } from '@/shared/ui/DatePicker';
import { specialTermsInfo } from '../../../entities/formDraft/config/formDraftQuestions';
import { FormUpdateRequest } from '../../../entities/formDraft/model/types';

const styles = {
    container:
        'flex flex-col gap-4 bg-white text-black w-full overflow-y-auto scrollbar-none',
    section: 'flex w-full flex-col gap-3',
    title: 'text-primary-500 text-lg font-semibold',
    label: 'font-medium',
    divider: 'border-t border-line-300 my-2',
    subtext: 'text-line-700 ml-2',
    contractValue: 'flex justify-between items-center',
    groupedValues: 'flex flex-col items-end text-right',
    dateButton: 'flex items-center gap-2 border p-2 rounded-md',
    readOnlyField: 'text-gray-600 flex justify-end items-center gap-2',
    specialTermCard: 'border border-line-300 shadow-sm',
    termHeader: 'flex w-full justify-between items-center',
};

interface EditableContractDocumentProps {
    formId: string;
    contract: FormUpdateRequest;
}

const FormUpdateContent = ({
    formId,
    contract,
}: EditableContractDocumentProps) => {
    // 계약서 수정 유무
    const [isEditMode, setIsEditMode] = useState(false);

    // 수정모드 유무 변경
    const onChangeUpdate = () => {
        setIsEditMode(true);
    };

    const onChangeReadOnly = () => {
        setIsEditMode(false);
    };

    // 계약서 수정 API
    const { mutate } = usePutFormDraft(formId);

    const handleSave = () => {
        mutate(editableContract);
        setIsEditMode(false);
    };

    // 계약서 수정값 관리
    const [editableContract, setEditableContract] =
        useState<FormUpdateRequest>(contract);

    // 사용자가 선택한/선택하지 않은 특약 분리
    const [selectedTerms, setSelectedTerms] = useState<SpecialTerm[]>([]);
    const [unselectedTerms, setUnselectedTerms] = useState<SpecialTerm[]>([]);

    useEffect(() => {
        const updateRequestData: FormUpdateRequest = {
            creditorName: contract.creditorName,
            creditorAddress: contract.creditorAddress,
            creditorPhone: contract.creditorPhone,
            creditorBank: contract.creditorBank,
            creditorAccount: contract.creditorAccount,
            debtorName: contract.debtorName,
            debtorAddress: contract.debtorAddress,
            debtorPhone: contract.debtorPhone,
            debtorBank: contract.debtorBank,
            debtorAccount: contract.debtorAccount,
            contractDate: contract.contractDate,
            maturityDate: contract.maturityDate,
            loanAmount: contract.loanAmount,
            repaymentMethod: contract.repaymentMethod,
            repaymentDay: contract.repaymentDay,
            interestRate: contract.interestRate,
            earlyRepaymentFeeRate: contract.earlyRepaymentFeeRate,
            overdueInterestRate: contract.overdueInterestRate,
            overdueLimit: contract.overdueLimit,
            specialTerms: contract.specialTerms || [],
        };

        setEditableContract(updateRequestData);

        // 특약사항 분리 로직
        if (contract.specialTerms) {
            const selectedIds = contract.specialTerms.map(
                (term) =>
                    specialTermsInfo.find(
                        (info) =>
                            info.specialTermDetail === term.specialTermDetail,
                    )?.specialTermIndex || '',
            );

            const selected = specialTermsInfo.filter((term) =>
                selectedIds.includes(term.specialTermIndex),
            );

            const unselected = specialTermsInfo.filter(
                (term) => !selectedIds.includes(term.specialTermIndex),
            );

            setSelectedTerms(selected);
            setUnselectedTerms(unselected);
        } else {
            setSelectedTerms([]);
            setUnselectedTerms([...specialTermsInfo]);
        }
    }, [contract]);

    const handleChange = (
        field: keyof FormUpdateRequest,
        value: SpecialTerm[] | string,
    ) => {
        const updatedContract = { ...editableContract, [field]: value };
        setEditableContract(updatedContract);
    };

    const addSpecialTerm = (termToAdd: SpecialTerm) => {
        // 선택 목록으로 이동
        setSelectedTerms([...selectedTerms, termToAdd]);
        setUnselectedTerms(
            unselectedTerms.filter(
                (term) => term.specialTermIndex !== termToAdd.specialTermIndex,
            ),
        );

        // contract 업데이트
        const updatedTerms = [...(editableContract.specialTerms || [])];
        updatedTerms.push({
            specialTermIndex: (updatedTerms.length + 1).toString(),
            specialTermDetail: termToAdd.specialTermDetail,
        });

        handleChange('specialTerms', updatedTerms);
    };

    const removeSpecialTerm = (termToRemove: SpecialTerm) => {
        // 미선택 목록으로 이동
        setUnselectedTerms([...unselectedTerms, termToRemove]);
        setSelectedTerms(
            selectedTerms.filter(
                (term) =>
                    term.specialTermIndex !== termToRemove.specialTermIndex,
            ),
        );

        // contract에서 삭제
        const termIndex = editableContract.specialTerms.findIndex(
            (term) => term.specialTermDetail === termToRemove.specialTermDetail,
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

    // 상환 날짜 선택 관리
    const [selectedDate, setSelectedDate] = useState<Date>();

    const handleDateSelect = (date: Date | undefined) => {
        setSelectedDate(date);
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

                <DatePicker
                    onSelect={handleDateSelect}
                    selectedDate={selectedDate}
                />
            </div>
        );
    };

    return (
        <div className='flex max-h-[500px] w-full flex-col py-4'>
            <div className='flex w-full justify-between py-2'>
                <p className='text-xl font-bold'>금전 차용 계약서</p>
                {isEditMode ? (
                    <div className='flex gap-1'>
                        <Button
                            variant={'choiceFill'}
                            children='저장'
                            onClick={handleSave}
                        />
                        <Button
                            variant={'choiceEmpty'}
                            children='취소'
                            onClick={onChangeReadOnly}
                        />
                    </div>
                ) : (
                    <Button
                        variant={'choiceEmpty'}
                        children='수정'
                        onClick={onChangeUpdate}
                    />
                )}
            </div>
            <br />
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
                            <span className={styles.label}>주소</span>
                            <div className={styles.readOnlyField}>
                                <span>{editableContract.creditorAddress}</span>
                            </div>
                        </div>
                        <div className={styles.contractValue}>
                            <span className={styles.label}>전화번호</span>
                            {isEditMode ? (
                                <div>
                                    <Input
                                        variant='default'
                                        className='w-[125px] px-3 py-2 text-right'
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
                            <span className={styles.label}>주소</span>
                            <div className={styles.readOnlyField}>
                                <span>{editableContract.debtorAddress}</span>
                            </div>
                        </div>
                        <div className={styles.contractValue}>
                            <span className={styles.label}>전화번호</span>
                            {isEditMode ? (
                                <div>
                                    <Input
                                        variant='default'
                                        className='w-[125px] px-3 py-2 text-right'
                                        value={editableContract.debtorPhone}
                                        onChange={(e) =>
                                            handleChange(
                                                'debtorPhone',
                                                e.target.value,
                                            )
                                        }
                                        placeholder='전화번호'
                                    />
                                </div>
                            ) : (
                                <div>{editableContract.debtorPhone}</div>
                            )}
                        </div>
                    </div>

                    {/* 계좌 정보 */}
                    <div className={styles.section}>
                        <p className={styles.title}>입금 계좌</p>
                        {isEditMode ? (
                            <div className='flex flex-col gap-2'>
                                <div className='flex w-full items-center justify-between'>
                                    <p className={styles.label}>은행</p>
                                    <div>
                                        <Select
                                            value={
                                                editableContract.creditorBank
                                            }
                                            onValueChange={(value) =>
                                                handleChange(
                                                    'creditorBank',
                                                    value,
                                                )
                                            }
                                        >
                                            <SelectTrigger className='w-[125px]'>
                                                <SelectValue placeholder='은행 선택' />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value='기업은행'>
                                                    기업은행
                                                </SelectItem>
                                                <SelectItem value='국민은행'>
                                                    국민은행
                                                </SelectItem>
                                                <SelectItem value='농협은행'>
                                                    농협은행
                                                </SelectItem>
                                                <SelectItem value='우리은행'>
                                                    우리은행
                                                </SelectItem>
                                                <SelectItem value='새마을금고'>
                                                    새마을금고
                                                </SelectItem>
                                                <SelectItem value='KEB하나은행'>
                                                    KEB하나은행
                                                </SelectItem>
                                                <SelectItem value='신한은행'>
                                                    신한은행
                                                </SelectItem>
                                                <SelectItem value='카카오뱅크'>
                                                    카카오뱅크
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className='flex w-full items-center justify-between'>
                                    <p className={styles.label}>계좌번호</p>
                                    <div>
                                        <Input
                                            variant='default'
                                            className='w-[200px] px-3 py-2 text-right'
                                            value={
                                                editableContract.creditorAccount
                                            }
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
                        {renderDateField('contractDate', '계약 체결일', false)}
                        {renderDateField('maturityDate', '계약 만기일')}
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
                                <div>
                                    <Input
                                        variant='default'
                                        className='w-[65px] px-3 py-2 text-right'
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
                                <span>
                                    매달 {editableContract.repaymentDay}일
                                </span>
                            )}
                        </div>

                        <div className={styles.contractValue}>
                            <span className={styles.label}>대출 금액</span>
                            {isEditMode ? (
                                <div>
                                    <Input
                                        variant='default'
                                        className='w-[200px] px-3 py-2 text-right'
                                        value={editableContract.loanAmount}
                                        onChange={(e) =>
                                            handleChange(
                                                'loanAmount',
                                                e.target.value,
                                            )
                                        }
                                        placeholder='대출 금액'
                                    />
                                </div>
                            ) : (
                                <span>
                                    {formatCurrency(
                                        editableContract.loanAmount,
                                    )}
                                </span>
                            )}
                        </div>

                        <div className={styles.contractValue}>
                            <span className={styles.label}>이자율</span>
                            {isEditMode ? (
                                <div className='flex w-1/4 items-center'>
                                    <Input
                                        variant='default'
                                        className='px-3 py-2 text-right'
                                        value={editableContract.interestRate}
                                        onChange={(e) =>
                                            handleChange(
                                                'interestRate',
                                                e.target.value,
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
                            <span className={styles.label}>
                                중도상환 수수료
                            </span>
                            {isEditMode ? (
                                <div className='flex w-1/4 items-center'>
                                    <Input
                                        variant='default'
                                        className='px-3 py-2 text-right'
                                        value={
                                            editableContract.earlyRepaymentFeeRate
                                        }
                                        onChange={(e) =>
                                            handleChange(
                                                'earlyRepaymentFeeRate',
                                                e.target.value,
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
                                    <div className='flex flex-col gap-2'>
                                        <p className='text-line-700 font-medium'>
                                            선택한 특약
                                        </p>
                                        <div className='space-y-3'>
                                            {selectedTerms.map((term) => (
                                                <Card
                                                    key={term.specialTermIndex}
                                                    className={
                                                        styles.specialTermCard
                                                    }
                                                >
                                                    <CardContent>
                                                        <p className='text-line-900 px-5'>
                                                            {
                                                                term.specialTermDetail
                                                            }
                                                        </p>
                                                    </CardContent>
                                                    <CardHeader>
                                                        <div
                                                            className={
                                                                styles.termHeader
                                                            }
                                                        >
                                                            <CardTitle></CardTitle>
                                                            <Button
                                                                variant='default'
                                                                children='삭제'
                                                                onClick={() =>
                                                                    removeSpecialTerm(
                                                                        term,
                                                                    )
                                                                }
                                                            />
                                                        </div>
                                                    </CardHeader>
                                                </Card>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className={styles.divider} />

                                {/* 선택되지 않은 특약 */}
                                {unselectedTerms.length > 0 && (
                                    <div className='flex flex-col gap-2'>
                                        <p className='text-line-700 font-medium'>
                                            선택하지 않은 특약
                                        </p>
                                        <div className='space-y-3'>
                                            {unselectedTerms.map((term) => (
                                                <Card
                                                    key={term.specialTermIndex}
                                                    className={
                                                        styles.specialTermCard
                                                    }
                                                >
                                                    <CardContent>
                                                        <p className='text-line-900 px-5'>
                                                            {
                                                                term.specialTermDetail
                                                            }
                                                        </p>
                                                    </CardContent>
                                                    <CardHeader>
                                                        <div
                                                            className={
                                                                styles.termHeader
                                                            }
                                                        >
                                                            <CardTitle></CardTitle>
                                                            <Button
                                                                variant='default'
                                                                children='추가'
                                                                onClick={() =>
                                                                    addSpecialTerm(
                                                                        term,
                                                                    )
                                                                }
                                                            />
                                                        </div>
                                                    </CardHeader>
                                                </Card>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            // 읽기 전용 모드
                            <div className='flex flex-col gap-2'>
                                {editableContract.specialTerms?.map(
                                    (term, index) => (
                                        <div
                                            key={term.specialTermIndex}
                                            className='border-line-300 border-b py-2'
                                        >
                                            <p>
                                                {index + 1}.{' '}
                                                {term.specialTermDetail}
                                            </p>
                                        </div>
                                    ),
                                )}
                                {(!editableContract.specialTerms ||
                                    editableContract.specialTerms.length ===
                                        0) && (
                                    <p className='text-line-500'>
                                        특약사항이 없습니다.
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                </article>
            </div>
        </div>
    );
};

export default FormUpdateContent;
