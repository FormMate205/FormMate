import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import InterestInfoTab from './InterestInfoTab';
import PaymentHistoryTab from './PaymentHistoryTab';
import SummaryTab from './SummaryTab';

const ContractDetailTabs = () => {
    return (
        <section className='bg-white'>
            <Tabs defaultValue='contract'>
                <TabsList>
                    <TabsTrigger value='contract'>차용증</TabsTrigger>
                    <TabsTrigger value='history'>납부 내역</TabsTrigger>
                    <TabsTrigger value='interest'>이자 조회</TabsTrigger>
                </TabsList>
                <TabsContent value='contract'>
                    <SummaryTab />
                </TabsContent>
                <TabsContent value='history'>
                    <PaymentHistoryTab />
                </TabsContent>
                <TabsContent value='interest'>
                    <InterestInfoTab />
                </TabsContent>
            </Tabs>
        </section>
    );
};

export default ContractDetailTabs;
