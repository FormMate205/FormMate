import { useNavigate } from 'react-router-dom';
import { Icons } from '@/shared';
import ChatBotPopover from './ui/ChatBotPopover';

interface FooterProps {
    unreadChat?: boolean;
}

const Footer = ({ unreadChat = false }: FooterProps) => {
    const navigate = useNavigate();

    // 홈으로 이동
    const onNavigateHome = () => {
        navigate('/');
    };

    // 계약관리로 이동
    const onNavigateContract = () => {
        navigate('/contracts');
    };

    // 채팅으로 이동
    const onNavigateChat = () => {
        navigate('/chat');
    };

    // 내정보로 이동
    const onNavigateInfo = () => {
        navigate('/myinfo');
    };

    // 계약 생성으로 이동
    const onNavigateForm = () => {
        navigate('/form');
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
                <button
                    className='flex flex-col items-center justify-end gap-1'
                    onClick={onNavigateContract}
                >
                    <Icons name='docs' size={20} className='fill-line-300' />
                    <p className='text-line-300 font-semibold'>계약 관리</p>
                </button>

                {/* 계약 생성 모달 */}
                <ChatBotPopover
                    title='반갑습니다. 차용증 발급을 원하십니까?'
                    description='필요한 정보를 선택해주시면, AI가 대신 계약서를 만들어 드릴게요!'
                    onClick={onNavigateForm}
                />

                <button
                    className='flex flex-col items-center justify-end gap-1'
                    onClick={onNavigateChat}
                >
                    <div className='relative flex items-center justify-center'>
                        <Icons
                            name='chat-fill'
                            size={20}
                            className='fill-line-300'
                        />
                        {unreadChat && (
                            <span className='animate-pop absolute -top-[3px] -right-[2px] h-[6px] w-[6px] rounded-full bg-red-500'></span>
                        )}
                    </div>
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
