import { useMutation, useQuery } from '@tanstack/react-query';
import { queryClient } from '@/app/provider/queryClient';
import api from '@/shared/api/instance';

// 알림 설정 여부 확인
const getSubscription = async (): Promise<boolean> => {
    const response = await api.get('/fcmtoken');
    return response.data;
};

export const useGetSubscription = () => {
    return useQuery({
        queryKey: ['getSubscription'],
        queryFn: () => getSubscription(),
    });
};

// 로그인했을 때 디바이스 토큰
export const refreshDeviceToken = async (token: string) => {
    const response = await api.patch('/fcmtoken/refresh', { token });
    return response.data;
};

// 알림 활성화
const activateDeviceToken = async (token: string) => {
    const response = await api.patch('/fcmtoken/activate', { token });
    return response.data;
};

export const useActivateDeviceToken = () => {
    return useMutation({
        mutationKey: ['activateDeviceToken'],
        mutationFn: (token: string) => activateDeviceToken(token),
        onMutate: async () => {
            // 구독 조회 쿼리 취소
            await queryClient.cancelQueries({
                queryKey: ['getSubscription'],
            });
            // UI를 위해 true로 업데이트
            queryClient.setQueryData(['getSubscription'], true);
        },
        // 실패시 롤백
        onError: () => {
            queryClient.setQueryData(['getSubscription'], false);
        },
        // 진짜 데이터를 서버와 동기화
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['getSubscription'] });
        },
    });
};

// 알림 비활성화
export const deactivateDeviceToken = async (token: string) => {
    const response = await api.patch('/fcmtoken/deactivate', { token });
    return response.data;
};

export const useDeactivateDeviceToken = () => {
    return useMutation({
        mutationKey: ['deactivateDeviceToken'],
        mutationFn: (token: string) => deactivateDeviceToken(token),
        onMutate: async () => {
            // 구독 조회 쿼리 취소
            await queryClient.cancelQueries({
                queryKey: ['getSubscription'],
            });
            // UI를 위해 false로 업데이트
            queryClient.setQueryData(['getSubscription'], false);
        },
        onError: () => {
            queryClient.setQueryData(['getSubscription'], true);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['getSubscription'] });
        },
    });
};
