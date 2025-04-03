import { MouseEvent } from 'react';
import { Button } from '@/components/ui/button';
import CommonPopover from '@/widgets/modal/CommonPopover';

interface ChatBotPopoverProps {
    title: string;
    description: string;
    onClick: (e: MouseEvent<HTMLButtonElement>) => void;
}

const ChatBotPopover = ({
    title,
    description,
    onClick,
}: ChatBotPopoverProps) => {
    const titleLines = title.split('.');
    const descriptionLines = description.split(',');

    return (
        <CommonPopover
            triggerChildren={
                <div className='relative flex flex-col items-center justify-end gap-1'>
                    <img
                        src='/assets/images/chatbot-btn.png'
                        alt='전송하기'
                        className='absolute -top-5 left-1/2 -translate-x-1/2'
                        width={40}
                    />
                    <p className='text-line-300 mt-6 font-semibold'>
                        계약 생성
                    </p>
                </div>
            }
            children={
                <div className='top-auto bottom-32 flex translate-y-0 flex-col items-center gap-4 shadow-xs'>
                    <div className='flex flex-col items-center gap-2'>
                        <img
                            src='/assets/images/chatbot.png'
                            alt='챗봇 이미지'
                            width={100}
                        />
                        <div className='flex flex-col items-center text-lg font-bold'>
                            {titleLines.map(
                                (line, index) =>
                                    // 빈 문자열은 렌더링하지 않음
                                    line.trim() && (
                                        <span key={index}>{line.trim()}</span>
                                    ),
                            )}
                        </div>
                        <div className='text-line-700 flex flex-col items-center text-sm'>
                            {descriptionLines.map(
                                (line, index) =>
                                    line.trim() && (
                                        <span key={index}>{line.trim()}</span>
                                    ),
                            )}
                        </div>
                    </div>

                    <Button
                        variant={'primary'}
                        children='시작하기'
                        className='w-[250px] rounded-[60px] border-none'
                        onClick={onClick}
                    />
                </div>
            }
        />
    );
};

export default ChatBotPopover;
