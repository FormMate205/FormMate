import { useEffect, useRef, useState } from 'react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
    color?: string;
    amount: number;
    goal: number;
}

const ProgressBar = ({ amount, goal }: ProgressBarProps) => {
    const value = Math.min((amount / goal) * 100, 100);

    const balloonRef = useRef<HTMLDivElement | null>(null);
    const [marginOffset, setMarginOffset] = useState(24); // 초기 보정값

    useEffect(() => {
        if (balloonRef.current) {
            const width = balloonRef.current.offsetWidth;
            setMarginOffset(width / 2); // 말풍선 너비의 절반을 보정값으로
        }
    }, [amount]);

    let marginLeft = `${value}%`;

    if (value <= 5) {
        marginLeft = `calc(${value}% + ${marginOffset}px)`;
    } else if (value >= 95) {
        marginLeft = `calc(${value}% - ${marginOffset}px)`;
    }

    return (
        <div className='flex flex-1 flex-col gap-3'>
            <div className='flex flex-col gap-4'>
                {/* 말풍선 */}
                <div
                    className='flex -translate-x-1/2 flex-col items-center'
                    style={{ marginLeft }}
                >
                    <div
                        ref={balloonRef}
                        className='relative flex w-fit justify-center'
                    >
                        <div className='bg-subPink-600 rounded-sm px-4 py-2 whitespace-nowrap text-white'>
                            {amount.toLocaleString()}원
                        </div>

                        <div
                            className={cn(
                                'border-subPink-600 absolute -bottom-2 left-1/2 h-0 w-0 -translate-x-1/2 border-t-8 border-r-8 border-l-8 border-r-transparent border-l-transparent',
                                {
                                    'left-3 translate-x-0': value <= 5, // 왼쪽
                                    'right-3 translate-x-0': value >= 95, // 오른쪽
                                    'left-1/2 -translate-x-1/2':
                                        value > 5 && value < 95, // 중앙
                                },
                            )}
                        ></div>
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
