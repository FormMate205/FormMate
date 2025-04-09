import { useGetContractDetail } from '@/entities/contract/api/ContractAPI';
import { Icons } from '@/shared';
import { CommonModal } from '@/widgets';
import { FormUpdateRequest } from '../../../entities/formDraft/model/types';
import FormUpdateContent from './FormUpdateContent';

interface FormUpdateModal {
    formId: string;
}

const FormUpdateModal = ({ formId }: FormUpdateModal) => {
    const { data } = useGetContractDetail(formId);
    const contract = data as unknown as FormUpdateRequest;

    return (
        <CommonModal
            triggerChildren={
                <Icons name='zoom-in' className='fill-primary-500' width={18} />
            }
            children={<FormUpdateContent formId={formId} contract={contract} />}
        />
    );
};

export default FormUpdateModal;
