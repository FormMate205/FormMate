import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogFooter,
    DialogTrigger,
    DialogClose,
} from '@/components/ui/dialog';

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
                <div className='flex w-full justify-end'>
                    <DialogClose>닫기</DialogClose>
                </div>
                <DialogTitle></DialogTitle>
                {children}
                <DialogFooter>
                    <Button
                        variant={'primary'}
                        children={confirmText}
                        className='w-[250px] rounded-lg'
                        onClick={onClick}
                    />
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default CommonModal;
