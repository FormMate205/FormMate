import { Pagenation, PagenationRequest } from '@/shared/model/types';

export interface Partner {
    userId: string;
    userName: string;
    phoneNumber: string;
}

export type GetPartnerListRequest = { input: string } & PagenationRequest;

export type GetPartnerListResponse = { content: Partner[] } & Pagenation;

export type TabListItem = {
    id: string;
    title: string;
    subString: string;
};

export interface ContractByPartnerItem {
    formId: string; // 계약 번호
    userIsCreditor: boolean; // 채권자, 채무자 표시
    nextRepaymentAmount: number; // 다음 상환금액
    nextRepaymentDate: string | number[]; // 다음 상환일
    contractDuration: string; // 계약 기간
}

// 납부 예정 금액 정보(송금 화면)
export type GetContractsByPartnerResponse = ContractByPartnerItem[];

export type GetScheduledPaymentInfoResponse = {
    monthlyRemainingPayment: number;
    earlyRepaymentFeeRate: number;
};
