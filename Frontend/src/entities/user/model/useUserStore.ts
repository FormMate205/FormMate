import { create } from 'zustand';

interface UserState {
    token: string | null;
    isLoggedIn: boolean;
    setLogin: (token: string) => void;
    logout: () => void;
}

export const useUserStore = create<UserState>((set) => ({
    token: null,
    isLoggedIn: false,
    setLogin: (token) => set({ token, isLoggedIn: true }),
    logout: () => set({ token: null, isLoggedIn: false }),
}));
