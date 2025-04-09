import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SelectPartnerStep from './funnel/steps/SelectPartnerStep';

export type SelectDispatchPayload = {
    partnerId: string;
    partnerName: string;
    formId: string;
    repaymentAmount: number;
};

export type SelectTargetEvent = {
    사람선택완료: SelectDispatchPayload;
    계약선택완료: SelectDispatchPayload;
};

export type SelectDispatchType = (
    type: '사람선택완료' | '계약선택완료',
    payload?: SelectDispatchPayload,
) => void;

type Props = {
    dispatch: SelectDispatchType;
};

const SelectTabs = ({ dispatch }: Props) => {
    return (
        <Tabs defaultValue='recipient'>
            <TabsList>
                <TabsTrigger value='recipient'>사람</TabsTrigger>
                <TabsTrigger value='contract'>계약</TabsTrigger>
            </TabsList>

            <TabsContent value='recipient'>
                <SelectPartnerStep
                    dispatch={(payload) => dispatch('사람선택완료', payload)}
                />
            </TabsContent>
            <TabsContent value='contract'>
                <SelectPartnerStep
                    dispatch={(payload) => dispatch('계약선택완료', payload)}
                />
            </TabsContent>
        </Tabs>
    );
};

export default SelectTabs;
