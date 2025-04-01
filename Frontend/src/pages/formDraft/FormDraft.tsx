import { ErrorBoundary } from 'react-error-boundary';
import useFormPartnerStore from '@/entities/formPartner/model/formPartnerStore';
import { useUserStore } from '@/entities/user/model/userStore';
import useNavigationGuard from '@/shared/model/useNavigationGuard';
import { ErrorNavigate } from '@/shared/ui/ErrorNavigate';
import FormDraftContent from '@/widgets/formDraft/formDraftContent';
import NavigationGuardModal from '@/widgets/modal/NavigationGuardModal';

const FormDraft = () => {
    const { user } = useUserStore();
    const { partner } = useFormPartnerStore();

    // 경로 이탈 감지 모달
    const { showModal, confirmNavigation, cancelNavigation } =
        useNavigationGuard();

    return (
        <div className='bg-line-50 relative flex h-screen w-full'>
            {/* 배경 도형 */}
            <div className='aria-hidden absolute top-0 left-0 z-0 h-full w-full overflow-hidden'>
                <div className='bg-primary-50 absolute top-3/4 left-7/8 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-80'></div>
                <div className='bg-line-50 absolute top-3/4 left-7/8 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full'></div>
            </div>

            <ErrorBoundary fallback={<ErrorNavigate path='/form' />}>
                <FormDraftContent user={user!} partner={partner!} />
            </ErrorBoundary>

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

export default FormDraft;
