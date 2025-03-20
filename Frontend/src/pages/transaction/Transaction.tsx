import { Button } from '../../components/ui/button';
import { Icons } from '../../shared';
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from '../../components/ui/drawer';
import Header from '../../shared/ui/Header';

const Transaction = () => {
    return (
        <>
            <section className='bg-primary-50 pb-9'>
                <Header title='거래내역 조회' />
                <div className='flex flex-col gap-7 px-4'>
                    <div className='flex flex-col gap-2'>
                        <div className='flex items-center gap-2'>
                            <span className='text-line-500 font-medium'>
                                싸피은행 111-1111-1111
                            </span>
                            <Icons name='copy' size={16} />
                        </div>
                        <div className='text-3xl font-semibold'>12,345 원</div>
                    </div>
                    <Button variant='primary'>이체하기</Button>
                </div>
            </section>
            <section className='p-4'>
                {/* 필터 컴포넌트  - shadcn Drawer 사용 예정 */}
                <Drawer>
                    <DrawerTrigger>Open</DrawerTrigger>
                    <DrawerContent>
                        <DrawerHeader>
                            <DrawerTitle>Are you absolutely sure?</DrawerTitle>
                            <DrawerDescription>
                                This action cannot be undone.
                            </DrawerDescription>
                        </DrawerHeader>
                        <DrawerFooter>
                            <Button>Submit</Button>
                            <DrawerClose>
                                <Button>Cancel</Button>
                            </DrawerClose>
                        </DrawerFooter>
                    </DrawerContent>
                </Drawer>

                <div className='flex flex-col gap-2'>
                    <div className='text-line-700 border-line-200 border-b pb-1 font-medium'>
                        2025.03.12
                    </div>
                    <div className='border-line-100 flex justify-between border-b pb-2'>
                        <div className='flex items-center text-lg font-medium'>
                            강지은
                        </div>
                        <div className='flex flex-col items-end'>
                            <span className='text-line-700 font-medium'>
                                출금
                            </span>
                            <span className='text-primary-500 font-semibold'>
                                -10,000원
                            </span>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Transaction;
