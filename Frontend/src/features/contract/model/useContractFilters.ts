import { ChangeEvent, useMemo, useState } from 'react';
import { labelToStatus } from '@/entities/contract/model/filterMapping';
import { ContractStatusLabel } from '@/entities/contract/model/types';
import { useGetContractList } from '../api/ContractAPI';

export const useContractFilters = () => {
    const [filterLabel, setFilterLabel] = useState<ContractStatusLabel>('전체');
    const [search, setSearch] = useState('');

    const onChangeSearch = (e: ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    };

    const selectedStatuses = labelToStatus(filterLabel);
    const {
        data: contracts = [],
        isLoading,
        isError,
    } = useGetContractList(selectedStatuses);

    const filteredContracts = useMemo(() => {
        return contracts.filter((contract) => {
            if (!contract.contracteeName) return true; // 이름 없으면 필터링 안 함
            return contract.contracteeName
                .toLowerCase()
                .includes(search.toLowerCase());
        });
    }, [contracts, search]);

    return {
        filterLabel, // '전체', '진행' 등의 레이블
        setFilterLabel,
        search,
        setSearch,
        onChangeSearch,
        filteredContracts,
        isLoading,
        isError,
    };
};
