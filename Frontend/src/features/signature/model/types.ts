// 서명 request
export type SignatureRequest = {
    formId: string;
    userName: string;
    phoneNumber: string;
};

// 계약파기 요청 response
export type TerminationResponse = {
    requestedById: string;
};

// 계약파기 확인 request
export type TerminationRequest = {
    formId: string;
    phoneNumber: string;
    verificationCode: string;
    recaptchaToken: string;
};
