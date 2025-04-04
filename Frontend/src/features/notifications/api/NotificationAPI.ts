import {
    useMutation,
    useQuery,
    useSuspenseInfiniteQuery,
    useSuspenseQuery,
} from '@tanstack/react-query';
import api from '@/shared/api/instance';
import { useIntersection } from '@/shared/model/useIntersection';
import {
    GetNotificationListRequest,
    GetNotificationListResposne,
    GetUnreadNotificationCountResponse,
    GetUnreadNotificationListResponse,
} from '../model/types';

// 읽지 않은 알림 목록 조회
const getUnreadNotificationList =
    async (): Promise<GetUnreadNotificationListResponse> => {
        const response =
            await api.get<GetUnreadNotificationListResponse>('/alert/unread');
        return response.data;
    };

export const useGetUnreadNotificationList = () => {
    return useSuspenseQuery({
        queryKey: ['unreadNotificationList'],
        queryFn: () => getUnreadNotificationList(),
    });
};

// 읽은 알림 추가 조회
const getNotificationList = async ({
    alertId,
    pageable,
}: GetNotificationListRequest): Promise<GetNotificationListResposne> => {
    const response = await api.get<GetNotificationListResposne>(
        '/alert/history',
        {
            params: {
                ...(alertId && { alertId }),
                ...pageable,
            },
        },
    );
    return response.data;
};

export const useGetNotificationList = ({
    alertId,
    pageable,
}: GetNotificationListRequest) => {
    const { data, fetchNextPage, hasNextPage, refetch, isFetchingNextPage } =
        useSuspenseInfiniteQuery({
            queryKey: ['notificationList', alertId],
            queryFn: async ({ pageParam }) => {
                return getNotificationList({
                    alertId,
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

    const notifications = data
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
        notifications,
        hasNextPage,
        fetchNextPage,
        refetch,
        lastItemRef,
    };
};

// 읽지 않은 알림 개수 조회
const getUnreadNotificationCount =
    async (): Promise<GetUnreadNotificationCountResponse> => {
        const response = await api.get<GetUnreadNotificationCountResponse>(
            '/alert/count-unread',
        );
        return response.data;
    };

export const useUnreadNotificationCount = () => {
    return useQuery({
        queryKey: ['unreadNotificationCount'],
        queryFn: () => getUnreadNotificationCount(),
    });
};

// 읽지 않은 알림 전체 읽음 처리
const updateNotificationList = async () => {
    const response = await api.patch('/alert');
    return response.data;
};

export const useUpdateNotificationList = () => {
    return useMutation({
        mutationFn: updateNotificationList,
    });
};
