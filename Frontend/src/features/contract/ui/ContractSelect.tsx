import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from '@/components/ui/select';
import { CONTRACT_FILTER_LABELS } from '@/entities/contract/model/filterMapping';
import { ContractStatusLabel } from '@/entities/contract/model/types';

interface ContractSelectProps {
    value: ContractStatusLabel;
    onChange: (val: ContractStatusLabel) => void;
}

const ContractSelect = ({ value, onChange }: ContractSelectProps) => {
    return (
        <Select value={value} onValueChange={onChange}>
            <SelectTrigger className='w-24'>
                <SelectValue placeholder='전체' />
            </SelectTrigger>
            <SelectContent>
                {CONTRACT_FILTER_LABELS.map((item) => (
                    <SelectItem key={item} value={item}>
                        {item}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
};

export default ContractSelect;
