import { create } from 'zustand';

interface AccountInfo {
    hasAccount: boolean;
    bankName: string;
    accountNumber: string;
    accountBalance?: number;
}

interface AccountStore {
    accountInfo: AccountInfo | null;
    setHasAccount: (hasAccount: boolean) => void;
    setAccountInfo: (info: AccountInfo) => void;
    clearAccount: () => void;
}

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
    // set((state) => ({
    //     accountInfo: {
    //         ...state.accountInfo!,
    //         hasAccount,
    //     },
    // })),
    setAccountInfo: (info) => set({ accountInfo: info }),
    clearAccount: () => set({ accountInfo: null }),
}));
