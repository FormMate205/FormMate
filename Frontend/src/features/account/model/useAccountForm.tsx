import { create } from 'zustand';

interface AccountFormState {
    bankName: string;
    accountNumber: string;
    verificationCode: string;
    setBankName: (bankName: string) => void;
    setAccountNumber: (accountNumber: string) => void;
    setVerificationCode: (code: string) => void;
    clearAccountInfo: () => void;
}

export const useAccountFormStore = create<AccountFormState>((set) => ({
    bankName: '',
    accountNumber: '',
    verificationCode: '',
    setBankName: (bankName) => set({ bankName }),
    setAccountNumber: (accountNumber) => set({ accountNumber }),
    setVerificationCode: (code) => set({ verificationCode: code }),
    clearAccountInfo: () =>
        set({
            bankName: '',
            accountNumber: '',
            verificationCode: '',
        }),
}));
