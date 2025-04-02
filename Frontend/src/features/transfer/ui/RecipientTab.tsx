// src/pages/RecipientTab.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ContractItem, TabListItem } from '@/entities/transfer/model/types';
import TabList from '@/entities/transfer/ui/TabList';
import ContractDrawer from './ContractDrawer';

const recentRecipients: TabListItem[] = [
    { id: '1', title: '강지은', subString: '010-1234-5678' },
];

const contractRecipients: TabListItem[] = [
    { id: '2', title: '강지은', subString: '010-1234-5678' },
    { id: '3', title: '강지은', subString: '010-1234-5678' },
];

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

const RecipientTab = () => {
    const navigate = useNavigate();
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedPartner, setSelectedPartner] = useState<TabListItem | null>(
        null,
    );

    const handleClickContractPartner = (item: TabListItem) => {
        setSelectedPartner(item);
        setDrawerOpen(true);
    };

    const handleSelectContract = () => {
        // store에 값 저장
        navigate('amount');
    };

    return (
        <>
            <div className='flex flex-col gap-14'>
                <TabList
                    title='최근 보낸 내역'
                    items={recentRecipients}
                    onClickItem={handleClickContractPartner}
                />
                <TabList
                    title='나와 계약을 맺은 사람'
                    items={contractRecipients}
                    onClickItem={handleClickContractPartner}
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

export default RecipientTab;
