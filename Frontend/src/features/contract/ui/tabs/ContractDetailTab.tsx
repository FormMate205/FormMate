import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useGetContractDetail } from '@/entities/contract/api/ContractAPI';
import ContractDocument from '@/entities/contract/ui/ContractDocument';
import { useContractPdfExport } from '@/shared/model/useContractPdfExport';

const ContractDetailTab = () => {
    const { formId } = useParams();
    const { data, isLoading, isError } = useGetContractDetail(formId!);
    const { isPdfExporting, exportContract } = useContractPdfExport();

    if (isLoading) return <div>로딩 중...</div>;
    if (isError || !data) return <div>계약 정보를 불러올 수 없습니다.</div>;

    const handleExportPdf = () => {
        exportContract(data);
    };

    return (
        <div className='flex flex-col gap-4'>
            <div className='flex justify-end'>
                <Button variant='choiceEmpty' onClick={handleExportPdf}>
                    PDF로 내보내기
                </Button>
            </div>

            <ContractDocument
                contract={data}
                isPdfMode={isPdfExporting}
                key={isPdfExporting ? 'pdf' : 'default'}
            />
        </div>
    );
};

export default ContractDetailTab;
