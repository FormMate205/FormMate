import { NavigateFunction } from 'react-router-dom';
import { queryClient } from '@/app/provider/queryClient';

export const logout = (navigate?: NavigateFunction) => {
    // 1. 토큰 제거
    localStorage.removeItem('accessToken');
    // 2. 유저 쿼리 제거 (전역 캐시 삭제)
    queryClient.removeQueries({ queryKey: ['user'] });

    if (navigate) navigate('/login');
};
