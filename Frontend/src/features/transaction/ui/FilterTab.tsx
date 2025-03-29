import { cn } from '@/lib/utils';

interface FilterTabProps {
    label: string;
    options: string[];
    selected: string;
    onChange: (value: string) => void;
}

const FilterTab = ({ label, options, selected, onChange }: FilterTabProps) => {
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
