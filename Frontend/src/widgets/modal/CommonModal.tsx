import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Icons } from '@/shared';

interface CommonModalProps {
    trigger: string;
    title: string;
    description: string;
    onClick: () => void;
    confirmText: string;
}

const CommonModal = ({
    trigger,
    title,
    description,
    onClick,
    confirmText,
}: CommonModalProps) => {
    const titleLines = title.split('.');
    const descriptionLines = description.split(',');

    return (
        <Dialog>
            <DialogTrigger>
                <div className='flex flex-col items-center justify-end gap-1'>
                    <Icons name='chatbot' size={40} />
                    <p className='text-line-300 font-semibold'>{trigger}</p>
                </div>
            </DialogTrigger>

            <DialogContent className='top-auto bottom-32 flex translate-y-0 flex-col items-center gap-4 bg-white'>
                <DialogHeader className='flex flex-col items-center gap-2'>
                    <img
                        src='/public/assets/images/chatbot.png'
                        alt='챗봇 이미지'
                        width={100}
                    />
                    <DialogTitle className='flex flex-col items-center text-lg font-bold'>
                        {titleLines.map(
                            (line, index) =>
                                // 빈 문자열은 렌더링하지 않음
                                line.trim() && (
                                    <span key={index}>{line.trim()}</span>
                                ),
                        )}
                    </DialogTitle>
                    <DialogDescription className='text-line-700 flex flex-col items-center text-sm'>
                        {descriptionLines.map(
                            (line, index) =>
                                line.trim() && (
                                    <span key={index}>{line.trim()}</span>
                                ),
                        )}
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter>
                    <Button
                        variant={'primary'}
                        children={confirmText}
                        className='w-[250px] rounded-[60px]'
                        onClick={onClick}
                    />
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default CommonModal;
