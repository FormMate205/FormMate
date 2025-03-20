import { Button } from '../../components/ui/button';
import { Icons } from '../../shared';

const FormCreate = () => {
    return (
        <div className='text-primary-500 font-bold'>
            메인페이지
            <Icons name='chat' size={48} className='fill-primary-300' />
            <Button>확인</Button>
            <Button variant='choiceEmpty'>아니오</Button>
            <Button variant='choiceFill'>예</Button>
        </div>
    );
};

export default FormCreate;
