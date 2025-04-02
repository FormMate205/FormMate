import { useSuspenseInfiniteQuery } from '@tanstack/react-query';
import api from '@/shared/api/instance';
import { useIntersection } from '@/shared/model/useIntersection';
import {
    GetTransactionListRequest,
    GetTransactionListResponse,
} from '../model/types';

const getTransactionList = async ({
    pageable,
    ...rest
}: GetTransactionListRequest): Promise<GetTransactionListResponse> => {
    const response = await api.get('/transfer', {
        params: { ...pageable, ...rest },
    });
    return response.data;
};

export const useGetTransactionList = ({
    pageable,
    ...filters
}: GetTransactionListRequest) => {
    const { data, fetchNextPage, hasNextPage, refetch, isFetchingNextPage } =
        useSuspenseInfiniteQuery({
            queryKey: ['transactionList', filters],
            queryFn: async ({ pageParam }) => {
                return getTransactionList({
                    ...filters,
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

    const transactions = data ? data.pages.flatMap((page) => page.content) : [];

    const lastItemRef = useIntersection(
        { threshold: 0.1, rootMargin: '0px' },
        () => {
            if (hasNextPage && !isFetchingNextPage) {
                fetchNextPage();
            }
        },
    );

    return {
        transactions,
        hasNextPage,
        fetchNextPage,
        refetch,
        lastItemRef,
    };
};
