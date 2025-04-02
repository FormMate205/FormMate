import { useSuspenseInfiniteQuery } from '@tanstack/react-query';
import api from '@/shared/api/instance';
import { InfinitySliceRequest } from '@/shared/model/types';
import { useIntersection } from '@/shared/model/useIntersection';
import { ChatRoomsResponse } from '../model/types';

// 채팅방 목록 조회
const getChatRooms = async ({
    page,
    size,
}: InfinitySliceRequest): Promise<ChatRoomsResponse> => {
    const response = await api.get('/chat/rooms', {
        params: { page, size },
    });

    return response.data;
};

export const useGetChatRooms = ({ page, size }: InfinitySliceRequest) => {
    const { data, fetchNextPage, hasNextPage } = useSuspenseInfiniteQuery({
        queryKey: ['chatRooms'],
        queryFn: ({ pageParam }) =>
            getChatRooms({
                ...pageParam,
                size,
            }),
        initialPageParam: { page },
        getNextPageParam: (lastPage) => {
            // 마지막 페이지면 undefined 반환
            if (lastPage.last) return undefined;

            // 다음 페이지 번호 계산
            return {
                page: (parseInt(lastPage.pageNumber) + 1).toString(),
            };
        },
    });

    // 모든 페이지의 데이터를 하나로 합침
    const rooms = data ? data.pages.flatMap((page) => page.content) : [];

    // intersection observer로 뷰포트 확인
    const lastItemRef = useIntersection(
        { threshold: 0.1, rootMargin: '0px' },
        () => {
            if (hasNextPage) {
                fetchNextPage();
            }
        },
    );

    return { rooms, fetchNextPage, lastItemRef };
};
