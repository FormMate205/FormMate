import { Header } from '@/widgets';
import AccountPasswordForm from './ui/AccountPasswordForm';

const AccountPassword = () => {
    return (
        <div>
            <Header title='결제 비밀번호 등록' />
            <AccountPasswordForm />
        </div>
    );
};

export default AccountPassword;
