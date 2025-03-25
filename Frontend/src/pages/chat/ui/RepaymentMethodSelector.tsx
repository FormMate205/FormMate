import { Button } from '@/components/ui/button';
import { Option } from '@/features/chatBot/type';

interface RepaymentMethodSelectorProps {
    options: Option[];
    onSelect: (value: string) => void;
}

const RepaymentMethodSelector = ({
    options,
    onSelect,
}: RepaymentMethodSelectorProps) => {
    return (
        <div className='my-4 flex w-full flex-wrap gap-4'>
            {options.map((option, index) => (
                <div
                    key={option.value}
                    className={`border-primary-200 flex w-full flex-col gap-9 rounded-lg border px-5 py-8 ${index === 0 ? 'bg-primary-500' : 'bg-white'}`}
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

                    <div className='flex w-full justify-between'>
                        <Button variant='choiceEmpty' value='미리보기' />
                        <Button
                            variant='choiceFill'
                            value='선택하기'
                            onClick={() => onSelect(option.label)}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
};

export default RepaymentMethodSelector;
