import { ReactNode } from 'react';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';

interface CommonPopoverProps {
    triggerChildren: ReactNode;
    children: ReactNode;
}

const CommonPopover = ({ triggerChildren, children }: CommonPopoverProps) => {
    return (
        <Popover>
            <PopoverTrigger asChild>{triggerChildren}</PopoverTrigger>
            <PopoverContent className='border-line-300 bg-white'>
                {children}
            </PopoverContent>
        </Popover>
    );
};

export default CommonPopover;
