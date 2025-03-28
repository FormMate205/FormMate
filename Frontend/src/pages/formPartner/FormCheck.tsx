import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import useFormPartnerStore from '@/entities/formPartner/model/formPartnerStore';
import { maskUserName } from '@/shared/model/maskUserName';
import Header from '@/widgets/layout/header/Header';

const FormCheck = () => {
    const navigate = useNavigate();
    const { partner } = useFormPartnerStore();

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
        </div>
    );
};

export default FormCheck;
