'use client';

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

interface DatePickerProps {
    selectedDate?: Date;
    onSelect?: (date: Date | undefined) => void;
}

export const DatePicker = ({ selectedDate, onSelect }: DatePickerProps) => {
    const handleSelect = (date: Date | undefined) => {
        onSelect?.(date);
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <CalendarButton
                    variant={'outline'}
                    className={cn(
                        'w-[240px] justify-start bg-white text-left font-normal',
                        !selectedDate && 'text-muted-foreground',
                    )}
                >
                    <CalendarIcon className='text-primary-500' />
                    {selectedDate ? (
                        format(selectedDate, 'yyyy-MM-dd')
                    ) : (
                        <span>상환 날짜를 선택하세요</span>
                    )}
                </CalendarButton>
            </PopoverTrigger>
            <PopoverContent
                className='border-primary-200 w-auto border bg-white p-0'
                align='start'
            >
                <Calendar
                    mode='single'
                    disabled={(day) => day < new Date()}
                    selected={selectedDate}
                    onSelect={handleSelect}
                    initialFocus
                />
            </PopoverContent>
        </Popover>
    );
};
