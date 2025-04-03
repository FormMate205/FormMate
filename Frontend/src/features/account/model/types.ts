export interface AccountInfo {
    hasAccount: boolean;
    bankName: string;
    accountNumber: string;
    accountBalance?: number;
}

export interface AccountFormState {
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
