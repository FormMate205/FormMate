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
import FilterTab from './FilterTab';

const FilterDrawer = () => {
    const [period, setPeriod] = useState('3개월');
    const [type, setType] = useState('전체');
    const [order, setOrder] = useState('최신순');

    const periods = ['1개월', '3개월', '지난달'];
    const types = ['전체', '입금만', '출금만'];
    const orders = ['최신순', '과거순'];

    return (
        <Drawer>
            <DrawerTrigger className='flex w-full items-center justify-end gap-1'>
                <span className='text-line-950'>3개월•전체•최신순</span>
                <Icons name='chev-down' size={14} className='fill-line-950' />
            </DrawerTrigger>
            <DrawerContent>
                <DrawerTitle></DrawerTitle>
                <div className='flex flex-col p-4 font-semibold'>
                    {/* 조회 기간 */}
                    <FilterTab
                        label='조회 기간'
                        options={periods}
                        selected={period}
                        onChange={setPeriod}
                    />
                    {/* 거래 유형 */}
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
                    <Button>확인</Button>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
};

export default FilterDrawer;
