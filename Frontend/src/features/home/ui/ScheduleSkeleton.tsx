import { Skeleton } from '@/components/ui/skeleton';

const ScheduleSkeleton = () => {
    return (
        <div className='bg-white'>
            <Skeleton className='bg-line-50 h-20 w-full' />
        </div>
    );
};

export default ScheduleSkeleton;
