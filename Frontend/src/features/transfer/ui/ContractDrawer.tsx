import { Description } from '@radix-ui/react-dialog';
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
} from '@/components/ui/drawer';
import { ContractByPartnerItem } from '@/entities/transfer/model/types';
import ContractDrawerItem from '@/entities/transfer/ui/ContractDrawerItem';

interface ContractDrawerProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    partnerName: string;
    contracts: ContractByPartnerItem[];
    onSelectContract?: (contract: ContractByPartnerItem) => void;
}

const ContractDrawer = ({
    open,
    onOpenChange,
    partnerName,
    contracts,
    onSelectContract,
}: ContractDrawerProps) => {
    return (
        <Drawer open={open} onOpenChange={onOpenChange}>
            <DrawerContent className='px-4'>
                <DrawerHeader>
                    <DrawerTitle></DrawerTitle>
                </DrawerHeader>
                <span className='mt-[-12px] text-lg font-medium'>
                    {partnerName}님과 맺은 계약
                </span>
                <Description></Description>
                <div className='flex flex-col gap-4 pt-2 pb-4'>
                    {contracts.length === 0 ? (
                        <p className='text-sm text-gray-500'>
                            계약이 없습니다.
                        </p>
                    ) : (
                        contracts.map((contract, idx) => (
                            <ContractDrawerItem
                                key={idx}
                                contract={contract}
                                onClick={() => onSelectContract?.(contract)}
                            />
                        ))
                    )}
                </div>
            </DrawerContent>
        </Drawer>
    );
};

export default ContractDrawer;
