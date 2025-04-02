import { useQuery, useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { FormPartner } from '@/entities/formDraft/model/types';
import api from '@/shared/api/instance';
import { useIntersection } from '@/shared/model/useIntersection';
import {
    RecentFormPartnerResponse,
    SearchRecentFormPartnerRequest,
} from '../../formDraft/model/types';

// 최근 계약 상대 조회 API
const getRecentFormPartner = async ({
    pageable,
    input,
}: SearchRecentFormPartnerRequest): Promise<RecentFormPartnerResponse> => {
    const response = await api.get<RecentFormPartnerResponse>('/form/partner', {
        params: { ...pageable, input },
    });
    return response.data;
};

export const useGetRecentFormPartner = ({
    pageable,
    input,
}: SearchRecentFormPartnerRequest) => {
    const { data, fetchNextPage, hasNextPage, refetch } =
        useSuspenseInfiniteQuery({
            queryKey: ['recentFormPartners', input],
            queryFn: async ({ pageParam }) => {
                const currentPageable = {
                    ...pageable,
                    page: pageParam.toString(),
                };
                return getRecentFormPartner({
                    pageable: currentPageable,
                    input,
                });
            },
            getNextPageParam: (data) => {
                // queryFn에서 반환된 데이터를 통해 현재 페이지와 총 페이지 가져옴
                const currentPage = parseInt(data.pageable.page);
                const totalPages = parseInt(data.totalPages);

                // 현재 페이지 < 총 페이지일 경우 다음 페이지 반환 / 그러지 않을 경우 첫페이지로 돌아감
                return currentPage < totalPages - 1
                    ? currentPage + 1
                    : undefined;
            },
            initialPageParam: 0,
        });

    // 모든 페이지의 데이터를 하나로 합침
    const partners = data ? data.pages.flatMap((page) => page.content) : [];

    // intersection observer로 뷰포트 확인
    const lastItemRef = useIntersection(
        { threshold: 0.1, rootMargin: '0px' },
        () => {
            if (hasNextPage) {
                fetchNextPage();
            }
        },
    );

    return {
        partners,
        hasNextPage,
        fetchNextPage,
        refetch,
        lastItemRef,
    };
};

// 새로운 계약 상대 검색 API
const getNewFormPartner = async (phoneNumber: string): Promise<FormPartner> => {
    const response = await api.get(`/users/${phoneNumber}`);
    console.log(response.data);
    return response.data;
};

export const useGetNewFormPartner = (phoneNumber: string) => {
    const { data } = useQuery({
        queryKey: ['newFormPartner', phoneNumber],
        queryFn: () => getNewFormPartner(phoneNumber),
        enabled: !!phoneNumber && phoneNumber.trim() !== '',
    });

    return { data };
};
