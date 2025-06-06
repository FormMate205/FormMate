import { queryClient } from '@/app/provider/queryClient';
import api from '@/shared/api/instance';
import { useUserStore } from '../../user/model/userStore';

export const logout = async () => {
    try {
        await api.post('/auth/logout');
    } finally {
        localStorage.removeItem('accessToken');
        const store = useUserStore.getState();
        store.clearUser();
        store.setLoggedIn(false);
        queryClient.removeQueries({ queryKey: ['user'] });
        window.location.href = '/login';
    }
};
