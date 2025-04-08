import { formatCurrency } from '@/shared/lib/formatCurrency';
import { usePostFormDraftSchedule } from '../api/formDraftScheduleAPI';
import { useFormDraftStore } from '../model/formDraftStore';
import FormDraftScheduleItem from './FormDraftScheduleItem';

interface FormDraftScheduleModalProps {
    type: string | boolean;
}

const FormDraftScheduleModal = ({ type }: FormDraftScheduleModalProps) => {
    const { formDraft } = useFormDraftStore();
    const { schedules, totalRepaymentAmount, lastItemRef } =
        usePostFormDraftSchedule({
            pageable: {
                page: '0',
                size: '10',
            },
            loanAmount: formDraft.loanAmount,
            maturityDate: formDraft.maturityDate,
            interestRate: formDraft.interestRate,
            repaymentDay: formDraft.repaymentDay,
            repaymentMethod: type as string,
        });

    return (
        <div className='flex w-full flex-col justify-between gap-9'>
            <div className='flex flex-col gap-2'>
                <p className='text-2xl font-bold'>예상 납부 스케줄</p>
                <p>{type} 선택 시, 다음과 같이 납부가 진행될 예정입니다.</p>
            </div>

            <div className='flex w-full flex-col items-center'>
                <div className='bg-line-50 grid w-full grid-cols-4 border-t px-4 py-2 text-center text-lg'>
                    <p>납부 회차</p>
                    <p>원금</p>
                    <p>이자</p>
                    <p className='font-semibold'>납부 금액</p>
                </div>

                <div className='scrollbar-none grid w-full flex-col items-center overflow-y-auto'>
                    {schedules &&
                        schedules.map((schedule, index) => (
                            <div
                                key={index}
                                ref={
                                    index === schedules.length - 1
                                        ? lastItemRef
                                        : undefined
                                }
                            >
                                <FormDraftScheduleItem
                                    idx={index}
                                    principal={schedule.principal}
                                    interest={schedule.interest}
                                    paymentAmount={schedule.paymentAmount}
                                />
                            </div>
                        ))}
                </div>

                <div className='flex w-full justify-between px-4 py-6'>
                    <p className='text-lg font-semibold'>총 상환 금액</p>
                    <p className='text-primary-500 text-lg font-semibold'>
                        {formatCurrency(totalRepaymentAmount)}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default FormDraftScheduleModal;
