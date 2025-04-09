import { create } from 'zustand';
import { PostTransferRequest } from './types';

interface TransferState extends PostTransferRequest {
    partnerName: string;
    earlyRepaymentFeeRate: number;
    setTransferInfo: (
        transferInfo: PostTransferRequest & { partnerName: string },
    ) => void;
    updateTransferInfo: (
        partial: Partial<
            PostTransferRequest & { partnerName: string } & {
                earlyRepaymentFeeRate: number;
            }
        >,
    ) => void;
    resetTransferInfo: () => void;
}

const useTransferStore = create<TransferState>((set) => ({
    partnerId: '',
    formId: '',
    repaymentAmount: 0,
    amount: 0,
    partnerName: '',
    earlyRepaymentFeeRate: 0,

    setTransferInfo: (transferInfo) => set({ ...transferInfo }),
    updateTransferInfo: (partial) => set((state) => ({ ...state, ...partial })),
    resetTransferInfo: () =>
        set({
            partnerId: '',
            partnerName: '',
            formId: '',
            repaymentAmount: 0,
            amount: 0,
            earlyRepaymentFeeRate: 0,
        }),
}));

export default useTransferStore;
