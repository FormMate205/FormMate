import { Link } from 'react-router-dom';
import { Progress } from '@/components/ui/progress';
import { TagItem } from '@/shared';
import { ContractStatus, ContractCardProps, TagColor } from '../model/types';

interface StatusStyle {
    color: TagColor;
    description?: string;
}

const statusMap: Record<ContractStatus, StatusStyle> = {
    대기: {
        color: 'purple',
        description: '상대방의 승인을 기다리는 중이에요!',
    },
    진행: {
        color: 'default',
    },
    연체: {
        color: 'red',
    },
    완료: {
        color: 'gray',
        description: '계약이 완료되었어요.',
    },
};

const ContractCard = ({
    id,
    name,
    status,
    endDate,
    contractType,
    currentMonthAmount,
    currentAmount,
    totalAmount,
}: ContractCardProps) => {
    const statusInfo = statusMap[status];
    return (
        <Link to={`/contract/${id}`} className='block cursor-pointer'>
            <div className='border-line-200 flex h-42 flex-col gap-3 rounded-xl border p-4 shadow-sm'>
                <div className='flex items-center gap-2'>
                    <span className='text-lg font-medium'>{name}</span>
                    <TagItem text={status} color={statusInfo.color} />
                </div>

                {status === '대기' ? (
                    <div className='text-line-900 flex h-full flex-col justify-center gap-3 text-sm'>
                        <div className='text-lg font-medium'>
                            상대방의 승인을 기다리는 중이에요!
                        </div>
                        <div className='text-line-500'>
                            승인이 완료되면 계약이 시작되고, <br />
                            상세 정보가 표시됩니다.
                        </div>
                    </div>
                ) : (
                    <>
                        <div className='text-line-900 flex flex-col'>
                            <div className='flex justify-between'>
                                <div>
                                    이번달{' '}
                                    <span
                                        className={
                                            contractType === 'send'
                                                ? 'text-subPink-600'
                                                : 'text-primary-500'
                                        }
                                    >
                                        {contractType === 'send'
                                            ? '보낼 '
                                            : '받을 '}
                                    </span>
                                    금액
                                </div>
                                <span
                                    className={`${contractType === 'send' ? 'text-subPink-600' : 'text-primary-500'} font-medium`}
                                >
                                    {currentMonthAmount} 원
                                </span>
                            </div>
                            <div className='flex justify-between'>
                                <span>계약 만기</span>
                                <span>{endDate}</span>
                            </div>
                        </div>

                        <div className='text-line-700 flex flex-col gap-1 text-sm'>
                            <Progress
                                value={40}
                                color={
                                    contractType === 'receive'
                                        ? 'blue'
                                        : undefined
                                }
                            />
                            <div className='flex justify-between'>
                                <span>{currentAmount}</span>
                                <span>{totalAmount}</span>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </Link>
    );
};

export default ContractCard;
