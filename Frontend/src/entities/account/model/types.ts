export interface RegisterAccountPayload {
    verificationCode: string;
    bankName: string;
    accountNumber: string;
    accountPassword: string;
}

export interface CheckAccountPayload {
    bankName: string;
    accountNumber: string;
}

export interface AccountInfo {
    hasAccount: boolean;
    bankName: string;
    accountNumber: string;
    accountBalance?: number;
}

export type GetAccountInfoResponse = AccountInfo;

export interface AccountStore {
    accountInfo: AccountInfo | null;
    setHasAccount: (hasAccount: boolean) => void;
    setAccountInfo: (info: AccountInfo) => void;
    clearAccount: () => void;
}
