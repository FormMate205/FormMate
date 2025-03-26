import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogCancel,
    AlertDialogAction,
} from '@/components/ui/alert-dialog';
import Icons from '@/shared/icons/Icons';

interface Props {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
}

const ConfirmModal = ({
    open,
    onClose,
    onConfirm,
    title,
    description,
}: Props) => {
    return (
        <AlertDialog open={open} onOpenChange={onClose}>
            <AlertDialogContent className='flex flex-col items-center border-0 text-center shadow-xs'>
                {/* 상단 ! 아이콘 */}
                <div className='mx-auto mb-2'>
                    <Icons
                        name='exclamation'
                        className='fill-primary-500 h-6 w-6'
                    />
                </div>

                {/* 설명 문구 - 동적 */}
                <AlertDialogDescription className='text-sm whitespace-pre-wrap text-gray-500'>
                    {description}
                </AlertDialogDescription>

                {/* 타이틀 - 동적 */}
                <AlertDialogTitle className='text-base font-semibold'>
                    {title}
                </AlertDialogTitle>

                {/* 버튼 영역 */}
                <AlertDialogFooter className='mt-2 flex gap-2'>
                    <AlertDialogCancel>아니오</AlertDialogCancel>
                    <AlertDialogAction className='px-6' onClick={onConfirm}>
                        예
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default ConfirmModal;
