import TransferFunnel from '@/features/transfer/ui/funnel/TransferFunnel';

const Transfer = () => {
    return (
        <div className='flex h-full flex-col gap-4 px-4 py-2'>
            <section className='flex h-full flex-col gap-4'>
                <TransferFunnel />
            </section>
        </div>
    );
};

export default Transfer;
