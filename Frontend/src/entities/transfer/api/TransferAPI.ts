import { useQuery, useSuspenseInfiniteQuery } from '@tanstack/react-query';
import api from '@/shared/api/instance';
import { useIntersection } from '@/shared/model/useIntersection';
import {
    GetContractsByPartnerResponse,
    GetPartnerListRequest,
    GetPartnerListResponse,
    GetRepaymentContractListResponse,
    GetScheduledPaymentInfoResponse,
} from '../model/types';

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

// 특정 상대와의 계약 조회
const getContractByPartnerList = async (
    userId: string,
): Promise<GetContractsByPartnerResponse> => {
    const response = await api.get(`/contract/remain/${userId}`);
    return response.data;
};

export const useGetContractByPartnerList = (userId: string) => {
    return useQuery({
        queryKey: ['contractByPartnerList', userId],
        queryFn: () => getContractByPartnerList(userId),
        enabled: !!userId,
    });
};

// 납부 예정 금액 조회
const getScheduledPaymentInfo = async (
    formId: string,
): Promise<GetScheduledPaymentInfoResponse> => {
    const response = await api.get(`contract/${formId}/cost`);
    return response.data;
};

export const useGetScheduledPaymentInfo = (formId: string) => {
    return useQuery({
        queryKey: ['scheduledPaymentInfo', formId],
        queryFn: () => getScheduledPaymentInfo(formId),
        enabled: !!formId,
    });
};

// 나의 체결한 계약 목록 조회(송금화면에서 사용)
const getRepaymentContractList = async (
    partnerName?: string,
): Promise<GetRepaymentContractListResponse> => {
    const response = await api.get('contract/forms', {
        params: {
            partnerName,
        },
    });
    return response.data;
};

export const useGetRepaymentContractList = (partnerName?: string) => {
    return useQuery({
        queryKey: ['repaymentContractList', partnerName],
        queryFn: () => getRepaymentContractList(partnerName),
    });
};
