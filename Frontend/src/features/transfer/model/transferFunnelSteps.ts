import { createFunnelSteps } from '@use-funnel/react-router-dom';

export type TransferState = {
    partnerId?: string;
    partnerName?: string;
    formId?: string;
    repaymentAmount?: number;
    amount?: number;
};

export const transferSteps = createFunnelSteps<TransferState>()
    .extends('selectTarget')
    .extends('enterAmount', {
        requiredKeys: ['partnerId', 'partnerName', 'formId', 'repaymentAmount'],
    })
    .extends('password', {
        requiredKeys: [
            'partnerId',
            'partnerName',
            'formId',
            'repaymentAmount',
            'amount',
        ],
    })
    .extends('done', {
        requiredKeys: [
            'partnerId',
            'partnerName',
            'formId',
            'repaymentAmount',
            'amount',
        ],
    })
    .build();
