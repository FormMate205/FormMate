import { create } from 'zustand';
import { FormDraftRequest } from '@/entities/formDraft/model/types';

interface FormDraftState {
    formDraft: FormDraftRequest;
    setFormDraft: (formDraft: FormDraftRequest) => void;
    updateFormDraft: (update: Partial<FormDraftRequest>) => void;
    resetFormDraft: (initialReceiverId?: string) => void;
}

export const useFormDraftStore = create<FormDraftState>((set) => ({
    formDraft: {
        receiverId: '',
        creditorId: '',
        debtorId: '',
        maturityDate: '',
        loanAmount: '',
        repaymentMethod: '원금상환',
        repaymentDay: '0',
        interestRate: '',
        earlyRepaymentFeeRate: '',
        overdueInterestRate: '',
        overdueLimit: '',
        specialTermIndexes: [],
    },

    // 초안 생성
    setFormDraft: (formDraft) => set({ formDraft }),

    // 초안 수정
    updateFormDraft: (update) =>
        set((state) => ({
            formDraft: {
                ...state.formDraft,
                ...update,
            },
        })),

    // 초안 초기화
    resetFormDraft: (initialReceiverId = '') =>
        set({
            formDraft: {
                receiverId: initialReceiverId,
                creditorId: '',
                debtorId: '',
                maturityDate: '',
                loanAmount: '',
                repaymentMethod: '원금상환',
                repaymentDay: '0',
                interestRate: '',
                earlyRepaymentFeeRate: '',
                overdueInterestRate: '',
                overdueLimit: '',
                specialTermIndexes: [],
            },
        }),
}));
