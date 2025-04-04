import { ReactNode } from 'react';
import { MessageType } from '@/entities/chat/model/types';
import BlockModal from '@/entities/chat/ui/BlockModal';
import { useUserStore } from '@/entities/user/model/userStore';
import { CommonModal } from '@/widgets';
import FormModal from '../../../entities/chat/ui/FormModal';
import { useSignature } from '../model/useSignature';
import SignatureForm from './SignatureForm';

interface ChatSystemProps {
    formId: string;
    children: ReactNode;
    type: MessageType;
    creditorId: string;
    signId?: string;
}

const ChatSystem = ({
    formId,
    children,
    type,
    creditorId,
    signId,
}: ChatSystemProps) => {
    const { user } = useUserStore();

    // 서명 요청 타입에 대한 조건 체크
    const isSignatureRequest =
        type === 'SIGNATURE_REQUEST_CONTRACT' ||
        type === 'SIGNATURE_REQUEST_TERMINATION';

    // 서명 요청일 경우, useSignature 훅 사용
    const signatureProps = useSignature({ formId, type, creditorId });

    const handleClick = () => {
        console.log('handleClick', signatureProps);
        // 서명 요청이고 사용자가 해당 서명 대상자일 때만 handleVerifyCode 실행
        if (isSignatureRequest && signId === user?.id && signatureProps) {
            signatureProps.handleVerifyCode();
        }
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
                        signId && signId == user?.id ? (
                            <SignatureForm
                                formId={formId}
                                type={type}
                                creditorId={creditorId}
                            />
                        ) : (
                            <BlockModal />
                        )
                    }
                    confirmText={
                        signId && signId == user?.id ? '인증 완료' : '확인'
                    }
                    onClick={handleClick}
                />
            )}
        </div>
    );
};

export default ChatSystem;
