import { create } from 'zustand';
import { User } from './types';

interface UserState {
    user: User | null;
    isLoggedIn: boolean;
    setUser: (user: User) => void;
    clearUser: () => void;
    setLoggedIn: (value: boolean) => void;
    setHasAccount: (value: boolean) => void;
}

export const useUserStore = create<UserState>((set) => ({
    user: null,
    isLoggedIn: false,
    setUser: (user) => set({ user, isLoggedIn: true }),
    clearUser: () => set({ user: null, isLoggedIn: false }),
    setLoggedIn: (value) =>
        set((state) => ({
            user: state.user ? { ...state.user, isLogged: value } : null,
        })),
    setHasAccount: (value) =>
        set((state) => ({
            user: state.user ? { ...state.user, hasAccount: value } : null,
        })),
}));
