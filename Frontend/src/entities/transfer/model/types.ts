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
    formId: string;
    userIsCreditor: boolean;
    nextRepaymentAmount: number;
    nextRepaymentDate: string;
    contractDuration: string;
}

export type GetContractsByPartnerResponse = ContractByPartnerItem[];
