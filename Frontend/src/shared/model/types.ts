// 페이지네이션
export interface Pagenation {
    totalElements: string;
    totalPages: string;
    pageable: {
        page: string;
        size: string;
        sort?: {
            sorted: boolean;
            direction: string;
        };
    };
}

// 페이지네이션 request
export type PagenationRequest = Pick<Pagenation, 'pageable'>;

export type TagColor = 'primary' | 'subPurple' | 'subPink' | 'line';

// 무한스크롤 (slice)
export interface InfinitySlice {
    pageNumber: string;
    pageSize: string;
    first: boolean;
    last: boolean;
    numberOfElement: string;
    empty: boolean;
}

// 무한스크롤 (slice) request
export type InfinitySliceRequest = { formId: string } & { page: string } & {
    size: string;
};
