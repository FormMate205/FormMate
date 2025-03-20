import { Button } from '../../components/ui/button';
import { Icons } from '../../shared';
import {
    Drawer,
    DrawerContent,
    DrawerFooter,
    DrawerTrigger,
} from '../../components/ui/drawer';

import Header from '../../shared/ui/Header';
import TransactionList from './ui/TransactionList';

// Dummy data
const transactionsData = [
    {
        name: '강지은',
        transactionType: '출금',
        amount: '-10,000원',
        date: '2025.03.12',
    },
    {
        name: '강지은',
        transactionType: '출금',
        amount: '-10,000원',
        date: '2025.03.11',
    },
    {
        name: '이동욱',
        transactionType: '입금',
        amount: '+15,000원',
        date: '2025.03.11',
    },
];

const Transaction = () => {
    return (
        <>
            <section className='bg-primary-50 pb-9'>
                <Header title='거래내역 조회' />
                <div className='flex flex-col gap-7 px-4'>
                    <div className='flex flex-col gap-2'>
                        <div className='flex items-center gap-1'>
                            <span className='text-line-500 font-medium'>
                                싸피은행 111-1111-1111
                            </span>
                            <Icons
                                name='copy'
                                size={14}
                                className='fill-line-500'
                            />
                        </div>
                        <div className='text-3xl font-semibold'>12,345 원</div>
                    </div>
                    <Button variant='primary'>이체하기</Button>
                </div>
            </section>
            <section className='flex flex-col gap-4 p-4'>
                <Drawer>
                    <DrawerTrigger className='flex w-full items-center justify-end gap-1'>
                        <span className='text-line-950'>1개월•전체•최신순</span>
                        <Icons
                            name='chev-down'
                            size={14}
                            className='fill-line-950'
                        />
                    </DrawerTrigger>
                    <DrawerContent>
                        <div className='tex-lg flex flex-col p-4 font-medium'>
                            <span>거래 기간</span>
                        </div>
                        <DrawerFooter>
                            <Button>확인</Button>
                        </DrawerFooter>
                    </DrawerContent>
                </Drawer>
                <div className='flex flex-col gap-6'>
                    <TransactionList transactions={transactionsData} />
                </div>
            </section>
        </>
    );
};

export default Transaction;
