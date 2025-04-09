import { debounce } from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import { Input } from '@/components/ui/input';
import { useGetRepaymentContractList } from '@/entities/transfer/api/TransferAPI';
import { repaymentContract } from '@/entities/transfer/model/types';
import TabList from '@/entities/transfer/ui/TabList';
import { formatDateString, getDday } from '@/shared/lib/date';
import { SelectDispatchPayload } from '../../SelectTabs';

type Props = {
    onSelect: (payload: SelectDispatchPayload) => void;
};

const SelectContractStep = ({ onSelect }: Props) => {
    const [searchValue, setSearchValue] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');

    const debounceSearch = useMemo(() => {
        return debounce((value: string) => {
            setDebouncedSearch(value);
        }, 300);
    }, []);

    useEffect(() => {
        debounceSearch(searchValue);
        return () => debounceSearch.cancel();
    }, [searchValue, debounceSearch]);

    const { data: contracts = [] } =
        useGetRepaymentContractList(debouncedSearch);

    const tabItems = contracts.map((contract) => ({
        id: contract.formId,
        title: contract.partnerName,
        subString: `${formatDateString(contract.nextRepaymentDate)} ${getDday(contract.nextRepaymentDate)}`,
    }));

    const handleSelectContract = (contract: repaymentContract) => {
        onSelect({
            partnerId: contract.partnerId,
            partnerName: contract.partnerName,
            formId: contract.formId,
            repaymentAmount: 0,
        });
    };

    return (
        <>
            <Input
                variant='search'
                placeholder='이름으로 검색'
                className='my-4'
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
            />
            <div className='flex flex-col gap-14'>
                {contracts.length === 0 ? (
                    <div className='py-8 text-center text-gray-400'>
                        “{debouncedSearch}”에 대한 결과가 없습니다.
                    </div>
                ) : (
                    <TabList
                        title='나의 계약'
                        items={tabItems}
                        onClickItem={(item) => {
                            const selected = contracts.find(
                                (c) => c.formId === item.id,
                            );
                            if (selected) handleSelectContract(selected);
                        }}
                    />
                )}
            </div>
        </>
    );
};

export default SelectContractStep;
