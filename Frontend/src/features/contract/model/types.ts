import {
    ContractCard,
    ContractStatus,
    PaymentHistoryItem,
    PaymentStatus,
} from '@/entities/contract/model/types';
import { Pagenation, PagenationRequest } from '@/shared/model/types';

// 차용증 리스트 조회
export type GetContractListRequest = {
    status: ContractStatus[];
};

export type GetContractListResponse = ContractCard[];

// 납부내역
export type GetPaymentHistoryListResponse = {
    content: PaymentHistoryItem[];
} & Pagenation;

export type GetPaymentHistoryListRequest = {
    formId: string;
    status: PaymentStatus;
} & PagenationRequest;

// 납부요약
export interface PaymentSummary {
    paidPrincipalAmount: number; // 납부한 원금
    paidInterestAmount: number; // 납부한 이자
    paidOverdueInterestAmount: number; // 납부한 연체이자
    totalEarlyRepaymentFee: number; // 중도상환 수수료 총액
    unpaidAmount: number; // 미납 금액
    expectedPaymentAmountAtMaturity: number; // 만기 시 예상 납부 총액
    expectedPrincipalAmountAtMaturity: number; // 만기 시 총 원금
    expectedInterestAmountAtMaturity: number; // 만기 시 총 이자
}

export type GetPaymentSummaryResponse = PaymentSummary;
