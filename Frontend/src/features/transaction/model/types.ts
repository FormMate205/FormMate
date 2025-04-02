import { Pagenation, PagenationRequest } from '@/shared/model/types';

// 거래내역
export interface Transaction {
    partnerName: string;
    type: '출금' | '입금';
    amount: string;
    transactionDate: string;
}

// 거래내역 조회 Request
export type GetTransactionListRequest = {
    period: '1개월' | '3개월' | `${string}~${string}`;
    transferType: '전체' | '입금만' | '출금만';
    sortDirection: '최신순' | '과거순';
} & PagenationRequest;

// 거래내역 조회 Response
export type GetTransactionListResponse = {
    content: Transaction[];
} & Pagenation;
