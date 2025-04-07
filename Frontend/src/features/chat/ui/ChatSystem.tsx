import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageType } from '@/entities/chat/model/types';
import BlockModal from '@/entities/chat/ui/BlockModal';
import { useUserStore } from '@/entities/user/model/userStore';
import { CommonModal } from '@/widgets';
import FormModal from '../../../entities/chat/ui/FormModal';
import { useConnectWs } from '../model/useConnectWs';

interface ChatSystemProps {
    formId: string;
    children: ReactNode;
    type: MessageType;
    signId?: string;
}

const ChatSystem = ({ formId, children, type, signId }: ChatSystemProps) => {
    const navigate = useNavigate();
    const { user } = useUserStore();
    const { formInfo } = useConnectWs({ user, roomId: formId });

    // 서명 요청 타입 체크
    const isSignatureRequest =
        type === 'SIGNATURE_REQUEST_CONTRACT' ||
        type === 'SIGNATURE_REQUEST_TERMINATION';

    // 사인 폼 모달을 띄우는 조건
    const canUserSign = () => {
        if (!signId || signId !== user?.id) {
            return false;
        }

        // 채무자 차례
        const isDebtorSign =
            formInfo.formStatus === 'BEFORE_APPROVAL' &&
            formInfo.debtorId === user.id;

        // 채권자 차례
        const isCreditorSign =
            formInfo.formStatus === 'AFTER_APPROVAL' &&
            formInfo.creditorId === user.id;

        return isDebtorSign || isCreditorSign;
    };

    const navigateToSignature = () => {
        navigate('/signature', {
            state: { formId, type, creditorId: formInfo.creditorId },
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
                    triggerChildren={<div>서명하기</div>}
                    children={
                        canUserSign() ? (
                            <div onClick={navigateToSignature}>
                                서명 페이지로 이동합니다.
                            </div>
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
