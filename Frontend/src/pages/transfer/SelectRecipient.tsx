import SelectTabs from '@/features/transfer/ui/SelectTabs';
import { Header } from '@/widgets';

const SelectRecipient = () => {
    return (
        <div className='flex flex-col gap-4 px-4 py-2'>
            <Header title='송금하기' />
            <section className='flex flex-col gap-4'>
                <div className='text-2xl font-semibold'>
                    어디로 돈을 보낼까요?
                </div>
                <SelectTabs />
            </section>
        </div>
    );
};

export default SelectRecipient;
