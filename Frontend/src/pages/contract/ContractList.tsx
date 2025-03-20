import { Header } from '../../shared';

const ContractList = () => {
    return (
        <>
            <div className='bg-line-50 flex h-screen flex-col gap-4 px-4'>
                <Header title='계약관리' />
                <section className='flex rounded-lg bg-white py-3'>
                    <div className='flex w-full text-center'>
                        <div className='border-line-200 flex flex-1 flex-col gap-2 border-r text-center'>
                            <span>진행</span>
                            <span className='text-center font-medium'>3</span>
                        </div>
                        <div className='border-line-200 flex flex-1 flex-col gap-2 border-r'>
                            <span>갚을</span>
                            <span className='text-primary-500 text-center font-medium'>
                                2
                            </span>
                        </div>
                        <div className='border-line-200 flex flex-1 flex-col gap-2 border-r'>
                            <span>받을</span>
                            <span className='text-primary-500 text-center font-medium'>
                                1
                            </span>
                        </div>
                        <div className='flex flex-1 flex-col gap-2'>
                            <span>종료</span>
                            <span className='text-line-300 text-center font-medium'>
                                10
                            </span>
                        </div>
                    </div>
                </section>
                <section className='flex flex-col rounded-lg bg-white px-8 py-3'>
                    <div className='border-line-200 flex border-b'>
                        <div>차트 헤더</div>
                        <div>차트</div>
                    </div>
                    <div>
                        계약서 건수
                        <div>검색바</div>
                        <div>계약서 리스트</div>
                    </div>
                </section>
            </div>
        </>
    );
};

export default ContractList;
