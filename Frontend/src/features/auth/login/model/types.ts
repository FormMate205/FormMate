import { z } from 'zod';

export const loginFormSchema = z.object({
    email: z.string().email('올바른 이메일 형식이어야 합니다.'),
    password: z
        .string()
        .min(8, '비밀번호는 8자 이상이어야 합니다.')
        .regex(
            /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>/?]).{8,}$/,
            '영문, 숫자, 기호를 모두 포함해야 합니다.',
        ),
});

export type LoginFormSchema = z.infer<typeof loginFormSchema>;
