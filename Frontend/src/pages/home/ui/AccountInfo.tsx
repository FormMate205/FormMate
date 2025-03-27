import { useNavigate } from 'react-router-dom';
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
                    </div>
                </>
            ) : (
                <>
                    <div className='flex w-full items-center justify-between p-3'>
                        <div>
                            <p className='text-line-100 text-sm'>
                                등록된 계좌가 없어요
                            </p>
                            <p className='text-2xl font-semibold text-white'>
                                내 계좌 등록하기
                            </p>
                        </div>
                        <div>
                            <Icons
                                name='chev-right'
                                className='fill-white'
                                onClick={() => navigate('/transaction')}
                            />
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default AccountInfo;
