import api from '@/shared/api/instance';

export const getMessages = async (roomId: string) => {
    const response = await api.get(`/chat/${roomId}/messages`);
    return response.data;
};
