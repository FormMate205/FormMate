import { Header } from '@/widgets';
import AccountRegistForm from './ui/AccountRegistForm';

const AccountRegist = () => {
    return (
        <div className='bg-line-50 flex min-h-screen flex-col'>
            <Header title='계좌 등록' />
            <AccountRegistForm />
        </div>
    );
};

export default AccountRegist;
