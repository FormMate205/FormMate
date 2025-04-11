import { ReactNode } from 'react';
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
    return (
        <Dialog>
            <DialogTrigger asChild>{triggerChildren}</DialogTrigger>
            <DialogContent className='scrollbar-none flex max-h-[80vh] flex-col items-center overflow-y-auto bg-white'>
                <div className='flex justify-end w-full'>
                    <DialogClose>
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
                            onClick={onClick}
                        />
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default CommonModal;
