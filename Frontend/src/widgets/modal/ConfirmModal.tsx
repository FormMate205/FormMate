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
    onClose?: () => void;
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
            <AlertDialogContent className='flex flex-col items-center text-center border-0 shadow-xs'>
                {/* 상단 ! 아이콘 */}
                <div className='mx-auto mb-2'>
                    <Icons
                        name='exclamation'
                        className='w-6 h-6 fill-primary-500'
                    />
                </div>

                {/* 설명 문구 - 동적 */}
                <AlertDialogDescription className='text-sm text-gray-500 whitespace-pre-wrap'>
                    {description}
                </AlertDialogDescription>

                {/* 타이틀 - 동적 */}
                <AlertDialogTitle className='text-base font-semibold'>
                    {title}
                </AlertDialogTitle>

                {/* 버튼 영역 */}
                <AlertDialogFooter className='flex gap-2 mt-2'>
                    {onClose && <AlertDialogCancel>아니오</AlertDialogCancel>}
                    <AlertDialogAction className='px-6' onClick={onConfirm}>
                        예
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default ConfirmModal;
