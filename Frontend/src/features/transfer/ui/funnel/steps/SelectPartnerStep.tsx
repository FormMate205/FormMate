import { debounce } from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import { Input } from '@/components/ui/input';
import {
    useGetContractByPartnerList,
    useGetMyPartnerList,
} from '@/entities/transfer/api/TransferAPI';
import {
    ContractByPartnerItem,
    TabListItem,
} from '@/entities/transfer/model/types';
import TabList from '@/entities/transfer/ui/TabList';
import ContractDrawer from '../../ContractDrawer';

type SelectPartnerProps = {
    dispatch: (payload: {
        partnerId: string;
        partnerName: string;
        formId: string;
        repaymentAmount: number;
    }) => void;
};

const SelectPartnerStep = ({ dispatch }: SelectPartnerProps) => {
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
    // Debounce 검색
    const debounceSearch = useMemo(() => {
        return debounce((value: string) => {
            setDebouncedSearch(value);
        }, 300);
    }, []);

    useEffect(() => {
        debounceSearch(searchValue);
        return () => debounceSearch.cancel();
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

    const handleSelectContract = (contract: ContractByPartnerItem) => {
        if (!selectedPartner) return;
        // useFunnel
        dispatch({
            partnerId: selectedPartner.id,
            partnerName: selectedPartner.title,
            formId: contract.formId,
            repaymentAmount: contract.nextRepaymentAmount,
        });
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

export default SelectPartnerStep;
