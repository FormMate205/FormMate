import { useFunnel } from '@use-funnel/react-router-dom';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { usePostVerifyPassword, usePostTransfer } from '../../api/TransferAPI';
import { transferSteps, TransferState } from '../../model/transferFunnelSteps';
import SelectTabs, { SelectDispatchPayload } from '../SelectTabs';
import EnterAmountStep from './steps/EnterAmountStep';
import EnterPasswordStep from './steps/EnterPasswordStep';
import FunnelHeader from './steps/FunnelHeader';
import ResultStep from './steps/ResultStep';

type FunnelContextMap = {
    selectTarget: TransferState;
    enterAmount: Required<
        Pick<
            TransferState,
            'partnerId' | 'partnerName' | 'formId' | 'repaymentAmount'
        >
    >;
    password: Required<TransferState>;
    done: Required<TransferState>;
};

type PasswordEvent = {
    type: '비밀번호검증성공' | '비밀번호검증실패';
    payload: Required<TransferState>;
};

const PasswordStep = ({
    context,
    dispatch,
    onBack,
}: {
    context: Required<TransferState>;
    dispatch: (event: PasswordEvent) => void;
    onBack: () => void;
}) => {
    const navigate = useNavigate();
    const { mutate: verifyPassword } = usePostVerifyPassword();
    const { mutate: transfer } = usePostTransfer();
    const [shouldReset, setShouldReset] = useState(false);

    const handleConfirm = (password: string) => {
        verifyPassword(
            { accountPassword: password },
            {
                onSuccess: (isValid) => {
                    if (isValid) {
                        transfer(
                            {
                                partnerId: context.partnerId,
                                formId: context.formId,
                                repaymentAmount: context.repaymentAmount,
                                amount: context.amount ?? 0,
                            },
                            {
                                onSuccess: () => {
                                    dispatch({
                                        type: '비밀번호검증성공',
                                        payload: context,
                                    });
                                },
                                onError: () => {
                                    toast.error('송금 중 오류가 발생했습니다.');
                                    navigate('/');
                                },
                            },
                        );
                    } else {
                        setShouldReset(true);
                        dispatch({
                            type: '비밀번호검증실패',
                            payload: context,
                        });
                    }
                },
                onError: () => {
                    setShouldReset(true);
                    dispatch({ type: '비밀번호검증실패', payload: context });
                },
            },
        );
    };

    useEffect(() => {
        if (shouldReset) {
            setShouldReset(false);
        }
    }, [shouldReset]);

    return (
        <>
            <FunnelHeader title='비밀번호 입력' onBack={onBack} />
            <EnterPasswordStep
                onConfirm={handleConfirm}
                onReset={shouldReset ? () => {} : undefined}
            />
        </>
    );
};

const TransferFunnel = () => {
    const navigate = useNavigate();
    const funnel = useFunnel<FunnelContextMap>({
        id: 'transfer-funnel',
        steps: transferSteps,
        initial: {
            step: 'selectTarget',
            context: {},
        },
    });

    const handleSelectPerson = (payload: SelectDispatchPayload) => {
        funnel.history.push('enterAmount', () => ({
            partnerId: payload.partnerId,
            partnerName: payload.partnerName,
            formId: payload.formId,
            repaymentAmount: payload.repaymentAmount,
        }));
    };

    const handleSelectContract = (payload: SelectDispatchPayload) => {
        funnel.history.push('enterAmount', () => ({
            partnerId: payload.partnerId,
            partnerName: payload.partnerName,
            formId: payload.formId,
            repaymentAmount: payload.repaymentAmount,
        }));
    };

    const handleConfirmAmount = (
        context: FunnelContextMap['enterAmount'],
        amount: number,
    ) => {
        funnel.history.push('password', () => ({
            partnerId: context.partnerId,
            partnerName: context.partnerName,
            formId: context.formId,
            repaymentAmount: context.repaymentAmount,
            amount,
        }));
    };

    const handleBackToSelectTarget = () => {
        funnel.history.push('selectTarget', () => ({}));
    };

    const handleBackToEnterAmount = (context: FunnelContextMap['password']) => {
        funnel.history.push('enterAmount', () => ({
            partnerId: context.partnerId,
            partnerName: context.partnerName,
            formId: context.formId,
            repaymentAmount: context.repaymentAmount,
        }));
    };

    const handlePasswordSuccess = (event: PasswordEvent) => {
        if (event.type === '비밀번호검증성공') {
            funnel.history.push('done', () => event.payload);
        } else {
            toast.error('비밀번호가 일치하지 않습니다!');
        }
    };

    const handleBackToHome = () => {
        navigate('/');
    };

    return (
        <>
            {funnel.step === 'selectTarget' && (
                <>
                    <FunnelHeader title='송금하기' onBack={handleBackToHome} />
                    <SelectTabs
                        onSelectPerson={handleSelectPerson}
                        onSelectContract={handleSelectContract}
                    />
                </>
            )}
            {funnel.step === 'enterAmount' && (
                <>
                    <FunnelHeader
                        title='송금 금액 입력'
                        onBack={handleBackToSelectTarget}
                    />
                    <EnterAmountStep
                        partnerName={funnel.context.partnerName}
                        formId={funnel.context.formId}
                        repaymentAmount={funnel.context.repaymentAmount}
                        onConfirm={(amount) =>
                            handleConfirmAmount(
                                funnel.context as FunnelContextMap['enterAmount'],
                                amount,
                            )
                        }
                    />
                </>
            )}
            {funnel.step === 'password' && (
                <PasswordStep
                    context={funnel.context as Required<TransferState>}
                    dispatch={handlePasswordSuccess}
                    onBack={() =>
                        handleBackToEnterAmount(
                            funnel.context as FunnelContextMap['password'],
                        )
                    }
                />
            )}
            {funnel.step === 'done' && (
                <>
                    <FunnelHeader title='송금 완료' />
                    <ResultStep
                        name={funnel.context.partnerName}
                        amount={funnel.context.amount?.toLocaleString() ?? '0'}
                        message='송금이 완료되었습니다.'
                    />
                </>
            )}
        </>
    );
};

export default TransferFunnel;
