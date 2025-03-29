import { Skeleton } from '@/components/ui/skeleton';

const ListLoading = () => {
    return (
        <div className='flex flex-col gap-4'>
            <div className='flex flex-col gap-2'>
                <Skeleton className='h-4 w-[100px]' />
                <Skeleton className='h-4 w-[250px]' />
            </div>
            <div className='flex flex-col gap-2'>
                <Skeleton className='h-4 w-[100px]' />
                <Skeleton className='h-4 w-[250px]' />
            </div>
            <div className='flex flex-col gap-2'>
                <Skeleton className='h-4 w-[100px]' />
                <Skeleton className='h-4 w-[250px]' />
            </div>
        </div>
    );
};

export default ListLoading;
