import { useFunnel } from '@use-funnel/react-router-dom';
import { transferSteps, TransferState } from '../../model/transferFunnelSteps';
import SelectTabs, { SelectDispatchPayload } from '../SelectTabs';
import EnterAmountStep from './steps/EnterAmountStep';
import PlaceholderStep from './steps/PlaceHolderStep';

const TransferFunnel = () => {
    const funnel = useFunnel<{
        selectTarget: TransferState;
        enterAmount: Required<
            Pick<
                TransferState,
                'partnerId' | 'partnerName' | 'formId' | 'repaymentAmount'
            >
        >;
        password: Required<TransferState>;
        done: Required<TransferState>;
    }>({
        id: 'transfer-funnel',
        steps: transferSteps,
        initial: {
            step: 'selectTarget',
            context: {},
        },
    });

    return (
        <funnel.Render
            selectTarget={funnel.Render.with({
                events: {
                    사람선택완료: (
                        payload: SelectDispatchPayload,
                        { history },
                    ) => {
                        history.push('enterAmount', payload);
                    },
                    계약선택완료: (
                        payload: SelectDispatchPayload,
                        { history },
                    ) => {
                        history.push('enterAmount', payload);
                    },
                },
                render({ dispatch }) {
                    const handleSelectPerson = (
                        payload: SelectDispatchPayload,
                    ) => {
                        dispatch('사람선택완료', payload);
                    };
                    const handleSelectContract = (
                        payload: SelectDispatchPayload,
                    ) => {
                        dispatch('계약선택완료', payload);
                    };

                    return (
                        <SelectTabs
                            onSelectPerson={handleSelectPerson}
                            onSelectContract={handleSelectContract}
                        />
                    );
                },
            })}
            enterAmount={({ context, history }) => {
                const handleConfirm = (amount: number) => {
                    history.push('password', { ...context, amount });
                };

                return (
                    <EnterAmountStep
                        partnerName={context.partnerName}
                        formId={context.formId}
                        repaymentAmount={context.repaymentAmount}
                        onConfirm={handleConfirm}
                    />
                );
            }}
            password={() => <PlaceholderStep name='password' />}
            done={() => <PlaceholderStep name='done' />}
        />
    );
};

export default TransferFunnel;
