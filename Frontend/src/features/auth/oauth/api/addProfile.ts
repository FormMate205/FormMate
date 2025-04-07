import api from '@/shared/api/instance';
import { AdditionalInfo } from '../model/types';

export const addProfile = (data: AdditionalInfo, token: string) => {
    console.log('api token:', token);
    return api.post('/auth/profile/complete', data, {
        headers: {
            Authorization: token,
        },
    });
};
