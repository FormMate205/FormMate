import {
    ChangeEvent,
    MouseEvent,
    useRef,
    useEffect,
    KeyboardEvent,
} from 'react';

interface ChatInputProps {
    isActive?: boolean;
    value: string;
    onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
    onClick: (e: MouseEvent<HTMLButtonElement>) => void;
    onSend: () => void;
}

const ChatInput = ({
    isActive = true,
    value,
    onChange,
    onClick,
    onSend,
}: ChatInputProps) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const isMobile = useRef<boolean>(false);

    // 모바일 환경 체크
    useEffect(() => {
        const checkMobile = () => {
            isMobile.current =
                /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
                    navigator.userAgent,
                );
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        return () => {
            window.removeEventListener('resize', checkMobile);
        };
    }, []);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${Math.max(textareaRef.current.scrollHeight, 24)}px`;
        }
    }, [value]);

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (isMobile.current) return;

        // PC 환경에서 엔터키를 눌렀을 때
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (isActive && value.trim()) {
                onSend();
            }
        }
    };

    return (
        <div className='flex w-full items-end gap-2 py-2'>
            <div className='flex w-full rounded-[24px] bg-white px-4 py-2 shadow-sm'>
                <textarea
                    ref={textareaRef}
                    disabled={!isActive}
                    value={value}
                    onChange={onChange}
                    onKeyDown={handleKeyDown}
                    className='max-h-32 w-full resize-none overflow-y-auto leading-normal focus:outline-none'
                    placeholder='메시지를 입력하세요.'
                    rows={1}
                    style={{ minHeight: '24px' }}
                />
            </div>
            <button
                disabled={!isActive || value.trim() === ''}
                onClick={onClick}
                className='flex-shrink-0'
            >
                {isActive && value.trim() !== '' ? (
                    <img src='/assets/images/send.png' alt='전송하기' />
                ) : (
                    <img
                        src='/assets/images/send-disabled.png'
                        alt='전송불가'
                    />
                )}
            </button>
        </div>
    );
};

export default ChatInput;
