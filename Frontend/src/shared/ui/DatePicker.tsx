'use client';

import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import * as React from 'react';

import { Calendar } from '@/components/ui/calendar';
import { CalendarButton } from '@/components/ui/calendarButton';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

export function DatePicker() {
    const [date, setDate] = React.useState<Date>();

    return (
        <Popover>
            <PopoverTrigger asChild>
                <CalendarButton
                    variant={'outline'}
                    className={cn(
                        'w-[240px] justify-start bg-white text-left font-normal',
                        !date && 'text-muted-foreground',
                    )}
                >
                    <CalendarIcon />
                    {date ? (
                        format(date, 'yyyy-MM-dd')
                    ) : (
                        <span>상환 날짜를 선택하세요</span>
                    )}
                </CalendarButton>
            </PopoverTrigger>
            <PopoverContent className='w-auto bg-white p-0' align='start'>
                <Calendar
                    mode='single'
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                />
            </PopoverContent>
        </Popover>
    );
}
