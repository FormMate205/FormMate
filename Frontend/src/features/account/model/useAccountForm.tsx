import { create } from 'zustand';

interface AccountFormState {
    bankName: string;
    accountNumber: string;
    verificationCode: string;
    accountPassword: string;
    setBankName: (bankName: string) => void;
    setAccountNumber: (accountNumber: string) => void;
    setVerificationCode: (code: string) => void;
    setAccountPassword: (password: string) => void;
    resetForm: () => void;
}

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
