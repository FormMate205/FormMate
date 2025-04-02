import { create } from 'zustand';

interface AccountState {
    hasAccount: boolean;
    setHasAccount: (value: boolean) => void;
}

export const useAccountStore = create<AccountState>((set) => ({
    hasAccount: false,
    setHasAccount: (value) => set({ hasAccount: value }),
}));
