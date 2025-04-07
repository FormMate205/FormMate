import { z } from 'zod';

export const signatureFormSchema = z.object({
    name: z.string().min(2, '성명을 입력하세요.'),
    phone: z.string().min(10, "'-'를 제외한 전화번호를 입력하세요."),
    code: z.string().length(6, '인증번호를 입력하세요.').optional(),
    recaptchaToken: z.string().optional(),
});

export type SignatureFormValues = z.infer<typeof signatureFormSchema>;
