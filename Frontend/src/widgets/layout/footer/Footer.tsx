import { useNavigate } from 'react-router-dom';
import { Icons } from '@/shared';
import FormStartModal from './ui/FormStartModal';

const Footer = () => {
    const navigate = useNavigate();

    // 홈으로 이동
    const onNavigateHome = () => {
        navigate('/');
    };

    // 계약관리로 이동
    // const onNavigateHome = () => {
    //     navigate('/');
    // };

    // 채팅으로 이동
    const onNavigateChat = () => {
        navigate('/chat');
    };

    // 내정보로 이동
    const onNavigateInfo = () => {
        navigate('/myinfo');
    };

    return (
        <div className='bottom-0 w-full bg-white shadow-sm'>
            <div className='flex justify-between px-6 py-2'>
                <button
                    className='flex flex-col items-center justify-end gap-1'
                    onClick={onNavigateHome}
                >
                    <Icons name='home' size={20} className='fill-line-300' />
                    <p className='text-line-300 font-semibold'>홈</p>
                </button>
                <button className='flex flex-col items-center justify-end gap-1'>
                    <Icons name='docs' size={20} className='fill-line-300' />
                    <p className='text-line-300 font-semibold'>계약 관리</p>
                </button>

                {/* 계약 생성 모달 */}
                <FormStartModal />

                <button
                    className='flex flex-col items-center justify-end gap-1'
                    onClick={onNavigateChat}
                >
                    <Icons
                        name='chat-fill'
                        size={20}
                        className='fill-line-300'
                    />
                    <p className='text-line-300 font-semibold'>채팅</p>
                </button>
                <button
                    className='flex flex-col items-center justify-end gap-1'
                    onClick={onNavigateInfo}
                >
                    <Icons name='mypage' size={20} className='fill-line-300' />
                    <p className='text-line-300 font-semibold'>내 정보</p>
                </button>
            </div>
        </div>
    );
};

export default Footer;
