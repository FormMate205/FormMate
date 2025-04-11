import { FormPartner } from '@/entities/formDraft/model/types';
import { Pagenation, PagenationRequest } from '@/shared/model/types';

// 최근 계약 상대 목록 response
export type RecentFormPartnerResponse = {
    content: FormPartner[];
} & Pagenation;

// 최근 계약 상대 검색 resquest
export type SearchRecentFormPartnerRequest = PagenationRequest & {
    input: string;
};
