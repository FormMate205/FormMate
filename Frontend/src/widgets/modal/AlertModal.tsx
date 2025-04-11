import { AlertDialogAction } from '@radix-ui/react-alert-dialog';
import { ReactNode } from 'react';
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Icons } from '@/shared';

interface AlertModalProps {
    buttonType: 'default' | 'primary' | 'choiceEmpty' | 'choiceFill';
    buttonName: string;
    title: string;
    children: ReactNode;
}

const AlertModal = ({
    buttonType,
    buttonName,
    title,
    children,
}: AlertModalProps) => {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant={buttonType} children={buttonName} />
            </AlertDialogTrigger>

            <AlertDialogContent className='flex flex-col items-center bg-white'>
                <AlertDialogHeader className='flex flex-col items-center'>
                    <Icons
                        name='exclamation'
                        color='fill-primary-500'
                        size={40}
                    />

                    <AlertDialogDescription>{children}</AlertDialogDescription>
                    <AlertDialogTitle className='text-line-900 text-lg font-medium'>
                        {title}
                    </AlertDialogTitle>
                </AlertDialogHeader>

                <AlertDialogFooter className='flex flex-row gap-4'>
                    <AlertDialogCancel>아니오</AlertDialogCancel>
                    <AlertDialogAction>예</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default AlertModal;
