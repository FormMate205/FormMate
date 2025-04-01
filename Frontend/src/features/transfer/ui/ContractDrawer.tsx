import { Drawer, DrawerContent, DrawerHeader } from '@/components/ui/drawer';
import ContractDrawerItem from '@/entities/transfer/ui/ContractDrawerItem';
import { ContractItem } from '../model/types';

interface ContractDrawerProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    partnerName: string;
    contracts: ContractItem[];
    onSelectContract?: (contract: ContractItem) => void;
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
                <DrawerHeader></DrawerHeader>
                <span className='text-lg font-medium'>
                    {partnerName}과 맺은 계약
                </span>
                <div className='flex flex-col gap-4 pt-2 pb-4'>
                    {contracts.length === 0 ? (
                        <p className='text-sm text-gray-500'>
                            계약이 없습니다.
                        </p>
                    ) : (
                        contracts.map((c, idx) => (
                            <ContractDrawerItem
                                key={idx}
                                contract={c}
                                onClick={onSelectContract}
                            />
                        ))
                    )}
                </div>
            </DrawerContent>
        </Drawer>
    );
};

export default ContractDrawer;
