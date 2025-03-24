import { cn } from '@/lib/utils';

interface StatusSummaryItemProps {
    label: string;
    value: string;
    colorClass?: string;
    isBorder: boolean;
}

const StatusSummaryItem = ({
    label,
    value,
    colorClass = 'text-line-900',
    isBorder = true,
}: StatusSummaryItemProps) => {
    return (
        <div
            className={`flex flex-1 flex-col gap-2 text-center ${isBorder ? 'border-line-200 border-r' : ''}`}
        >
            <span>{label}</span>
            <span className={cn('text-center font-medium', colorClass)}>
                {value}
            </span>
        </div>
    );
};

export default StatusSummaryItem;
