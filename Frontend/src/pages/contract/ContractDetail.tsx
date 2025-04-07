import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import ContractDetailOverview from '@/entities/contract/ui/ContractDetailOverview';
import { usePostTerminate } from '@/features/contract/api/terminateAPI';
import EarlyTerminateAlert from '@/features/contract/ui/EarlyTerminateAlert';
import ContractTabs from '@/features/contract/ui/tabs/ContractTabs';
import { Header } from '@/widgets';

const ContractDetail = () => {
    const navigate = useNavigate();
    const { formId } = useParams();

    const { mutate: terminate, data } = usePostTerminate(formId!);

    const handleEarlyTerminate = () => {
        // 계약 조기 종료 요청
        terminate();

        // 채팅으로 이동
        navigate(`/chat/${formId}`, {
            state: { isFin: false, requestedById: data?.requestedById },
        });
    };

    return (
        <div className='flex h-screen flex-col'>
            <div className='bg-line-50 flex flex-col px-4 py-2'>
                <Header title='계약 상세' />
                <div className='flex h-full flex-col gap-2'>
                    <ContractDetailOverview formId={formId!} />
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
                                onConfirm={handleEarlyTerminate}
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
