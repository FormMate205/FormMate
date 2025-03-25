import { RadialBar, RadialBarChart } from 'recharts';

import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { ChartConfig, ChartContainer } from '@/components/ui/chart';
const chartData = [
    { visitors: 173, fill: 'var(--color-edge)' },
    { visitors: 90, fill: 'var(--color-other)' },
];

const chartConfig = {
    visitors: {
        label: 'Visitors',
    },
    edge: {
        label: 'Edge',
        color: '#E51D74',
    },
    other: {
        label: '갚을 계약',
        color: '#4C6AFF',
    },
} satisfies ChartConfig;

const ContractChart = () => {
    return (
        <Card className='flex flex-col bg-white'>
            <CardHeader className='items-center'>
                <CardTitle></CardTitle>
            </CardHeader>
            <CardContent className='my-[-2rem]'>
                <ChartContainer
                    config={chartConfig}
                    className='mx-auto aspect-square max-h-[250px]'
                >
                    <RadialBarChart
                        data={chartData}
                        startAngle={-90}
                        endAngle={380}
                        innerRadius={60}
                        outerRadius={100}
                    >
                        <RadialBar
                            dataKey='visitors'
                            background
                            cornerRadius={10}
                        ></RadialBar>
                    </RadialBarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className='text-line-900 mt-4 flex-col items-start gap-1 text-sm font-medium'>
                <div className='flex items-center gap-2 leading-none'>
                    <div className='bg-primary-500 h-2.5 w-2.5 rounded-xl'></div>
                    <div>보낸 금액</div>
                </div>
                <div className='flex items-center gap-2 leading-none'>
                    <div className='bg-subPink-600 h-2.5 w-2.5 rounded-xl'></div>
                    <div>받은 금액</div>
                </div>
            </CardFooter>
        </Card>
    );
};

export default ContractChart;
