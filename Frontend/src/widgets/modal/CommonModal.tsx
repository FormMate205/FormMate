import { ReactNode, useRef } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogFooter,
    DialogTrigger,
    DialogClose,
    DialogDescription,
} from '@/components/ui/dialog';
import { Icons } from '@/shared';

interface CommonModalProps {
    triggerChildren: ReactNode;
    children: ReactNode;
    confirmText?: string;
    onClick?: () => void;
}

const CommonModal = ({
    triggerChildren,
    children,
    confirmText,
    onClick,
}: CommonModalProps) => {
    const closeButtonRef = useRef<HTMLButtonElement>(null);

    const handleConfirm = () => {
        if (onClick) {
            onClick();
        }

        // 모달 닫기
        if (closeButtonRef.current) {
            closeButtonRef.current.click();
        }
    };
    return (
        <Dialog>
            <DialogTrigger asChild>{triggerChildren}</DialogTrigger>
            <DialogContent className='flex flex-col items-center bg-white'>
                <div className='flex w-full justify-end'>
                    <DialogClose ref={closeButtonRef}>
                        <Icons name='close' />
                    </DialogClose>
                </div>
                <DialogTitle></DialogTitle>
                <DialogDescription></DialogDescription>
                {children}
                <DialogFooter className='w-full'>
                    {confirmText && (
                        <Button
                            variant={'primary'}
                            children={confirmText}
                            className='rounded-lg'
                            onClick={handleConfirm}
                        />
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default CommonModal;
