import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ContractTab from './ContractTab';
import RecipientTab from './RecipientTab';

const SelectTabs = () => {
    return (
        <Tabs defaultValue='recipient'>
            <TabsList>
                <TabsTrigger value='recipient'>사람</TabsTrigger>
                <TabsTrigger value='contract'>계약</TabsTrigger>
            </TabsList>
            <TabsContent value='recipient' className='flex flex-col gap-6 px-0'>
                <RecipientTab />
            </TabsContent>
            <TabsContent value='contract' className='flex flex-col gap-6 px-0'>
                <ContractTab />
            </TabsContent>
        </Tabs>
    );
};

export default SelectTabs;
