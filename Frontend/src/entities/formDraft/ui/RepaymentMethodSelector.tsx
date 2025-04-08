import { Button } from '@/components/ui/button';
import { CommonModal } from '@/widgets';
import { Option } from '../model/types';
import FormDraftScheduleModal from './FormDraftScheduleModal';

interface RepaymentMethodSelectorProps {
    options: Option[];
    onSelect: (value: string) => void;
}

const RepaymentMethodSelector = ({
    options,
    onSelect,
}: RepaymentMethodSelectorProps) => {
    return (
        <div className='my-4 flex w-screen gap-4 rounded-lg'>
            {options.map((option, index) => (
                <div
                    key={option.label}
                    className={`border-primary-200 flex w-[212px] flex-col justify-between gap-9 rounded-lg border px-5 py-8 ${index === 0 ? 'bg-primary-50' : 'bg-white'}`}
                >
                    <div className='flex flex-col gap-5'>
                        <p className='text-primary-500 text-xl font-bold'>
                            {index === 0 ? '01' : '02'}
                        </p>

                        <div className='flex flex-col gap-3'>
                            <p className='text-xl font-bold'>{option.label}</p>
                            <p className='text-line-700'>
                                {option.description}
                            </p>
                        </div>
                    </div>

                    <div className='flex w-full gap-4'>
                        <CommonModal
                            triggerChildren={
                                <div
                                    className='border-primary-500 text-primary-500 rounded-[4px] border bg-white px-3 py-2 text-sm font-medium'
                                    aria-label='예상 납부 내역 미리보기 버튼'
                                >
                                    미리보기
                                </div>
                            }
                            children={
                                <FormDraftScheduleModal type={option.label} />
                            }
                        />
                        <Button
                            variant='choiceFill'
                            children='선택하기'
                            onClick={() => onSelect(option.label)}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
};

export default RepaymentMethodSelector;
