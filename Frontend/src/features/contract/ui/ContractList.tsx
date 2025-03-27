import { ContractCardProps } from '@/entities/contract/model/types';
import ContractCard from '../../../entities/contract/ui/ContractCard';

const ContractList = ({ contracts }: { contracts: ContractCardProps[] }) => {
    return (
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
            {contracts.map((contract) => (
                <ContractCard key={contract.id} {...contract} />
            ))}
        </div>
    );
};

export default ContractList;
