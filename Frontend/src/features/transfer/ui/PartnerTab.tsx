import { debounce } from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { useGetMyPartnerList } from '@/entities/transfer/api/TransferAPI';
import { ContractItem, TabListItem } from '@/entities/transfer/model/types';
import TabList from '@/entities/transfer/ui/TabList';
import ContractDrawer from './ContractDrawer';

const dummyContracts: ContractItem[] = [
    {
        formId: '1',
        userIsCreditor: true,
        nextRepaymentAmount: 10000,
        nextRepaymentDate: '2025-03-27',
        contractDuration: '2024.01.01 ~ 2025.10.10',
    },
    {
        formId: '2',
        userIsCreditor: false,
        nextRepaymentAmount: 30000,
        nextRepaymentDate: '2025-04-15',
        contractDuration: '2023.03.01 ~ 2025.12.31',
    },
];

const PartnerTab = () => {
    const navigate = useNavigate();
    const [searchValue, setSearchValue] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedPartner, setSelectedPartner] = useState<TabListItem | null>(
        null,
    );

    const { partners, lastItemRef } = useGetMyPartnerList({
        input: debouncedSearch,
        pageable: {
            page: '0',
            size: '10',
        },
    });
    const debounceSearch = useMemo(() => {
        return debounce((value: string) => {
            setDebouncedSearch(value);
        }, 300);
    }, [setDebouncedSearch]);

    useEffect(() => {
        debounceSearch(searchValue);
        return () => {
            debounceSearch.cancel();
        };
    }, [searchValue, debounceSearch]);

    const tabItems: TabListItem[] = partners.map((partner) => ({
        id: partner.userId,
        title: partner.userName,
        subString: partner.phoneNumber,
    }));

    const handleClickContractPartner = (item: TabListItem) => {
        setSelectedPartner(item);
        setDrawerOpen(true);
    };

    const handleSelectContract = () => {
        // toDo: store에 값 저장
        navigate('amount');
    };

    return (
        <>
            <Input
                variant='search'
                placeholder='이름 또는 전화번호 입력'
                className='my-4'
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
            />
            <div className='flex flex-col gap-14'>
                <TabList
                    title='나와 계약을 맺은 사람'
                    items={tabItems}
                    onClickItem={handleClickContractPartner}
                    lastItemRef={lastItemRef}
                />
            </div>

            <ContractDrawer
                open={drawerOpen}
                onOpenChange={setDrawerOpen}
                partnerName={selectedPartner?.title || ''}
                contracts={dummyContracts}
                onSelectContract={handleSelectContract}
            />
        </>
    );
};

export default PartnerTab;
