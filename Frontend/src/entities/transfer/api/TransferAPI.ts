import { useSuspenseInfiniteQuery } from '@tanstack/react-query';
import api from '@/shared/api/instance';
import { useIntersection } from '@/shared/model/useIntersection';
import { GetPartnerListRequest, GetPartnerListResponse } from '../model/types';

// 나와 계약을 맺은 상대 조회
const getMyPartnerList = async (
    params: GetPartnerListRequest,
): Promise<GetPartnerListResponse> => {
    const { pageable, ...rest } = params;
    const response = await api.get('/form/partner', {
        params: {
            ...pageable,
            ...rest,
        },
    });
    return response.data;
};

export const useGetMyPartnerList = ({
    input,
    pageable,
}: GetPartnerListRequest) => {
    const { data, fetchNextPage, hasNextPage, refetch, isFetchingNextPage } =
        useSuspenseInfiniteQuery({
            queryKey: ['myPartnerList', input],
            queryFn: async ({ pageParam }) => {
                return getMyPartnerList({
                    input,
                    pageable: {
                        ...pageable,
                        page: pageParam.toString(),
                    },
                });
            },
            // 다음 페이지
            getNextPageParam: (lastPage) => {
                const currentPage = parseInt(lastPage.pageable.page);
                const totalPages = parseInt(lastPage.totalPages);
                return currentPage < totalPages - 1
                    ? currentPage + 1
                    : undefined;
            },
            initialPageParam: 0,
        });

    const partners = data ? data.pages.flatMap((page) => page.content) : [];

    const lastItemRef = useIntersection(
        { threshold: 0.1, rootMargin: '0px' },
        () => {
            if (hasNextPage && !isFetchingNextPage) {
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
