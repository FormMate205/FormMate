import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageType } from '@/entities/chat/model/types';
import BlockModal from '@/entities/chat/ui/BlockModal';
import { useUserStore } from '@/entities/user/model/userStore';
import { NavigateToPage } from '@/shared/ui/NavigateToPage';
import { CommonModal } from '@/widgets';
import FormModal from '../../../entities/chat/ui/FormModal';
import { useConnectWs } from '../model/useConnectWs';

interface ChatSystemProps {
    formId: string;
    children: ReactNode;
    type: MessageType;
    requestedById?: string;
}

const ChatSystem = ({
    formId,
    children,
    type,
    requestedById,
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
                formInfo.debtorId === user.id;

            // 채권자 차례
            const isCreditorSign =
                formInfo.formStatus === 'AFTER_APPROVAL' &&
                formInfo.creditorId === user.id;

            return isDebtorSign || isCreditorSign;
        }

        // 계약 파기
        if (type === 'SIGNATURE_REQUEST_TERMINATION') {
            // 첫번쨰 차례
            const isFirstSign =
                (formInfo.formStatus === 'IN_PROGRESS' ||
                    formInfo.formStatus === 'OVERDUE') &&
                formInfo.terminationStatus === 'REQUESTED' &&
                requestedById !== user.id;

            // 두번째 차례
            const isSecondSign =
                (formInfo.formStatus === 'IN_PROGRESS' ||
                    formInfo.formStatus === 'OVERDUE') &&
                formInfo.terminationStatus === 'SIGNED' &&
                requestedById === user.id;

            return isFirstSign || isSecondSign;
        }
    };

    const handleNavigateToSign = () => {
        navigate(`/chat/${formId}/signature`, {
            state: {
                formId,
                type,
                creditorId: formInfo.creditorId,
                requestedById,
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
                {type == 'CONTRACT_SHARED' && (
                    <FormModal formId={formId} isDraft={true} />
                )}
            </div>

            {children}

            {isSignatureRequest && (
                <CommonModal
                    triggerChildren={
                        <div
                            className='bg-primary-500 w-full rounded-lg px-4 py-2 font-medium text-white'
                            aria-label='서명하기 버튼'
                        >
                            서명하기
                        </div>
                    }
                    children={
                        canUserSign() ? (
                            <NavigateToPage
                                title='서명'
                                handleNavigate={handleNavigateToSign}
                            />
                        ) : (
                            <BlockModal />
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
