import { queryClient } from '@/app/provider/queryClient';
import api from '@/shared/api/instance';
import { removeAccessToken } from '@/shared/api/token';
import { useUserStore } from '../model/userStore';

export const logout = async () => {
    try {
        await api.post('/auth/logout');
    } catch (e) {
        console.warn('로그아웃 실패', e);
    } finally {
        removeAccessToken(); // 토큰 제거
        const store = useUserStore.getState();
        store.clearUser();
        store.setLoggedIn(false);
        queryClient.removeQueries({ queryKey: ['user'] });
        window.location.href = '/login';
    }
};
