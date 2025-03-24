import { Button } from '@/components/ui/button';
import { Header } from '@/widgets';

export default function PasswordResetForm() {
    return (
        <div className='h-full flex-col justify-between'>
            <div className='flex flex-col gap-6 p-6'>
                <Header title='비밀번호 변경' />

                <h2 className='text-xl font-semibold'>비밀번호 변경하기</h2>

                <p className='text-md text-line-950'>
                    기존 비밀번호를 입력하세요
                </p>
                <input
                    type='password'
                    placeholder='비밀번호 입력'
                    className='border-line-300 border-b px-2 py-3'
                />

                <p className='text-md text-line-950'>
                    새 비밀번호를 입력하세요
                </p>
                <input
                    type='password'
                    placeholder='새 비밀번호 입력'
                    className='border-line-300 border-b px-2 py-3'
                />

                <input
                    type='password'
                    placeholder='새 비밀번호 확인'
                    className='border-line-300 border-b px-2 py-3'
                />
            </div>
            <div className='fixed bottom-0 left-0 w-full gap-6 p-6'>
                <Button
                    variant={'primary'}
                    className='bg-primary-500 text-white'
                >
                    비밀번호 변경
                </Button>
            </div>
        </div>
    );
}
