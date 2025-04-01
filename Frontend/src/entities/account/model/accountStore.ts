import { create } from 'zustand';

interface AccountState {
    bankName: string;
    accountNumber: string;
    setBankInfo: (bankName: string, accountNumber: string) => void;
    clearBankInfo: () => void;
}

export const useAccountStore = create<AccountState>((set) => ({
    bankName: '',
    accountNumber: '',
    setBankInfo: (bankName, accountNumber) => set({ bankName, accountNumber }),
    clearBankInfo: () => set({ bankName: '', accountNumber: '' }),
}));
