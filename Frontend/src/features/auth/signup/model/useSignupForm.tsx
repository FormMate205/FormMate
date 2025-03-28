import { create } from 'zustand';
import { SignupFormState } from '../types';

interface SignupFormStore extends SignupFormState {
    setField: (key: keyof SignupFormState, value: string | boolean) => void;
    resetForm: () => void;
    isFormValid: () => boolean;
}

// 초기 상태
const initialState: SignupFormState = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    detailAddress: '',
    certCode: '',
    isEmailChecked: false,
    isPhoneVerified: false,
};

// Zustand 스토어 생성
export const useSignupForm = create<SignupFormStore>((set, get) => ({
    ...initialState,

    // 필드 값 변경
    setField: (key, value) =>
        set((state) => ({
            ...state,
            [key]: value,
            // 이메일 변경 시 중복 체크 상태 초기화
            ...(key === 'email' ? { isEmailChecked: false } : {}),
            // 전화번호 변경 시 인증 상태 초기화
            ...(key === 'phone' ? { isPhoneVerified: false } : {}),
        })),

    // 폼 초기화
    resetForm: () => set(initialState),

    // 유효성 검사
    isFormValid: () => {
        const state = get();
        return !!(
            state.name &&
            state.email &&
            state.password &&
            state.confirmPassword &&
            state.phone &&
            state.address &&
            state.isEmailChecked &&
            state.isPhoneVerified &&
            state.password === state.confirmPassword
        );
    },
}));
