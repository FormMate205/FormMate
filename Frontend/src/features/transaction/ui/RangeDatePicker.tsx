import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { CalendarButton } from '@/components/ui/calendarButton';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface RangeDatePickerProps {
    startDate: Date | undefined;
    endDate: Date | undefined;
    onStartDateChange: (date: Date | undefined) => void;
    onEndDateChange: (date: Date | undefined) => void;
}

const RangeDatePicker = ({
    startDate,
    endDate,
    onStartDateChange,
    onEndDateChange,
}: RangeDatePickerProps) => {
    const renderDatePicker = (
        date: Date | undefined,
        onChange: (d: Date | undefined) => void,
        placeholder: string,
    ) => (
        <Popover>
            <PopoverTrigger asChild>
                <CalendarButton
                    variant={'outline'}
                    className={cn(
                        'text-line-900 h-11 w-[45%] justify-start text-lg',
                        !date && 'text-muted-foreground',
                    )}
                >
                    <CalendarIcon className='text-primary-500 mr-2 h-4 w-4' />
                    {date ? format(date, 'yyyy.MM.dd') : placeholder}
                </CalendarButton>
            </PopoverTrigger>
            <PopoverContent className='w-auto bg-white p-0' align='start'>
                <Calendar
                    mode='single'
                    selected={date ?? undefined}
                    onSelect={onChange}
                    initialFocus
                    disabled={(date) => date > new Date()}
                />
            </PopoverContent>
        </Popover>
    );

    return (
        <div className='text-line-700 flex items-center justify-between gap-2'>
            {renderDatePicker(startDate, onStartDateChange, '시작 날짜')}
            <span className='text-line-500 text-2xl'>~</span>
            {renderDatePicker(endDate, onEndDateChange, '종료 날짜')}
        </div>
    );
};

export default RangeDatePicker;
