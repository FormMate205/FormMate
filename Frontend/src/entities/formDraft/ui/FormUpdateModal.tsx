import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useGetContractDetail } from '@/entities/contract/api/ContractAPI';
import { Icons } from '@/shared';
import { CommonModal } from '@/widgets';
import FormUpdateContent from './FormUpdateContent';

interface FormUpdateModal {
    formId: string;
}

const FormUpdateModal = ({ formId }: FormUpdateModal) => {
    const { data } = useGetContractDetail(formId);

    const [update, setUpdate] = useState(false);

    // 수정모드 유무 변경
    const onChangeUpdate = () => {
        setUpdate(!update);
    };

    const handleUpdateContract = () => {
        console.log('수정된 계약서 저장');
    };

    return (
        <CommonModal
            triggerChildren={
                <Icons name='zoom-in' className='fill-primary-500' width={18} />
            }
            children={
                <div className='flex max-h-[500px] w-full flex-col py-4'>
                    <div className='flex w-full justify-between py-2'>
                        <p className='text-lg font-semibold'>
                            금전 차용 계약서
                        </p>
                        <Button
                            variant={update ? 'choiceFill' : 'choiceEmpty'}
                            children={update ? '저장' : '수정'}
                            onClick={onChangeUpdate}
                        />
                    </div>
                    <br />

                    <FormUpdateContent
                        contract={data!}
                        isEditMode={update}
                        onContractChange={handleUpdateContract}
                    />
                </div>
            }
            confirmText=''
            onClick={() => {}}
        />
    );
};

export default FormUpdateModal;
