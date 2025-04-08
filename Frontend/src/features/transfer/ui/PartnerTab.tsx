import { debounce } from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import {
    useGetContractByPartnerList,
    useGetMyPartnerList,
} from '@/entities/transfer/api/TransferAPI';
import { TabListItem } from '@/entities/transfer/model/types';
import TabList from '@/entities/transfer/ui/TabList';
import ContractDrawer from './ContractDrawer';

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
    const selectedPartnerId = selectedPartner?.id;

    const { data: contracts } = useGetContractByPartnerList(
        selectedPartnerId || '',
    );

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
        // toDo: store에 값 저장 (partnerName, formId, partnerId)
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
                {partners.length === 0 ? (
                    <div className='py-8 text-center text-gray-400'>
                        “{debouncedSearch}”에 대한 결과가 없습니다.
                    </div>
                ) : (
                    <TabList
                        title='나와 계약을 맺은 사람'
                        items={tabItems}
                        onClickItem={handleClickContractPartner}
                        lastItemRef={lastItemRef}
                    />
                )}
            </div>

            <ContractDrawer
                open={drawerOpen}
                onOpenChange={setDrawerOpen}
                partnerName={selectedPartner?.title || ''}
                contracts={contracts ?? []}
                onSelectContract={handleSelectContract}
            />
        </>
    );
};

export default PartnerTab;
