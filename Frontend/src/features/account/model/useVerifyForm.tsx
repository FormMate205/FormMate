import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { AccountVerifyValues } from './types';

const schema = z.object({
    verificationCode: z.string().length(4, '4자리 인증번호를 입력해주세요.'),
    bankName: z.string().min(1),
    accountNumber: z.string().min(10),
    accountPassword: z.string().min(6, '계좌 비밀번호 6자리를 입력해주세요.'),
});

export const useVerifyForm = () => {
    return useForm<AccountVerifyValues>({
        resolver: zodResolver(schema),
        mode: 'onChange',
    });
};
