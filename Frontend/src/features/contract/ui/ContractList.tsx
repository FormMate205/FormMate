import { ContractCardProps } from '@/entities/contract/model/types';
import ContractCard from '../../../entities/contract/ui/ContractCard';

const ContractList = ({ contracts }: { contracts: ContractCardProps[] }) => {
    return (
        <div className='flex flex-col gap-4'>
            {contracts.map((contract) => (
                <ContractCard key={contract.id} {...contract} />
            ))}
        </div>
    );
};

export default ContractList;
