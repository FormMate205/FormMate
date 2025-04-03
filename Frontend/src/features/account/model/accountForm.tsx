import { create } from 'zustand';
import { AccountFormState } from './types';

export const useAccountForm = create<AccountFormState>((set) => ({
    bankName: '',
    accountNumber: '',
    verificationCode: '',
    accountPassword: '',
    setBankName: (bankName) => set({ bankName }),
    setAccountNumber: (accountNumber) => set({ accountNumber }),
    setVerificationCode: (verificationCode) => set({ verificationCode }),
    setAccountPassword: (accountPassword) => set({ accountPassword }),
    resetForm: () =>
        set({
            bankName: '',
            accountNumber: '',
            verificationCode: '',
            accountPassword: '',
        }),
}));
