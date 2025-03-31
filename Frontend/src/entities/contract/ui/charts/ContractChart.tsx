import { RadialBar, RadialBarChart, ResponsiveContainer } from 'recharts';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { ChartConfig, ChartContainer } from '@/components/ui/chart';

const chartConfig = {
    edge: {
        label: '받은 금액',
        color: '#E51D74',
    },
    other: {
        label: '보낸 금액',
        color: '#4C6AFF',
    },
} satisfies ChartConfig;

const ContractChart = () => {
    // dummy
    const data = {
        totalSend: 1000000,
        sent: 400000,
        totalReceive: 1500000,
        received: 900000,
    };
    const { totalSend, sent, totalReceive, received } = data;

    // 진행률 계산
    const sentPercent =
        totalSend > 0 ? Math.round((sent / totalSend) * 100) : 0;
    const receivedPercent =
        totalReceive > 0 ? Math.round((received / totalReceive) * 100) : 0;

    const chartData = [
        {
            name: '받은 금액',
            visitors: receivedPercent,
            fill: chartConfig.edge.color,
        },
        {
            name: '보낸 금액',
            visitors: sentPercent,
            fill: chartConfig.other.color,
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
                        <ResponsiveContainer width='100%' height='100%'>
                            <RadialBarChart
                                data={chartData}
                                startAngle={-90}
                                endAngle={360}
                                innerRadius={60}
                                outerRadius={100}
                            >
                                <RadialBar
                                    dataKey='visitors'
                                    background
                                    cornerRadius={10}
                                />
                            </RadialBarChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                </CardContent>
                <CardFooter className='text-line-700 mt-4 flex-col items-start gap-2 text-sm font-medium'>
                    <div className='flex items-center gap-2 leading-none'>
                        <div
                            className='h-2.5 w-2.5 rounded-xl'
                            style={{ backgroundColor: chartConfig.other.color }}
                        />
                        <div>
                            보낸 금액{' '}
                            <span className='text-line-900'>
                                {sent.toLocaleString()}원
                            </span>
                        </div>
                    </div>
                    <div className='flex items-center gap-2 leading-none'>
                        <div
                            className='h-2.5 w-2.5 rounded-xl'
                            style={{ backgroundColor: chartConfig.edge.color }}
                        />
                        <div>
                            받은 금액{' '}
                            <span className='text-line-900'>
                                {received.toLocaleString()}원
                            </span>
                        </div>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
};

export default ContractChart;
