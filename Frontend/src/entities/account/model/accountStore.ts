import { create } from 'zustand';
import { AccountStore } from './types';

export const useAccountStore = create<AccountStore>((set) => ({
    accountInfo: null,
    setHasAccount: (hasAccount) =>
        set((state) => {
            if (!state.accountInfo) return { accountInfo: null };

            return {
                accountInfo: {
                    ...state.accountInfo,
                    hasAccount,
                },
            };
        }),
    setAccountInfo: (info) => set({ accountInfo: info }),
    clearAccount: () => set({ accountInfo: null }),
}));
