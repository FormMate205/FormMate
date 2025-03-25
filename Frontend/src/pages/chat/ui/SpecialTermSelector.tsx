import { Button } from '@/components/ui/button';
import { specialTermsInfo } from '@/features/chatBot/utils/chatBotQuestions';

interface SpecialTermsSelectorProps {
    onComplete: (value: string[]) => void;
}

const SpecialTermsSelector = ({ onComplete }: SpecialTermsSelectorProps) => {
    return (
        <div className='my-4 flex flex-col gap-2'>
            {specialTermsInfo.map((term) => (
                <div>
                    <div className='border-primary-200 bg-primary-50 flex flex-col gap-4 border p-5'>
                        <div className='flex gap-4'>
                            <p className='text-primary-500 text-xl font-bold'>
                                {term.id}/{specialTermsInfo.length}
                            </p>
                            <p className='text-xl font-bold'>{term.title}</p>
                        </div>

                        <p className='text-line-700'>{term.content}</p>
                    </div>

                    <div className='flex w-full gap-2'>
                        <Button
                            variant='choiceFill'
                            value='네네'
                            onClick={() => onComplete}
                        />
                        <Button variant='choiceEmpty' value='아니오' />
                    </div>
                </div>
            ))}
        </div>
    );
};

export default SpecialTermsSelector;
