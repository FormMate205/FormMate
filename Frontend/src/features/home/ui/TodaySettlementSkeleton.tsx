import { Skeleton } from '@/components/ui/skeleton';

const TodaySettlementSkeleton = () => {
    return (
        <div className='flex max-w-2xl gap-4'>
            <div className='flex flex-1 flex-col items-center gap-3 rounded-xl bg-white p-4 shadow-sm'>
                <Skeleton className='bg-line-50 h-4 w-24' />
                <Skeleton className='bg-line-50 h-6 w-full' />
            </div>
            <div className='flex flex-1 flex-col items-center gap-3 rounded-xl bg-white p-4 shadow-sm'>
                <Skeleton className='bg-line-50 h-4 w-24' />
                <Skeleton className='bg-line-50 h-6 w-full' />
            </div>
        </div>
    );
};

export default TodaySettlementSkeleton;
