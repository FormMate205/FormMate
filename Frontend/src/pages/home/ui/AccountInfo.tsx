import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Icons } from '@/shared';

const AccountInfo = () => {
    const hasAccount = true;
    const navigate = useNavigate();

    return (
        <div className='bg-primary-500 flex items-center justify-between rounded-lg p-2 shadow-sm'>
            {hasAccount ? (
                <>
                    <div className='flex w-full items-center justify-between p-3'>
                        <div>
                            <p className='text-line-100 text-sm'>
                                싸피뱅크 111-11111-11111
                            </p>
                            <p className='text-3xl font-semibold text-white'>
                                3,500,000원
                            </p>
                        </div>
                        <div>
                            <Icons
                                name='chev-right'
                                className='fill-white'
                                onClick={() => navigate('/transaction')}
                            />
                        </div>
                        {/* <div className='mt-1 flex justify-end'>
                            <Button
                                variant={'choiceFill'}
                                className='h-[40px] w-auto px-4'
                            >
                                송금
                            </Button>
                        </div> */}
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
                        onClick={() => navigate('/account')}
                    >
                        등록
                    </Button>
                </>
            )}
        </div>
    );
};

export default AccountInfo;
