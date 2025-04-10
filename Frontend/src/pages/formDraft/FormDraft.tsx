import { ErrorBoundary } from 'react-error-boundary';
import useFormPartnerStore from '@/entities/formPartner/model/formPartnerStore';
import { useUserStore } from '@/entities/user/model/userStore';
import { ErrorNavigate } from '@/shared/ui/ErrorNavigate';
import FormDraftContent from '@/widgets/formDraft/FormDraftContent';

const FormDraft = () => {
    const { user } = useUserStore();
    const { partner } = useFormPartnerStore();

    return (
        <div className='bg-line-50 relative flex h-screen w-full'>
            {/* 배경 도형 */}
            <div className='aria-hidden absolute top-0 left-0 z-0 h-full w-full overflow-hidden'>
                <div className='bg-primary-50 absolute top-3/4 left-7/8 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-80'></div>
                <div className='absolute top-3/4 left-7/8 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-transparent'></div>
            </div>

            <ErrorBoundary fallback={<ErrorNavigate path='/form' />}>
                <FormDraftContent user={user!} partner={partner!} />
            </ErrorBoundary>
        </div>
    );
};

export default FormDraft;
