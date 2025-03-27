import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { logout } from '@/entities/user/api/logout';

const Logout = () => {
    const navigate = useNavigate();

    return (
        <>
            <Button variant='logout' onClick={() => logout(navigate)}>
                로그아웃
            </Button>
        </>
    );
};

export default Logout;
