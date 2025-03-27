import { ChangeEvent, MouseEvent, useRef, useEffect } from 'react';

interface ChatInputProps {
    isActive?: boolean;
    value: string;
    onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
    onClick: (e: MouseEvent<HTMLButtonElement>) => void;
}

const ChatInput = ({
    isActive = true,
    value,
    onChange,
    onClick,
}: ChatInputProps) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${Math.max(textareaRef.current.scrollHeight, 24)}px`;
        }
    }, [value]);

    return (
        <div className='flex w-full items-end gap-2 py-2'>
            <div className='flex w-full rounded-[24px] bg-white px-4 py-2 shadow-sm'>
                <textarea
                    ref={textareaRef}
                    disabled={!isActive}
                    value={value}
                    onChange={onChange}
                    className='max-h-32 w-full resize-none overflow-y-auto leading-normal focus:outline-none'
                    placeholder='메시지를 입력하세요.'
                    rows={1}
                    style={{ minHeight: '24px' }}
                />
            </div>
            <button
                disabled={!isActive}
                onClick={onClick}
                className='flex-shrink-0'
            >
                {isActive ? (
                    <img src='/public/assets/images/send.png' alt='전송하기' />
                ) : (
                    <img
                        src='/public/assets/images/send-disabled.png'
                        alt='전송불가'
                    />
                )}
            </button>
        </div>
    );
};

export default ChatInput;
