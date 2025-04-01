import { create } from 'zustand';
import { User } from './types';

interface UserState {
    user: User | null;
    setUser: (user: User) => void;
    clearUser: () => void;
    setLoggedIn: (value: boolean) => void;
    setHasAccount: (value: boolean) => void;
}

export const useUserStore = create<UserState>((set) => ({
    user: null,
    setUser: (user) => set({ user }),
    clearUser: () => set({ user: null }),
    setLoggedIn: (value) =>
        set((state) => ({
            user: state.user ? { ...state.user, isLogged: value } : null,
        })),
    setHasAccount: (value) =>
        set((state) => ({
            user: state.user ? { ...state.user, hasAccount: value } : null,
        })),
}));
