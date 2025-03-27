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
