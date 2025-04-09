import { Button } from '@/components/ui/button';
import { specialTermsInfo } from '../config/formDraftQuestions';

interface SpecialTermsSelectorProps {
    currentTermIndex: number;
    onSelect: (value: string, selected: boolean) => void;
}

const SpecialTermsSelector = ({
    currentTermIndex,
    onSelect,
}: SpecialTermsSelectorProps) => {
    const currentTerm = specialTermsInfo[currentTermIndex];

    if (!currentTerm) return null;

    return (
        <div className='my-4 flex flex-col gap-2'>
            <div className='border-primary-200 bg-primary-50 flex flex-col gap-4 rounded-lg border p-5'>
                <p className='text-primary-500 text-xl font-bold'>
                    {currentTerm.specialTermIndex}/{specialTermsInfo.length}
                </p>
                <p className='text-line-700'>{currentTerm.specialTermDetail}</p>
            </div>

            <div className='my-2 flex w-full gap-2'>
                <Button
                    variant='choiceFill'
                    children='네'
                    onClick={() => onSelect(currentTerm.specialTermIndex, true)}
                />
                <Button
                    variant='choiceEmpty'
                    children='아니오'
                    onClick={() =>
                        onSelect(currentTerm.specialTermIndex, false)
                    }
                />
            </div>
        </div>
    );
};

export default SpecialTermsSelector;
