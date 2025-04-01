import { Suspense } from 'react';
import { useGetContractDetail } from '@/entities/contract/api/ContractAPI';
import ContractDocument from '@/entities/contract/ui/ContractDocument';
import { Icons } from '@/shared';
import { useContractPdfExport } from '@/shared/model/useContractPdfExport';
import ListLoading from '@/shared/ui/ListLoading';
import { CommonModal } from '@/widgets';

interface FormModalProps {
    formId: string;
}

const FormModal = ({ formId }: FormModalProps) => {
    const { data } = useGetContractDetail(formId);
    const { exportContract } = useContractPdfExport();

    return (
        <CommonModal
            triggerChildren={
                <div
                    className='flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-xs'
                    aria-label='계약서 보기'
                >
                    <Icons name='docs' className='fill-line-700' width={20} />
                </div>
            }
            children={
                <Suspense fallback={<ListLoading />}>
                    <ContractDocument contract={data!} />
                </Suspense>
            }
            confirmText='pdf 다운로드'
            onClick={() => exportContract(data!)}
        />
    );
};

export default FormModal;
