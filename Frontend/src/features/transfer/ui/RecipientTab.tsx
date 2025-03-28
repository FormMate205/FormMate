import { useNavigate } from 'react-router-dom';
import { TabListItem } from '@/entities/transfer/model/types';
import TabList from '@/entities/transfer/ui/TabList';

const recentRecipients: TabListItem[] = [
    { id: '1', title: '강지은', subString: '010-1234-5678' },
];

const contractRecipients: TabListItem[] = [
    { id: '2', title: '강지은', subString: '010-1234-5678' },
    { id: '3', title: '강지은', subString: '010-1234-5678' },
];

const RecipientTab = () => {
    const navigate = useNavigate();
    return (
        <>
            <div className='flex flex-col gap-14'>
                <TabList
                    title='최근 보낸 내역'
                    items={recentRecipients}
                    onClickItem={() => navigate('amount')}
                />
                <TabList
                    title='나와 계약을 맺은 사람'
                    items={contractRecipients}
                    onClickItem={() => navigate('amount')}
                />
            </div>
        </>
    );
};

export default RecipientTab;
