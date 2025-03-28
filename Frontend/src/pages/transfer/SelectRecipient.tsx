import { Input } from '@/components/ui/input';
import SelectTabs from '@/features/transfer/ui/SelectTabs';
import { Header } from '@/widgets';

const SelectRecipient = () => {
    return (
        <div className='flex flex-col gap-4 px-4 py-2'>
            <Header title='송금하기' />
            <section className='flex flex-col gap-6'>
                <div className='flex flex-col gap-4'>
                    <div className='text-2xl font-semibold'>
                        어디로 돈을 보낼까요?
                    </div>
                    <Input
                        variant='search'
                        placeholder='이름 또는 전화번호 입력'
                    />
                </div>
                <SelectTabs />
            </section>
        </div>
    );
};

export default SelectRecipient;
