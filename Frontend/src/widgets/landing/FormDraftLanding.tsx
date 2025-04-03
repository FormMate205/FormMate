import { useNavigate } from 'react-router-dom';

const FormDraftLanding = () => {
    const navigate = useNavigate();

    // 3초 후 초안 생성 페이지로 이동
    setTimeout(() => {
        navigate('/draft');
    }, 3000);

    return (
        <div className='bg-primary-500 relative flex h-full w-full flex-col justify-between px-4 py-28'>
            {/* 배경 도형 */}
            <div className='aria-hidden absolute top-0 left-0 z-0 h-full w-full overflow-hidden'>
                <div className='bg-primary-400 absolute top-3/4 left-7/8 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-60'></div>
                <div className='bg-primary-500 absolute top-3/4 left-7/8 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full'></div>
                <div className='absolute top-3/5 left-7/8 h-[30px] w-[30px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white'></div>
                <div className='bg-primary-500 absolute top-3/5 left-7/8 h-[12px] w-[12px] -translate-x-1/2 -translate-y-1/2 rounded-full'></div>
            </div>

            <div className='z-10 flex w-full flex-col justify-start gap-2'>
                <img
                    src='/assets/images/chatbot-profile.png'
                    alt='챗봇 아이콘'
                    width={40}
                />
                <div className='flex flex-col gap-2 text-2xl text-white'>
                    <p>안녕하세요!</p>
                    <div className='flex flex-col text-2xl font-semibold text-white'>
                        <p>AI 챗봇이 쉽게</p>
                        <p>계약을 생성해 드릴게요</p>
                    </div>
                </div>
            </div>

            <div className='z-20 flex w-full justify-end'>
                <img
                    src='/assets/images/chatbot.png'
                    alt='챗봇 캐릭터 이미지'
                    width={260}
                    className='animate-float'
                />
            </div>
        </div>
    );
};

export default FormDraftLanding;
