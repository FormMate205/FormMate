import { Button } from '@/components/ui/button';
import AccountInfo from '@/pages/home/ui/AccountInfo';

interface MyAccountProps {
    hasAccount: boolean;
    accountNumber?: string;
    userName?: string;
}

const MyAccount = ({ hasAccount, accountNumber, userName }: MyAccountProps) => {
    if (!hasAccount) return <AccountInfo />;

    return (
        <div className='rounded-lg bg-white p-4 shadow-sm'>
            <p className='text-xl font-semibold'>{userName} 님</p>
            <p className='text-line-500 text-sm'>{accountNumber}</p>
            <Button variant={'light'}>결제 비밀번호 수정</Button>
        </div>
    );
};

export default MyAccount;
