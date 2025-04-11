import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface NavigationGuardModalProps {
    title: string;
    description: string;
    isOpen: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

const NavigationGuardModal = ({
    title,
    description,
    isOpen,
    onConfirm,
    onCancel,
}: NavigationGuardModalProps) => {
    return (
        <AlertDialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
            <AlertDialogContent>
                <AlertDialogHeader className='items-center'>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {description}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={onCancel}>
                        취소
                    </AlertDialogCancel>
                    <AlertDialogAction onClick={onConfirm}>
                        확인
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default NavigationGuardModal;
