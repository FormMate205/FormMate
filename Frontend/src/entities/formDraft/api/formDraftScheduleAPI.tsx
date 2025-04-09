import { useSuspenseInfiniteQuery } from '@tanstack/react-query';
import api from '@/shared/api/instance';
import { useIntersection } from '@/shared/model/useIntersection';
import {
    FormDraftScheduleRequest,
    FormDraftScheduleResponse,
} from '../model/types';

// 예상 납부 스케줄 API
const getFormDraftSchedule = async ({
    pageable,
    loanAmount,
    maturityDate,
    interestRate,
    repaymentDay,
    repaymentMethod,
}: FormDraftScheduleRequest): Promise<FormDraftScheduleResponse> => {
    const response = await api.post(
        '/form/plan',
        {
            loanAmount,
            maturityDate,
            interestRate,
            repaymentDay,
            repaymentMethod,
        },
        {
            params: { page: pageable.page, size: pageable.size },
        },
    );

    return response.data;
};

export const usePostFormDraftSchedule = ({
    pageable,
    loanAmount,
    maturityDate,
    interestRate,
    repaymentDay,
    repaymentMethod,
}: FormDraftScheduleRequest) => {
    const { data, fetchNextPage, hasNextPage, refetch } =
        useSuspenseInfiniteQuery({
            queryKey: ['formDraftSchedule'],
            queryFn: async ({ pageParam }) => {
                const currentPageable = {
                    ...pageable,
                    page: pageParam.toString(),
                };
                return getFormDraftSchedule({
                    pageable: currentPageable,
                    loanAmount,
                    maturityDate,
                    interestRate,
                    repaymentDay,
                    repaymentMethod,
                });
            },
            getNextPageParam: (data) => {
                // data가 없거나 pageable이 없는 경우 undefined 반환
                if (!data || !data.pageable) {
                    return undefined;
                }

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
    const schedules = data
        ? data.pages.flatMap((page) => page.schedulePage.content)
        : [];

    const totalRepaymentAmount = data?.pages[0].totalRepaymentAmount;

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
        schedules,
        totalRepaymentAmount,
        hasNextPage,
        fetchNextPage,
        refetch,
        lastItemRef,
    };
};
