import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SelectContractStep from './funnel/steps/SelectContractStep';
import SelectPartnerStep from './funnel/steps/SelectPartnerStep';

export type SelectDispatchPayload = {
    partnerId: string;
    partnerName: string;
    formId: string;
    repaymentAmount: number;
};

export type SelectDispatchType = (
    type: '사람선택완료' | '계약선택완료',
    payload: SelectDispatchPayload,
) => void;

type SelectTabsProps = {
    onSelectPerson: (payload: SelectDispatchPayload) => void;
    onSelectContract: (payload: SelectDispatchPayload) => void;
};

const SelectTabs = ({ onSelectPerson, onSelectContract }: SelectTabsProps) => {
    return (
        <Tabs defaultValue='recipient'>
            <TabsList>
                <TabsTrigger value='recipient'>사람</TabsTrigger>
                <TabsTrigger value='contract'>계약</TabsTrigger>
            </TabsList>
            <TabsContent value='recipient' className='px-0'>
                <SelectPartnerStep onSelect={onSelectPerson} />
            </TabsContent>
            <TabsContent value='contract' className='px-0'>
                <SelectContractStep onSelect={onSelectContract} />
            </TabsContent>
        </Tabs>
    );
};

export default SelectTabs;
