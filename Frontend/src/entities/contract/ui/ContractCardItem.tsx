import { Link } from 'react-router-dom';
import { Progress } from '@/components/ui/progress';
import { TagItem } from '@/shared';
import { TagColor } from '@/shared/model/types';
import { statusToLabel } from '../model/filterMapping';
import { ContractCard, ContractStatus } from '../model/types';

interface StatusStyle {
    color: TagColor;
    description?: string;
}

const statusMap: Record<Exclude<ContractStatus, 'ALL'>, StatusStyle> = {
    BEFORE_APPROVAL: {
        color: 'subPurple',
        description: '상대방의 승인을 기다리는 중이에요!',
    },
    AFTER_APPROVAL: {
        color: 'subPurple',
        description: '상대방의 승인을 기다리는 중이에요!',
    },
    IN_PROGRESS: { color: 'primary' },
    OVERDUE: { color: 'subPink' },
    COMPLETED: {
        color: 'line',
        description: '계약이 완료되었어요.',
    },
};

interface ContractCardItemProps {
    contract: ContractCard;
}

const ContractCardItem = ({ contract }: ContractCardItemProps) => {
    const {
        formId,
        status,
        userIsCreditor,
        contracteeName,
        maturityDate,
        nextRepaymentAmount,
        totalRepaymentAmount,
        totalAmountDue,
    } = contract;

    const statusInfo = statusMap[status as Exclude<ContractStatus, 'ALL'>];
    if (!statusInfo) return null;

    const label = statusToLabel(status);
    const { color, description } = statusInfo;
    const isSender = userIsCreditor;
    const isPending =
        status === 'BEFORE_APPROVAL' || status === 'AFTER_APPROVAL';

    const progressPercent = totalAmountDue
        ? Math.floor((totalRepaymentAmount / totalAmountDue) * 100)
        : 0;

    return (
        <Link to={`/contracts/${formId}`} className='block cursor-pointer'>
            <div className='border-line-200 flex h-42 flex-col gap-3 rounded-xl border p-4 shadow-sm'>
                <div className='flex items-center gap-2'>
                    <span className='text-lg font-medium'>
                        {contracteeName}
                    </span>
                    <TagItem text={label} color={color} />
                </div>

                {isPending ? (
                    <div className='text-line-900 flex h-full flex-col justify-center gap-3 text-sm'>
                        <div className='text-lg font-medium'>{description}</div>
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
                                            isSender
                                                ? 'text-subPink-600'
                                                : 'text-primary-500'
                                        }
                                    >
                                        {userIsCreditor ? '보낼 ' : '받을 '}
                                    </span>
                                    금액
                                </div>
                                <span
                                    className={`${
                                        isSender
                                            ? 'text-subPink-600'
                                            : 'text-primary-500'
                                    } font-medium`}
                                >
                                    {nextRepaymentAmount.toLocaleString()} 원
                                </span>
                            </div>
                            <div className='flex justify-between'>
                                <span>계약 만기</span>
                                <span>{`${maturityDate[0]}.${maturityDate[1]}.${maturityDate[2]}`}</span>
                            </div>
                        </div>

                        <div className='text-line-700 flex flex-col gap-1 text-sm'>
                            <Progress
                                value={progressPercent}
                                color={!isSender ? 'blue' : undefined}
                            />
                            <div className='flex justify-between'>
                                <span>
                                    {totalRepaymentAmount.toLocaleString()}원
                                </span>
                                <span>{totalAmountDue.toLocaleString()}원</span>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </Link>
    );
};

export default ContractCardItem;
