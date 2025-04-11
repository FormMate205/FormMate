import { format, subMonths } from 'date-fns';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Drawer,
    DrawerContent,
    DrawerFooter,
    DrawerTitle,
    DrawerTrigger,
} from '@/components/ui/drawer';
import { Icons } from '@/shared';
import { TransactionFilters } from '../model/types';
import FilterTab from './FilterTab';
import RangeDatePicker from './RangeDatePicker';

const periods = ['1개월', '3개월', '직접 설정'] as const;
const transferTypes = ['전체', '입금만', '출금만'] as const;
const sortDirections = ['최신순', '과거순'] as const;

type PeriodOption = (typeof periods)[number];

// 날짜를 yyyy.MM.dd 형식으로 포맷
const formatDateToReadable = (dateStr: string) => {
    if (dateStr.includes('~')) {
        const [start, end] = dateStr.split('~');
        const startDate = new Date(
            parseInt(start.substring(0, 4)),
            parseInt(start.substring(4, 6)) - 1,
            parseInt(start.substring(6, 8)),
        );
        const endDate = new Date(
            parseInt(end.substring(0, 4)),
            parseInt(end.substring(4, 6)) - 1,
            parseInt(end.substring(6, 8)),
        );
        return `${format(startDate, 'yyyy.MM.dd')} ~ ${format(endDate, 'yyyy.MM.dd')}`;
    }
    return dateStr;
};

// 날짜를 yyyyMMdd 형식으로 포맷 (API 요청용)
const formatDateToYMD = (date: Date) => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}${mm}${dd}`;
};

interface FilterDrawerProps {
    defaultValues: TransactionFilters;
    onConfirm: (filters: TransactionFilters) => void;
}

const FilterDrawer = ({ defaultValues, onConfirm }: FilterDrawerProps) => {
    const [open, setOpen] = useState(false);
    const [period, setPeriod] = useState<PeriodOption>(
        defaultValues.period === '1개월' || defaultValues.period === '3개월'
            ? defaultValues.period
            : '직접 설정',
    );
    const [startDate, setStartDate] = useState<Date | undefined>();
    const [endDate, setEndDate] = useState<Date | undefined>();
    const [transferType, setTransferType] = useState(
        defaultValues.transferType,
    );
    const [sortDirection, setSortDirection] = useState(
        defaultValues.sortDirection,
    );

    const handleConfirm = () => {
        let appliedPeriod: string = period;

        if (period === '직접 설정') {
            const today = new Date();
            const defaultStartDate = startDate || subMonths(today, 1); // 시작 날짜가 없으면 1개월 전
            const defaultEndDate = endDate || today; // 종료 날짜가 없으면 오늘

            appliedPeriod = `${formatDateToYMD(defaultStartDate)}~${formatDateToYMD(defaultEndDate)}`;
        }

        onConfirm({
            period: appliedPeriod,
            transferType,
            sortDirection,
        });
        setOpen(false);
    };

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger className='flex w-full items-center justify-end gap-1'>
                <span className='text-line-950'>
                    {formatDateToReadable(defaultValues.period)} •{' '}
                    {defaultValues.transferType} • {defaultValues.sortDirection}
                </span>
                <Icons name='chev-down' size={14} className='fill-line-950' />
            </DrawerTrigger>

            <DrawerContent className='p-4'>
                <DrawerTitle className='text-xl'>조회 조건 설정</DrawerTitle>
                <div className='mt-6 flex flex-col gap-10 font-semibold'>
                    <div className='flex flex-col gap-4'>
                        <FilterTab
                            label='조회 기간'
                            options={periods}
                            selected={period}
                            onChange={setPeriod}
                        />
                        {period === '직접 설정' && (
                            <RangeDatePicker
                                startDate={startDate}
                                endDate={endDate}
                                onStartDateChange={setStartDate}
                                onEndDateChange={setEndDate}
                            />
                        )}
                    </div>

                    <FilterTab
                        label='거래 유형'
                        options={transferTypes}
                        selected={transferType}
                        onChange={setTransferType}
                    />
                    <FilterTab
                        label='정렬방식'
                        options={sortDirections}
                        selected={sortDirection}
                        onChange={setSortDirection}
                    />
                </div>

                <DrawerFooter className='mt-10 p-0'>
                    <Button variant='primary' onClick={handleConfirm}>
                        확인
                    </Button>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
};

export default FilterDrawer;
