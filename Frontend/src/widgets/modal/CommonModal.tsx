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
    confirmText: string;
    onClick: () => void;
}

const CommonModal = ({
    triggerChildren,
    children,
    confirmText,
    onClick,
}: CommonModalProps) => {
    return (
        <Dialog>
            <DialogTrigger>{triggerChildren}</DialogTrigger>
            <DialogContent className='flex flex-col items-center gap-4 bg-white'>
                <div className='flex justify-end w-full'>
                    <DialogClose>
                        <Icons name='close' />
                    </DialogClose>
                </div>
                <DialogTitle></DialogTitle>
                <DialogDescription></DialogDescription>
                {children}
                <DialogFooter className='w-full'>
                    <Button
                        variant={'primary'}
                        children={confirmText}
                        className='rounded-lg'
                        onClick={onClick}
                    />
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default CommonModal;
