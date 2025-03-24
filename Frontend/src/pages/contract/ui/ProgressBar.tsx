import { Progress } from '@/components/ui/progress';

interface ProgressBarProps {
    amount: number;
    goal: number;
}

const ProgressBar = ({ amount, goal }: ProgressBarProps) => {
    const value = (amount / goal) * 100;

    return (
        <div className='flex flex-col gap-3'>
            <div className='flex flex-col gap-4'>
                {/* 말풍선 */}
                <div
                    className='flex -translate-x-1/2 flex-col items-center'
                    style={{ marginLeft: `${value}%` }}
                >
                    <div className='relative flex justify-center'>
                        <div className='bg-subPink-600 w-fit rounded-sm px-4 py-2 text-white'>
                            {amount.toLocaleString()}원
                        </div>
                        <div className='border-subPink-600 absolute -bottom-2 left-1/2 h-0 w-0 -translate-x-1/2 border-t-8 border-r-8 border-l-8 border-r-transparent border-l-transparent'></div>
                    </div>
                </div>
                <Progress value={value} />
            </div>
            <div className='text-line-500 flex justify-end'>
                원금 {goal.toLocaleString()}원
            </div>
        </div>
    );
};

export default ProgressBar;
