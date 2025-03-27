import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { loginFormSchema, LoginFormSchema } from '../types';

export const useLoginForm = () => {
    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm<LoginFormSchema>({
        resolver: zodResolver(loginFormSchema),
        mode: 'onChange',
    });

    return {
        register,
        handleSubmit,
        errors,
        isValid,
    };
};
