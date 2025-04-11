import { cn } from '@/lib/utils';

interface FilterTabProps<T extends string> {
    label: string;
    options: readonly T[]; // 배열을 상수로 받으면 리터럴 추론됨
    selected: T;
    onChange: (value: T) => void;
}

const FilterTab = <T extends string>({
    label,
    options,
    selected,
    onChange,
}: FilterTabProps<T>) => {
    return (
        <div className='flex flex-col gap-2'>
            <p className='mb-2 text-lg font-semibold'>{label}</p>
            <div className='flex justify-between rounded-xl bg-gray-100 p-1'>
                {options.map((item) => (
                    <button
                        key={item}
                        onClick={() => onChange(item)}
                        className={cn(
                            'flex-1 rounded-xl py-2 font-semibold transition-all',
                            selected === item
                                ? 'bg-white text-black shadow'
                                : 'text-gray-400',
                        )}
                    >
                        {item}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default FilterTab;
