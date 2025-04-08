import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MessageType } from '@/entities/chat/model/types';
import { useUserStore } from '@/entities/user/model/userStore';
import FormUpdateModal from '@/features/formDraft/ui/FormUpdateModal';
import { NavigateToPage } from '@/shared/ui/NavigateToPage';
import { CommonModal } from '@/widgets';
import { useConnectWs } from '../model/useConnectWs';

interface ChatSystemProps {
    formId: string;
    children: ReactNode;
    type: MessageType;
    targetUserId?: string;
}

const ChatSystem = ({
    formId,
    children,
    type,
    targetUserId,
}: ChatSystemProps) => {
    const navigate = useNavigate();
    const { user } = useUserStore();
    const { formInfo } = useConnectWs({ user, roomId: formId });

    // 서명 요청 타입 체크
    const isSignatureRequest =
        type === 'SIGNATURE_REQUEST_CONTRACT' ||
        type === 'SIGNATURE_REQUEST_TERMINATION';

    // 사인 폼 모달을 띄우는 조건
    const canUserSign = () => {
        if (!user?.id) {
            return false;
        }

        if (type === 'SIGNATURE_REQUEST_CONTRACT') {
            // 채무자 차례
            const isDebtorSign =
                formInfo.formStatus === 'BEFORE_APPROVAL' &&
                targetUserId === user.id;

            // 채권자 차례
            const isCreditorSign =
                formInfo.formStatus === 'AFTER_APPROVAL' &&
                targetUserId === user.id;

            return isDebtorSign || isCreditorSign;
        }

        // 계약 파기
        if (type === 'SIGNATURE_REQUEST_TERMINATION') {
            // 첫번쨰 차례
            const isFirstSign =
                (formInfo.formStatus === 'IN_PROGRESS' ||
                    formInfo.formStatus === 'OVERDUE') &&
                formInfo.terminationStatus === 'REQUESTED' &&
                targetUserId !== user.id;

            // 두번째 차례
            const isSecondSign =
                (formInfo.formStatus === 'IN_PROGRESS' ||
                    formInfo.formStatus === 'OVERDUE') &&
                formInfo.terminationStatus === 'SIGNED' &&
                targetUserId === user.id;

            return isFirstSign || isSecondSign;
        }
    };

    const handleNavigateToSign = () => {
        navigate(`/chat/${formId}/signature`, {
            state: {
                formId,
                type,
                creditorId: formInfo.creditorId,
                requestedById: formInfo.terminationRequestedId,
            },
        });
    };

    return (
        <div className='border-primary-200 flex w-[260px] flex-col gap-6 rounded-2xl border bg-white px-3 py-4'>
            <div className='flex w-full items-center justify-between'>
                <p className='text-lg font-semibold'>
                    {type == 'CONTRACT_SHARED'
                        ? '금전 차용 계약서'
                        : '서명 대기'}
                </p>
                {type == 'CONTRACT_SHARED' &&
                    (formInfo.formStatus == 'BEFORE_APPROVAL' ||
                        formInfo.formStatus == 'AFTER_APPROVAL') && (
                        <FormUpdateModal formId={formId} />
                    )}
            </div>

            {children}

            {isSignatureRequest && (
                <CommonModal
                    triggerChildren={
                        <Button
                            variant={'default'}
                            children='서명하기'
                            disabled={!canUserSign()}
                            className={
                                !canUserSign()
                                    ? 'bg-line-200 cursor-not-allowed'
                                    : ''
                            }
                        />
                    }
                    children={
                        canUserSign() && (
                            <NavigateToPage
                                title='서명'
                                handleNavigate={handleNavigateToSign}
                            />
                        )
                    }
                    confirmText='닫기'
                    onClick={() => {}}
                />
            )}
        </div>
    );
};

export default ChatSystem;
