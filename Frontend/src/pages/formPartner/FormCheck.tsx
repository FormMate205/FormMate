import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import useFormPartnerStore from '@/entities/formPartner/model/formPartnerStore';
import { maskUserName } from '@/shared/model/maskUserName';
import useNavigationGuard from '@/shared/model/useNavigationGuard';
import Header from '@/widgets/layout/header/Header';
import NavigationGuardModal from '@/widgets/modal/NavigationGuardModal';

const FormCheck = () => {
    const navigate = useNavigate();
    const { partner } = useFormPartnerStore();

    // 경로 이탈 감지 모달
    const { showModal, confirmNavigation, cancelNavigation } =
        useNavigationGuard();

    // 계약 상대 미지정 시 돌아가기
    if (!partner) {
        navigate(-1);
        return null;
    }

    const name = maskUserName(partner.userName);

    const onClick = () => {
        console.log('계약서 생성');
        navigate('/draft/landing');
    };

    return (
        <div className='flex h-full flex-col justify-between px-4 py-2'>
            <div className='flex flex-col gap-[250px]'>
                <Header title='계약 상대 등록' />

                <div className='flex flex-col items-center gap-6'>
                    <img
                        src='/public/assets/images/avatar.png'
                        alt='사람 모양의 대표 이미지'
                        width={50}
                    />

                    <div className='flex flex-col items-center gap-4'>
                        <p className='text-2xl font-semibold'>
                            {name}님과 계약서를 협의할까요?
                        </p>
                        <div className='text-line-500 flex flex-col items-center'>
                            <p>계약서 초안을 생성해드릴게요.</p>
                            <p>{name}님과 채팅을 통해 계약서 수정 및 계약</p>
                            <p>최종 수락해주세요.</p>
                        </div>
                    </div>
                </div>
            </div>

            <Button variant='primary' children='확인' onClick={onClick} />

            <NavigationGuardModal
                title='계약 생성을 그만두시겠습니까?'
                description='페이지를 벗어나면 지금까지 입력한 모든 내용이 사라집니다.'
                isOpen={showModal}
                onConfirm={confirmNavigation}
                onCancel={cancelNavigation}
            />
        </div>
    );
};

export default FormCheck;
