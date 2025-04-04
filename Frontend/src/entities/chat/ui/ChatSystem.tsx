import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import FormModal from './FormModal';

interface ChatSystemProps {
    formId: string;
    children: ReactNode;
    type: string;
}

const ChatSystem = ({ formId, children, type }: ChatSystemProps) => {
    return (
        <div className='border-primary-200 flex w-[260px] flex-col gap-6 rounded-2xl border bg-white px-3 py-4'>
            <div className='flex w-full items-center justify-between'>
                <p className='text-lg font-semibold'>
                    {type == 'CONTRACT_SHARED'
                        ? '금전 차용 계약서'
                        : '서명 대기'}
                </p>
                {type == 'CONTRACT_SHARED' && (
                    <FormModal formId={formId} isDraft={true} />
                )}
            </div>

            {children}

            <div>
                <Button
                    variant={'default'}
                    children='서명하기'
                    className='w-full'
                />
            </div>
        </div>
    );
};

export default ChatSystem;
