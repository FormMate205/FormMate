import { Header } from '@/widgets';
import { Button } from '../../components/ui/button';
import { Icons } from '../../shared';
import FilterDrawer from './ui/FilterDrawer';
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
                <FilterDrawer />

                <div className='flex flex-col gap-6'>
                    <TransactionList transactions={transactionsData} />
                </div>
            </section>
        </>
    );
};

export default Transaction;
