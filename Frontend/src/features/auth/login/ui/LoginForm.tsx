import { useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { refreshToken } from '@/lib/refreshToken';
import { login } from '../../../../entities/auth/api/login';
import { LoginFormSchema } from '../model/types';
import { useLoginForm } from '../model/useLoginForm';

const LoginForm = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
    } = useLoginForm();

    const onSubmit = async (data: LoginFormSchema) => {
        try {
            await login(data);
            await refreshToken(); // FCM 토큰 갱신

            // 유저 정보 쿼리 갱신
            await queryClient.invalidateQueries({ queryKey: ['user'] });
            // 홈으로 이동
            navigate('/');
        } catch (err) {
            if (err instanceof AxiosError) {
                // 서버에서 전달한 에러 메시지가 있는 경우
                if (err.response?.data?.message) {
                    alert(err.response.data.message);
                } else {
                    // 기본 에러 메시지
                    alert('로그인 중 오류가 발생했습니다.');
                }
            } else {
                // 기타 예상치 못한 에러
                alert('로그인 중 알 수 없는 오류가 발생했습니다.');
            }
        }
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className='mx-auto flex max-w-md flex-col gap-6 p-6'
        >
            <h1 className='mt-20 mb-20 text-center text-3xl font-bold'>
                FormMate
            </h1>

            <div className='flex flex-col gap-2'>
                <input
                    type='email'
                    placeholder='아이디(이메일)를 입력하세요.'
                    {...register('email')}
                    className='border-line-300 focus:ring-primary-500 rounded border px-4 py-3 focus:ring-2 focus:outline-none'
                />
                {errors.email && (
                    <p className='text-sm text-red-500'>
                        {errors.email.message}
                    </p>
                )}

                <input
                    type='password'
                    placeholder='비밀번호를 입력하세요.'
                    {...register('password')}
                    className='border-line-300 focus:ring-primary-500 rounded border px-4 py-3 focus:ring-2 focus:outline-none'
                />
                {errors.password && (
                    <p className='text-sm text-red-500'>
                        {errors.password.message}
                    </p>
                )}

                <div className='mt-2'>
                    <Button
                        type='submit'
                        variant='primary'
                        disabled={!isValid}
                        className='mb-3'
                    >
                        로그인
                    </Button>
                    <div className='text-line-700 flex justify-between text-sm'>
                        <button onClick={() => navigate('/login/signup')}>
                            회원가입
                        </button>
                        <button onClick={() => navigate('/login/findPw')}>
                            비밀번호 찾기
                        </button>
                    </div>
                </div>
            </div>

            <div className='border-line-200 mt-2 flex justify-center gap-3 border-t pt-7'>
                <img
                    src='/assets/images/google.png'
                    alt='구글'
                    className='h-10 w-10 cursor-pointer'
                    onClick={() => {
                        window.location.href =
                            'https://j12a205.p.ssafy.io/oauth2/authorization/google';
                    }}
                />
                <img
                    src='/assets/images/naver.png'
                    alt='네이버'
                    className='h-10 w-10 cursor-pointer'
                    onClick={() => {
                        window.location.href =
                            'https://j12a205.p.ssafy.io/oauth2/authorization/naver';
                    }}
                />
            </div>
        </form>
    );
};

export default LoginForm;
