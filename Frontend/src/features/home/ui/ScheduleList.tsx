import { Button } from '@/components/ui/button';
import type { ScheduleListProps } from '@/entities/home/model/types';

export const ScheduleList = ({ contracts }: ScheduleListProps) => {
    if (contracts.length === 0) {
        return (
            <p className='text-line-400 my-4 text-center text-sm'>
                예정된 정산 내역이 없습니다.
            </p>
        );
    }

    return (
        <>
            {contracts.map((item, idx) => (
                <div
                    key={idx}
                    className='mb-3 flex items-center justify-between'
                >
                    <div className='flex gap-5 p-2'>
                        <div
                            className={`y-10 ${
                                item.userIsCreditor
                                    ? 'bg-primary-200'
                                    : 'bg-subPink-200'
                            } w-1`}
                        ></div>
                        <div className='flex-col items-center'>
                            <p className='pb-1 font-semibold'>
                                {item.contracteeName}
                            </p>
                            <p className='text-line-400 text-sm'>
                                {item.userIsCreditor ? '+' : '-'}{' '}
                                {item.repaymentAmount.toLocaleString()}원
                            </p>
                        </div>
                    </div>
                    {!item.userIsCreditor && (
                        <Button variant='choiceFill'>이체하기</Button>
                    )}
                </div>
            ))}
        </>
    );
};
