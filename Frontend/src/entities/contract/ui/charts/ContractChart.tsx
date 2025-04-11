import { Tooltip as ChartTooltip, TooltipProps } from 'recharts';
import { PolarAngleAxis, RadialBar, RadialBarChart } from 'recharts';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { ChartConfig, ChartContainer } from '@/components/ui/chart';
import { useGetContractAmountChart } from '../../api/ContractAPI';

const chartConfig = {
    received: {
        label: '받은 금액',
        color: '#4C6AFF',
    },
    paid: {
        label: '보낸 금액',
        color: '#E51D74',
    },
} satisfies ChartConfig;

const ContractChart = () => {
    const { data, isLoading, isError } = useGetContractAmountChart();

    if (isLoading) return <div>로딩 중...</div>;
    if (isError || !data) return <div>데이터를 불러오는 데 실패했습니다.</div>;

    const {
        expectedTotalRepayment,
        paidAmount,
        expectedTotalReceived,
        receivedAmount,
    } = data;

    const sentPercent =
        expectedTotalRepayment > 0
            ? Math.round((paidAmount / expectedTotalRepayment) * 100)
            : 0;
    const receivedPercent =
        expectedTotalReceived > 0
            ? Math.round((receivedAmount / expectedTotalReceived) * 100)
            : 0;

    const chartData = [
        {
            name: chartConfig.received.label,
            received: receivedPercent,
            fill: chartConfig.received.color,
        },
        {
            name: chartConfig.paid.label,
            paid: sentPercent,
            fill: chartConfig.paid.color,
        },
    ];

    return (
        <div className='flex flex-col gap-2'>
            <span className='text-lg font-medium'>체결된 계약</span>
            <Card className='flex flex-col bg-white'>
                <CardHeader className='items-center'>
                    <CardTitle />
                </CardHeader>
                <CardContent className='mt-[-3rem] mb-[-2rem]'>
                    <ChartContainer
                        config={chartConfig}
                        className='mx-auto aspect-square max-h-[250px]'
                    >
                        <RadialBarChart
                            innerRadius={50}
                            outerRadius={110}
                            startAngle={90}
                            endAngle={-270}
                            data={[]} // 개별 data 사용 중이므로 무의미
                        >
                            <PolarAngleAxis
                                type='number'
                                domain={[0, 100]}
                                tick={false}
                            />
                            <ChartTooltip
                                cursor={false}
                                content={({
                                    active,
                                    payload,
                                }: TooltipProps<number, string>) => {
                                    if (active && payload && payload.length) {
                                        return (
                                            <div className='border-line-300 rounded-lg border bg-white p-3 shadow-sm'>
                                                <div className='flex flex-col gap-2'>
                                                    {chartData.map(
                                                        (item, index) => (
                                                            <div
                                                                key={index}
                                                                className='flex items-center gap-2'
                                                            >
                                                                <div
                                                                    className='h-2.5 w-2.5 rounded-xl'
                                                                    style={{
                                                                        backgroundColor:
                                                                            item.fill,
                                                                    }}
                                                                />
                                                                <div className='flex flex-col'>
                                                                    <p className='font-medium text-gray-900'>
                                                                        {
                                                                            item.name
                                                                        }
                                                                    </p>
                                                                    <p className='text-sm text-gray-500'>
                                                                        진행률:{' '}
                                                                        {
                                                                            item[
                                                                                item.name ===
                                                                                chartConfig
                                                                                    .received
                                                                                    .label
                                                                                    ? 'received'
                                                                                    : 'paid'
                                                                            ]
                                                                        }
                                                                        %
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        ),
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    }
                                    return null;
                                }}
                            />

                            {/* 받은 금액 */}
                            <RadialBar
                                dataKey='received'
                                data={[chartData[0]]}
                                fill={chartData[0].fill}
                                background
                                cornerRadius={10}
                            />

                            {/* 보낸 금액 */}
                            <RadialBar
                                dataKey='paid'
                                data={[chartData[1]]}
                                fill={chartData[1].fill}
                                background
                                cornerRadius={10}
                            />
                        </RadialBarChart>
                    </ChartContainer>
                </CardContent>
                <CardFooter className='text-line-700 mt-4 flex-col items-start gap-2 text-sm font-medium'>
                    <div className='flex items-center gap-2 leading-none'>
                        <div
                            className='h-2.5 w-2.5 rounded-xl'
                            style={{
                                backgroundColor: chartConfig.received.color,
                            }}
                        />
                        <div>
                            받은 금액{' '}
                            <span className='text-line-900'>
                                {receivedAmount.toLocaleString()}원
                            </span>
                        </div>
                    </div>
                    <div className='flex items-center gap-2 leading-none'>
                        <div
                            className='h-2.5 w-2.5 rounded-xl'
                            style={{ backgroundColor: chartConfig.paid.color }}
                        />
                        <div>
                            보낸 금액{' '}
                            <span className='text-line-900'>
                                {paidAmount.toLocaleString()}원
                            </span>
                        </div>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
};

export default ContractChart;
