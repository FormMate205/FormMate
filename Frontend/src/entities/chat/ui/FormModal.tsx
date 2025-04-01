import { Contract } from '@/entities/contract/model/types';
import ContractDocument from '@/entities/contract/ui/ContractDocument';
import { Icons } from '@/shared';
import { CommonModal } from '@/widgets';

interface FormModalProps {
    formId: string;
}

const FormModal = ({ formId }: FormModalProps) => {
    const contract = {} as Contract;

    const handleDownload = () => {
        console.log(formId);
        return;
    };

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
            children={<ContractDocument contract={contract} />}
            confirmText='pdf 다운로드'
            onClick={handleDownload}
        />
    );
};

export default FormModal;
