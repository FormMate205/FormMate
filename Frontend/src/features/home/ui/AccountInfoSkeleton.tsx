import { Skeleton } from '@/components/ui/skeleton';

const AccountInfoSkeleton = () => {
    return (
        <div className='max-w-2xl gap-4'>
            <div className='flex flex-1 flex-col items-start gap-3 rounded-xl bg-white p-4 shadow-sm'>
                <Skeleton className='bg-line-50 h-4 w-30' />
                <Skeleton className='bg-line-50 h-6 w-full' />
            </div>
        </div>
    );
};

export default AccountInfoSkeleton;
