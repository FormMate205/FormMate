import { useQuery, useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { ContractStatus } from '@/entities/contract/model/types';
import api from '@/shared/api/instance';
import { useIntersection } from '@/shared/model/useIntersection';
import {
    GetContractListResponse,
    GetPaymentHistoryListRequest,
    GetPaymentHistoryListResponse,
    GetPaymentSummaryResponse,
} from '../model/types';

// 계약 리스트 조회 및 상태별 필터링
const getContractList = async (
    status: ContractStatus[],
): Promise<GetContractListResponse> => {
    const searchParams = new URLSearchParams();
    status.forEach((s) => searchParams.append('status', s));
    const response = await api.get<GetContractListResponse>(
        `/contract?${searchParams.toString()}`,
    );
    return response.data;
};

export const useGetContractList = (status: ContractStatus[]) => {
    return useQuery({
        queryKey: ['contractList', status],
        queryFn: () => getContractList(status),
    });
};

// 납부 요약 조회
const getPaymentSummary = async (
    formId: string,
): Promise<GetPaymentSummaryResponse> => {
    const response = await api.get<GetPaymentSummaryResponse>(
        `/contract/${formId}/interest`,
    );
    return response.data;
};

export const useGetPaymentSummary = (formId: string) => {
    return useQuery({
        queryKey: ['paymentSummary', formId],
        queryFn: () => getPaymentSummary(formId),
    });
};

// 납부 내역 조회
const getPaymentHistoryList = async ({
    formId,
    status,
    pageable,
}: GetPaymentHistoryListRequest): Promise<GetPaymentHistoryListResponse> => {
    const response = await api.get<GetPaymentHistoryListResponse>(
        `/transfer/${formId}`,
        {
            params: {
                page: pageable.page,
                size: pageable.size,
                status,
            },
        },
    );
    return response.data;
};

export const useGetPaymentHistoryList = ({
    formId,
    status,
    pageable,
}: GetPaymentHistoryListRequest) => {
    const { data, fetchNextPage, hasNextPage, refetch, isFetchingNextPage } =
        useSuspenseInfiniteQuery({
            queryKey: ['paymentHistoryList', formId, status],
            queryFn: async ({ pageParam }) => {
                return getPaymentHistoryList({
                    formId,
                    status,
                    pageable: {
                        ...pageable,
                        page: pageParam.toString(),
                    },
                });
            },
            getNextPageParam: (lastPage) => {
                const currentPage = parseInt(lastPage.pageable.page);
                const totalPages = parseInt(lastPage.totalPages);
                return currentPage < totalPages - 1
                    ? currentPage + 1
                    : undefined;
            },
            initialPageParam: 0,
        });

    const paymentHistoryList = data
        ? data.pages.flatMap((page) => page.content)
        : [];

    const lastItemRef = useIntersection(
        { threshold: 0.1, rootMargin: '0px' },
        () => {
            if (hasNextPage && !isFetchingNextPage) {
                fetchNextPage();
            }
        },
    );

    return {
        paymentHistoryList,
        hasNextPage,
        fetchNextPage,
        refetch,
        lastItemRef,
    };
};
