import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from '@/components/ui/select';
import { ContractStatus } from '@/features/contract/model/types';

const ContractSelect = ({
    value,
    onChange,
}: {
    value: ContractStatus | '전체';
    onChange: (val: ContractStatus | '전체') => void;
}) => {
    return (
        <Select value={value} onValueChange={onChange}>
            <SelectTrigger className='w-24'>
                <SelectValue placeholder='전체' />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value='전체'>전체</SelectItem>
                <SelectItem value='대기'>대기</SelectItem>
                <SelectItem value='진행'>진행</SelectItem>
                <SelectItem value='연체'>연체</SelectItem>
                <SelectItem value='완료'>완료</SelectItem>
            </SelectContent>
        </Select>
    );
};

export default ContractSelect;
