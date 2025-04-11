import { useEffect, useRef, useState } from 'react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
    color?: 'primary' | 'subPink';
    amount: number;
    goal: number;
}

const ProgressBar = ({ amount, goal, color = 'subPink' }: ProgressBarProps) => {
    const value = Math.min((amount / goal) * 100, 100);

    const balloonRef = useRef<HTMLDivElement | null>(null);
    const progressRef = useRef<HTMLDivElement | null>(null);
    const [balloonWidth, setBalloonWidth] = useState(0);
    const [progressWidth, setProgressWidth] = useState(0);

    useEffect(() => {
        if (balloonRef.current && progressRef.current) {
            setBalloonWidth(balloonRef.current.offsetWidth);
            setProgressWidth(progressRef.current.offsetWidth);
        }
    }, [amount]);

    // 진행률에 따른 말풍선 위치 계산
    let marginLeft = `${value}%`;
    let isLeftEdge = false;
    let isRightEdge = false;

    if (progressWidth > 0 && balloonWidth > 0) {
        const balloonHalfWidth = balloonWidth / 2;
        const progressPosition = (value / 100) * progressWidth;

        // 왼쪽 끝 체크
        if (progressPosition - balloonHalfWidth < 0) {
            marginLeft = `${(balloonHalfWidth / progressWidth) * 100}%`;
            isLeftEdge = true;
        }
        // 오른쪽 끝 체크
        else if (progressPosition + balloonHalfWidth > progressWidth) {
            marginLeft = `${100 - (balloonHalfWidth / progressWidth) * 100}%`;
            isRightEdge = true;
        }
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
                        <div
                            className={cn(
                                'rounded-sm px-4 py-2 whitespace-nowrap text-white',
                                color === 'primary'
                                    ? 'bg-primary-500'
                                    : 'bg-subPink-600',
                            )}
                        >
                            {amount.toLocaleString()}원
                        </div>

                        <div
                            className={cn(
                                'absolute -bottom-2 left-1/2 h-0 w-0 -translate-x-1/2',
                                'border-x-[8px] border-t-[8px]',
                                'border-x-transparent',
                                color === 'primary'
                                    ? 'border-t-primary-500'
                                    : 'border-t-subPink-600',
                                {
                                    'left-3 translate-x-0': isLeftEdge,
                                    'right-4 translate-x-0': isRightEdge,
                                    'left-1/2 -translate-x-1/2':
                                        !isLeftEdge && !isRightEdge,
                                },
                            )}
                        />
                    </div>
                </div>

                <div ref={progressRef}>
                    <Progress
                        value={value}
                        color={color === 'primary' ? 'blue' : 'pink'}
                    />
                </div>
            </div>

            <div className='text-line-500 flex justify-end'>
                총 상환 예정액 {goal.toLocaleString()}원
            </div>
        </div>
    );
};

export default ProgressBar;
