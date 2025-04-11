import { useParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ContractDetailTab from './ContractDetailTab';
import PaymentHistoryTab from './PaymentHistoryTab';
import PaymentSummaryTab from './PaymentSummaryTab';

const ContractTabs = () => {
    const { formId } = useParams();

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
                    <ContractDetailTab formId={formId!} />
                </TabsContent>
                {/* 납부 내역 */}
                <TabsContent value='history'>
                    <PaymentHistoryTab formId={formId!} />
                </TabsContent>
                {/* 납부 요약 */}
                <TabsContent value='interest' className='bg-line-50 h-full'>
                    <PaymentSummaryTab formId={formId!} />
                </TabsContent>
            </Tabs>
        </section>
    );
};

export default ContractTabs;
