import ProgressBar from '@/entities/contract/ui/charts/ProgressBar';
import DetailOverviewItem from '@/entities/contract/ui/DetailOverviewItem';
import { getDday } from '@/shared/lib/date';
import { useGetContractDetailOverview } from '../api/ContractAPI';

const formatDate = (dateArr: number[]): string => {
    const [year, month, day] = dateArr;
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
};

const OverviewErrorFallback = () => {
    return (
        <section className='flex min-h-[200px] items-center justify-center'>
            <div className='text-line-900 text-center'>
                <p className='text-lg font-medium'>
                    데이터를 불러오는데 실패했습니다.
                </p>
                <p className='mt-1 text-sm'>잠시 후 다시 시도해주세요.</p>
            </div>
        </section>
    );
};

const ContractDetailOverview = ({ formId }: { formId: string }) => {
    const { data, isError } = useGetContractDetailOverview(formId);

    if (isError) {
        return <OverviewErrorFallback />;
    }

    if (!data) {
        return null;
    }

    const {
        userIsCreditor,
        contracteeName,
        overdueCount,
        overdueLimit,
        overdueAmount,
        nextRepaymentDate,
        earlyRepaymentCount,
        totalEarlyRepaymentCharge,
        repaymentAmount,
        remainingPrincipal,
    } = data;
    const loanAmount = repaymentAmount + remainingPrincipal;
    const nextDateString = formatDate(nextRepaymentDate);

    const summaryData = [
        {
            tag: '연체',
            mainText: `${overdueCount}회/${overdueLimit}회`,
            subText: `${overdueAmount.toLocaleString()}원 미납`,
        },
        {
            tag: '진행',
            mainText: `${getDday(nextDateString)}`,
            subText: `다음 상환 일정 ${nextDateString}`,
        },
        {
            tag: '중도',
            mainText: `${earlyRepaymentCount}회`,
            subText: `총 납부 수수료 ${totalEarlyRepaymentCharge.toLocaleString()}원`,
        },
    ];

    return (
        <section>
            <div className='border-line-200 flex items-center justify-between border-b pb-3'>
                <div className='text-lg font-medium'>
                    <span className='text-primary-500 text-xl'>
                        {contracteeName}
                    </span>
                    <span>님과의 차용증 계약</span>
                </div>
                <span className='text-purple-600'>
                    {userIsCreditor ? '받을 계약' : '갚을 계약'}
                </span>
            </div>

            <div className='border-line-200 flex flex-col gap-8 border-b py-4'>
                <div className='flex flex-col gap-2'>
                    {summaryData.map(({ tag, mainText, subText }, idx) => (
                        <DetailOverviewItem
                            key={idx}
                            tagText={tag}
                            mainText={mainText}
                            subText={subText}
                        />
                    ))}
                </div>
                <ProgressBar
                    amount={repaymentAmount}
                    goal={loanAmount}
                    color={userIsCreditor ? 'primary' : 'subPink'}
                />
            </div>
        </section>
    );
};

export default ContractDetailOverview;
