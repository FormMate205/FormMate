import { useState } from 'react';
import { SignupFormData } from '../types';

export const useSignupForm = () => {
    const [form, setForm] = useState<SignupFormData>({
        name: '',
        email: '',
        password: '',
        passwordConfirm: '',
        address: '',
        detailAddress: '',
        phone: '',
        certCode: '',
    });

    const handleChange = (key: keyof SignupFormData, value: string) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const isFormValid = Object.values(form).every(Boolean);

    return { form, handleChange, isFormValid };
};
