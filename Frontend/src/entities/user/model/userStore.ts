import { create } from 'zustand';
import { User } from './types';

interface UserState {
    user: User | null;
    isLoggedIn: boolean;
    setUser: (user: User) => void;
    clearUser: () => void;
    setLoggedIn: (state: boolean) => void;
}

export const useUserStore = create<UserState>((set) => ({
    user: null,
    isLoggedIn: false,
    setUser: (user) => set({ user, isLoggedIn: true }),
    clearUser: () => set({ user: null, isLoggedIn: false }),
    setLoggedIn: (state) => set({ isLoggedIn: state }),
}));
