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
                <div className='flex gap-4'>
                    <p className='text-primary-500 text-xl font-bold'>
                        {currentTerm.id}/{specialTermsInfo.length}
                    </p>
                    <p className='text-xl font-bold'>{currentTerm.title}</p>
                </div>

                <p className='text-line-700'>{currentTerm.content}</p>
            </div>

            <div className='my-2 flex w-full gap-2'>
                <Button
                    variant='choiceFill'
                    children='네'
                    onClick={() => onSelect(currentTerm.id, true)}
                />
                <Button
                    variant='choiceEmpty'
                    children='아니오'
                    onClick={() => onSelect(currentTerm.id, false)}
                />
            </div>
        </div>
    );
};

export default SpecialTermsSelector;
