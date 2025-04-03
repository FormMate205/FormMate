import { ContractCard } from '@/entities/contract/model/types';
import ContractCardItem from '@/entities/contract/ui/ContractCardItem';

const ContractList = ({ contracts }: { contracts: ContractCard[] }) => {
    return (
        <div className='flex flex-col gap-4'>
            {contracts.map((contract) => (
                <ContractCardItem key={contract.formId} contract={contract} />
            ))}
        </div>
    );
};

export default ContractList;
