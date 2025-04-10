import { ReactNode, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MessageType } from '@/entities/chat/model/types';
import { useUserStore } from '@/entities/user/model/userStore';
import FormUpdateModal from '@/features/formDraft/ui/FormUpdateModal';
import { getCurrentSigner } from '@/features/signature/api/signatureAPI';
import { NavigateToPage } from '@/shared/ui/NavigateToPage';
import { CommonModal } from '@/widgets';
import { useConnectWs } from '../model/useConnectWs';

interface ChatSystemProps {
    formId: string;
    children: ReactNode;
    type: MessageType;
}

const ChatSystem = ({ formId, children, type }: ChatSystemProps) => {
    const navigate = useNavigate();
    const { user } = useUserStore();
    const { formInfo } = useConnectWs({ user, roomId: formId });
    const [isCurrentSigner, setIsCurrentSigner] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // 현재 사용자가 서명할 차례인지 확인
    useEffect(() => {
        const checkCurrentSigner = async () => {
            try {
                setIsLoading(true);
                const result = await getCurrentSigner(formId);
                setIsCurrentSigner(result);
            } catch {
                setIsCurrentSigner(false);
            } finally {
                setIsLoading(false);
            }
        };

        checkCurrentSigner();
    }, [formId]);

    // 서명 요청 타입 체크
    const isSignatureRequest =
        type === 'SIGNATURE_REQUEST_CONTRACT' ||
        type === 'SIGNATURE_REQUEST_TERMINATION';

    // 사인 폼 모달을 띄우는 조건
    const canUserSign = () => {
        if (!user?.id || isLoading) {
            return false;
        }

        return isCurrentSigner;
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
        <div className='border-primary-200 flex w-[260px] flex-col gap-6 rounded-2xl border bg-white px-3 py-4 whitespace-pre-wrap'>
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
                />
            )}
        </div>
    );
};

export default ChatSystem;
