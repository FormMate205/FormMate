// 페이지네이션
export interface Pagenation {
    totalElements: string;
    totalpages: string;
    pageable: {
        page: string;
        size: string;
        sort: Sort;
    };
}

// 정렬 방식
export interface Sort {
    sorted: boolean;
    direction?: string;
}
