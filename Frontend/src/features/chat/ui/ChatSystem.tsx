import { ReactNode } from 'react';
import { MessageType } from '@/entities/chat/model/types';
import BlockModal from '@/entities/chat/ui/BlockModal';
import { useUserStore } from '@/entities/user/model/userStore';
import { CommonModal } from '@/widgets';
import FormModal from '../../../entities/chat/ui/FormModal';
import SignatureForm from './SignatureForm';

interface ChatSystemProps {
    formId: string;
    children: ReactNode;
    type: MessageType;
    signId?: string;
}

const ChatSystem = ({ formId, children, type, signId }: ChatSystemProps) => {
    const { user } = useUserStore();

    // 서명 요청 타입 체크
    const isSignatureRequest =
        type === 'SIGNATURE_REQUEST_CONTRACT' ||
        type === 'SIGNATURE_REQUEST_TERMINATION';

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
                            <SignatureForm formId={formId} type={type} />
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
