import { ChangeEvent, MouseEvent } from 'react';

interface ChatInputProps {
    isActive?: boolean;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onClick: (e: MouseEvent<HTMLButtonElement>) => void;
}

const ChatInput = ({ isActive = true, onChange, onClick }: ChatInputProps) => {
    return (
        <div className='flex w-full gap-1 rounded-[60px] bg-white p-1'>
            <input
                disabled={!isActive}
                onChange={onChange}
                className='w-full focus:outline-none'
            />
            <button disabled={!isActive} onClick={onClick}>
                {isActive ? (
                    <img src='/public/assets/images/send.png' alt='send' />
                ) : (
                    <img
                        src='/public/assets/images/send-disabled.png'
                        alt='send disabled'
                    />
                )}
            </button>
        </div>
    );
};

export default ChatInput;
