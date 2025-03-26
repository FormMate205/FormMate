import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
    Drawer,
    DrawerContent,
    DrawerFooter,
    DrawerTitle,
    DrawerTrigger,
} from '@/components/ui/drawer';
import { Icons } from '@/shared';
import FilterTab from './FilterTab';

interface FilterValues {
    period: string;
    type: string;
    order: string;
}

interface FilterDrawerProps {
    defaultValues: FilterValues; // 부모 상태 (현재 필터 값)
    onConfirm: (filters: FilterValues) => void; // 확인 버튼 누를 때 호출
}

const FilterDrawer = ({ defaultValues, onConfirm }: FilterDrawerProps) => {
    const [open, setOpen] = useState(false);
    // 필터 상태
    const [period, setPeriod] = useState(defaultValues.period);
    const [type, setType] = useState(defaultValues.type);
    const [order, setOrder] = useState(defaultValues.order);

    // Drawer가 열릴 때 defaultValues로 초기화
    useEffect(() => {
        if (open) {
            setPeriod(defaultValues.period);
            setType(defaultValues.type);
            setOrder(defaultValues.order);
        }
    }, [open, defaultValues]);

    const handleConfirm = () => {
        onConfirm({ period, type, order });
        setOpen(false);
    };

    const periods = ['1개월', '3개월', '지난달'];
    const types = ['전체', '입금만', '출금만'];
    const orders = ['최신순', '과거순'];

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger className='flex w-full items-center justify-end gap-1'>
                <span className='text-line-950'>
                    {defaultValues.period}•{defaultValues.type}•
                    {defaultValues.order}
                </span>
                <Icons name='chev-down' size={14} className='fill-line-950' />
            </DrawerTrigger>

            <DrawerContent>
                <DrawerTitle />
                <div className='flex flex-col p-4 font-semibold'>
                    <FilterTab
                        label='조회 기간'
                        options={periods}
                        selected={period}
                        onChange={setPeriod}
                    />
                    <FilterTab
                        label='거래 유형'
                        options={types}
                        selected={type}
                        onChange={setType}
                    />
                    <FilterTab
                        label='정렬방식'
                        options={orders}
                        selected={order}
                        onChange={setOrder}
                    />
                </div>
                <DrawerFooter>
                    <Button onClick={handleConfirm}>확인</Button>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
};

export default FilterDrawer;
