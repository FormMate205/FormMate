import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Icons } from '@/shared';

interface NoticeModalProps {
    isOpen: boolean;
    title: string;
    description: string;
    onClose: () => void;
}

const NoticeModal = ({
    isOpen,
    title,
    description,
    onClose,
}: NoticeModalProps) => {
    return (
        <AlertDialog open={isOpen} onOpenChange={onClose}>
            <AlertDialogContent>
                <AlertDialogHeader className='flex flex-col items-center'>
                    <Icons
                        name='exclamation'
                        className='text-primary-500 h-6 w-6'
                    />
                    <AlertDialogTitle className='text-center'>
                        {title}
                    </AlertDialogTitle>
                    <AlertDialogDescription className='text-center whitespace-pre-line'>
                        {description}
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <Button variant='primary' className='w-full' onClick={onClose}>
                    확인
                </Button>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default NoticeModal;
