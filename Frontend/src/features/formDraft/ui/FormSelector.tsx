import { format } from 'date-fns';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CalendarButton } from '@/components/ui/calendarButton';
import { Question } from '@/entities/formDraft/model/types';
import RepaymentMethodSelector from '@/entities/formDraft/ui/RepaymentMethodSelector';
import RoleSelector from '@/entities/formDraft/ui/RoleSelector';
import SpecialTermsSelector from '@/entities/formDraft/ui/SpecialTermSelector';
import { DatePicker } from '@/shared/ui/DatePicker';

interface FormSelectorProps {
    currentQuestion: Question | null;
    handleRoleSelect: (type: 'creditor' | 'debtor') => void;
    handleRepaymentMethodSelect: (method: string) => void;
    handleSpecialTermSelect: (termId: string, isSelected: boolean) => void;
    sendMessage: (content: string) => void;
    currentTermIndex: number;
}

const FormSelector = ({
    currentQuestion,
    handleRoleSelect,
    handleRepaymentMethodSelect,
    handleSpecialTermSelect,
    sendMessage,
    currentTermIndex,
}: FormSelectorProps) => {
    // 상환 날짜 선택 관리
    const [selectedDate, setSelectedDate] = useState<Date>();

    const handleDateSelect = (date: Date | undefined) => {
        setSelectedDate(date);
    };

    const handleConfirmDate = (date: Date | undefined) => {
        if (!date) return;
        sendMessage(format(date, 'yyyy-MM-dd'));
    };

    if (!currentQuestion) return null;

    switch (currentQuestion.type) {
        case 'role':
            return (
                <div className='my-4 flex w-full justify-start gap-4'>
                    <RoleSelector
                        type='creditor'
                        onClick={() => handleRoleSelect('creditor')}
                    />
                    <RoleSelector
                        type='debtor'
                        onClick={() => handleRoleSelect('debtor')}
                    />
                </div>
            );

        case 'boolean':
            return (
                <div className='flex w-full justify-start gap-2 px-2'>
                    {currentQuestion.options?.map((option) => (
                        <Button
                            key={option.label}
                            variant={`${option.value ? 'choiceFill' : 'choiceEmpty'}`}
                            children={option.label}
                            onClick={() => sendMessage(option.label)}
                        />
                    ))}
                </div>
            );

        case 'date': {
            return (
                <div className='flex w-full justify-start gap-2 px-1'>
                    <DatePicker
                        onSelect={handleDateSelect}
                        selectedDate={selectedDate}
                    />
                    <CalendarButton
                        variant={`${selectedDate ? 'default' : 'secondary'}`}
                        onClick={() => handleConfirmDate(selectedDate)}
                    >
                        확인
                    </CalendarButton>
                </div>
            );
        }

        case 'method':
            if (currentQuestion.options) {
                return (
                    <RepaymentMethodSelector
                        options={currentQuestion.options}
                        onSelect={handleRepaymentMethodSelect}
                    />
                );
            }
            return null;

        case 'specialTerms':
            return (
                <SpecialTermsSelector
                    currentTermIndex={currentTermIndex}
                    onSelect={handleSpecialTermSelect}
                />
            );

        default:
            return null;
    }
};

export default FormSelector;
