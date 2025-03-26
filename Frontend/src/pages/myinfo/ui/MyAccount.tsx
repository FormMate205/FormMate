import { Button } from '@/components/ui/button';
import AccountInfo from '@/pages/home/ui/AccountInfo';
import { Icons } from '@/shared';

interface MyAccountProps {
    hasAccount: boolean;
    accountNumber?: string;
    userName?: string;
}

const MyAccount = ({ hasAccount, accountNumber, userName }: MyAccountProps) => {
    if (!hasAccount) return <AccountInfo />;

    return (
        <div className='relative rounded-lg bg-white p-4 shadow-sm'>
            <div className='absolute top-4 right-5 cursor-pointer'>
                <Icons name='trash' size={15} />
            </div>

            <p className='text-xl font-semibold'>{userName} 님</p>

            <div className='text-line-500 mt-2 flex items-center gap-1.5 text-sm'>
                <span>{accountNumber}</span>
                <Icons name='copy' size={12} className='cursor-pointer' />
            </div>

            <Button variant='light' className='mt-4 w-full'>
                결제 비밀번호 수정
            </Button>
        </div>
    );
};

export default MyAccount;
