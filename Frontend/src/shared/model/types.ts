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
    numberOfElements: string;
    empty: boolean;
}

// 무한스크롤 (slice) request
export type InfinitySliceRequest = { page: string } & {
    size: string;
};

// 다음 주소검색 api용 타입
declare global {
    interface Window {
        daum: {
            Postcode: new (options: PostcodeOptions) => { open(): void };
        };
    }

    interface PostcodeData {
        roadAddress: string;
        jibunAddress: string;
        zonecode: string;
        addressType: string;
        buildingName: string;
        apartment: string;
        bname: string;
    }

    interface PostcodeOptions {
        oncomplete: (data: PostcodeData) => void;
        onclose?: () => void;
    }
}
