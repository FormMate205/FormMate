import { useNavigate } from 'react-router-dom';
import CommonModal from '@/widgets/modal/CommonModal';

const FormStartModal = () => {
    const navigate = useNavigate();

    // 계약 생성으로 이동
    const onNavigateForm = () => {
        navigate('/form');
    };

    return (
        <CommonModal
            trigger='계약 생성'
            title='반갑습니다. 차용증 발급을 원하십니까?'
            description='필요한 정보를 선택해주시면, AI가 대신 계약서를 만들어 드릴게요!'
            onClick={onNavigateForm}
            confirmText='시작하기'
        />
    );
};

export default FormStartModal;
