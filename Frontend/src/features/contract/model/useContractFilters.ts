import { useState } from 'react';
import {
    ContractCardProps,
    ContractStatus,
} from '../../../entities/contract/types';

const dummyContracts: ContractCardProps[] = [
    {
        id: '1',
        name: '강지은',
        status: '진행',
        contractType: 'send',
        currentMonthAmount: 150000,
        currentAmount: 450000,
        totalAmount: 1500000,
        endDate: '2025.04.23',
    },
    {
        id: '2',
        name: '이동욱',
        status: '대기',
    },
    {
        id: '3',
        name: '박상학',
        status: '연체',
        contractType: 'receive',
        currentMonthAmount: 100000,
        currentAmount: 100000,
        totalAmount: 500000,
        endDate: '2025.02.15',
    },
    {
        id: '4',
        name: '차윤영',
        status: '완료',
        contractType: 'receive',
        currentMonthAmount: 0,
        currentAmount: 1000000,
        totalAmount: 1000000,
        endDate: '2025.01.01',
    },
];

export const useContractFilters = () => {
    const [filter, setFilter] = useState<ContractStatus | '전체'>('전체');

    const filteredContracts = dummyContracts.filter((contract) =>
        filter === '전체' ? true : contract.status === filter,
    );

    return {
        filter,
        setFilter,
        filteredContracts,
    };
};
