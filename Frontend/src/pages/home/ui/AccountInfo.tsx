import { Button } from '@/components/ui/button';

export default function AccountInfo() {
    const hasAccount = true;

    return (
        <div className='flex items-center justify-between rounded-lg bg-white p-2 shadow-sm'>
            {hasAccount ? (
                <>
                    <div className='w-full p-3'>
                        <div>
                            <p className='text-line-500 text-sm'>
                                싸피뱅크 111-11111-11111
                            </p>
                            <p className='text-3xl font-semibold'>
                                3,500,000원
                            </p>
                        </div>
                        <div className='mt-1 flex justify-end'>
                            <Button
                                variant={'choiceFill'}
                                className='h-[40px] w-auto px-4'
                            >
                                송금
                            </Button>
                        </div>
                    </div>
                </>
            ) : (
                <>
                    <div className='p-2'>
                        <p className='text-line-500 text-sm'>
                            등록된 계좌가 없어요
                        </p>
                        <p className='text-xl font-semibold'>
                            내 계좌 등록하기
                        </p>
                    </div>
                    <Button
                        variant={'choiceFill'}
                        className='h-[40px] w-auto px-4'
                    >
                        등록
                    </Button>
                </>
            )}
        </div>
    );
}
