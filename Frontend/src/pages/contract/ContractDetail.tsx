import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import ContractDetailOverview from '@/features/contract/ui/ContractDetailOverview';
import EarlyTerminateAlert from '@/features/contract/ui/EarlyTerminateAlert';
import ContractTabs from '@/features/contract/ui/tabs/ContractTabs';
import { Header } from '@/widgets';

const ContractDetail = () => {
    const navigate = useNavigate();
    const { formId } = useParams();
    return (
        <div className='flex h-screen flex-col'>
            <div className='bg-line-50 flex flex-col px-4 py-2'>
                <Header title='계약 상세' />
                <div className='flex h-full flex-col gap-2'>
                    <ContractDetailOverview />
                    {/* ContractActionButtons */}
                    <div className='flex flex-col items-center gap-3 py-2'>
                        <div className='flex w-full justify-center gap-4'>
                            <Button
                                variant={'choiceEmpty'}
                                onClick={() => navigate(`/chat/${formId}`)}
                            >
                                채팅하기
                            </Button>
                            <Button
                                variant={'choiceFill'}
                                onClick={() => navigate('/transfer')}
                            >
                                이체하기
                            </Button>
                        </div>
                        <div className='text-line-700'>
                            <EarlyTerminateAlert
                                onConfirm={() => navigate(`/chat/${formId}`)}
                            />
                        </div>
                    </div>
                </div>
            </div>
            {/* ContractDetailTabs */}
            <ContractTabs />
        </div>
    );
};

export default ContractDetail;
