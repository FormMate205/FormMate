import ProgressBar from '@/entities/contract/ui/charts/ProgressBar';
import DetailOverviewItem from '@/entities/contract/ui/DetailOverviewItem';
import { getDday } from '@/shared/lib/date'; // formatDate도 함께 사용 추천

// dummy
const data = {
    overdueCount: 1,
    overdueLimit: 3,
    overdueAmount: 110000,
    nextRepaymentDate: '2025-03-27',
    earlyRepaymentCount: 2,
    totalEarlyRepaymentCharge: 3567,
    remainingPrincipal: 5200000,
};

const {
    overdueCount,
    overdueLimit,
    overdueAmount,
    nextRepaymentDate,
    earlyRepaymentCount,
    totalEarlyRepaymentCharge,
    remainingPrincipal,
} = data;

// API 수정 필요) 특정 계약 상대와의 계약 조회 -> 이름, 채무/채권, 원금 데이터 필요
const contractData = {
    contractor: '강지은',
    userIsCreditor: true,
    loanAmount: 10000000,
};

const { contractor, userIsCreditor, loanAmount } = contractData;

const ContractDetailOverview = () => {
    const summaryData = [
        {
            tag: '연체',
            mainText: `${overdueCount}회/${overdueLimit}회`,
            subText: `${overdueAmount.toLocaleString()}원 미납`,
            withIcon: true,
        },
        {
            tag: '진행',
            mainText: `${getDday(nextRepaymentDate)}`,
            subText: `다음 상환 일정 ${nextRepaymentDate}`,
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
                        {contractor}
                    </span>
                    <span>님과의 차용증 계약</span>
                </div>
                <span className='text-purple-600'>
                    {userIsCreditor ? '받을 계약' : '갚을 계약'}
                </span>
            </div>

            <div className='border-line-200 flex flex-col gap-8 border-b py-4'>
                <div className='flex flex-col gap-2'>
                    {summaryData.map(
                        ({ tag, mainText, subText, withIcon }, idx) => (
                            <DetailOverviewItem
                                key={idx}
                                tagText={tag}
                                mainText={mainText}
                                subText={subText}
                                withIcon={withIcon}
                            />
                        ),
                    )}
                </div>
                <ProgressBar amount={remainingPrincipal} goal={loanAmount} />
            </div>
        </section>
    );
};

export default ContractDetailOverview;
