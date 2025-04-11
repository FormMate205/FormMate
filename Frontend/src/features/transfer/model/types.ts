// 송금하기 요청
export type PostTransferRequest = {
    partnerId: string;
    formId: string;
    repaymentAmount: number;
    amount: number;
};

// 송금하기 응답
export type PostTransferResponse = {
    userName: string;
    amount: number;
    status: string;
};

export type VerifyPasswordRequest = {
    accountPassword: string;
};
