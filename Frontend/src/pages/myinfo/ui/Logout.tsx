import { Button } from '@/components/ui/button';
import { logout } from '@/entities/user/api/logout';

const Logout = () => {
    return (
        <>
            <Button variant='logout' onClick={() => logout()}>
                로그아웃
            </Button>
        </>
    );
};

export default Logout;
