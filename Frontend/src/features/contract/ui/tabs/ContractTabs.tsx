import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ContractDetailTab from './ContractDetailTab';
import InterestInfoTab from './InterestInfoTab';
import PaymentHistoryTab from './PaymentHistoryTab';

const ContractTabs = () => {
    return (
        <section className='flex h-full flex-col bg-white'>
            <Tabs defaultValue='contract'>
                <TabsList>
                    <TabsTrigger value='contract'>차용증</TabsTrigger>
                    <TabsTrigger value='history'>납부 내역</TabsTrigger>
                    <TabsTrigger value='interest'>납부 요약</TabsTrigger>
                </TabsList>
                {/* 차용증 */}
                <TabsContent
                    value='contract'
                    className='bg-line-50 h-full px-4'
                >
                    <ContractDetailTab />
                </TabsContent>
                {/* 납부 내역 */}
                <TabsContent value='history'>
                    <PaymentHistoryTab />
                </TabsContent>
                {/* 납부 요약 */}
                <TabsContent value='interest' className='bg-line-50 h-full'>
                    <InterestInfoTab />
                </TabsContent>
            </Tabs>
        </section>
    );
};

export default ContractTabs;
