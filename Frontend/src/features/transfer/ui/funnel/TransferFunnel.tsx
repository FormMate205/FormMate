import { useFunnel } from '@use-funnel/react-router-dom';
import { transferSteps, TransferState } from '../../model/transferFunnelSteps';
import SelectTabs, { SelectDispatchType } from '../SelectTabs';
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
                    사람선택완료: (payload, { history }) => {
                        history.push('enterAmount', payload);
                    },
                    계약선택완료: (payload, { history }) => {
                        history.push('enterAmount', payload);
                    },
                },
                render: ({ dispatch }) => (
                    <SelectTabs dispatch={dispatch as SelectDispatchType} />
                ),
            })}
            enterAmount={funnel.Render.with({
                events: {
                    금액입력완료: (payload, { history }) => {
                        history.push('password', payload);
                    },
                },
                render: () => <PlaceholderStep name='enterAmount' />,
            })}
            password={() => <PlaceholderStep name='password' />}
            done={() => <PlaceholderStep name='done' />}
        />
    );
};

export default TransferFunnel;
