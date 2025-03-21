import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from 'recharts';

import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from '../../../components/ui/chart';

const total = 1000000;
const current = 850000;

const chartData = [
    { Data: 'ProgressData', left: total - current, current: current },
];
const percent = Math.round((current / total) * 100);

const chartConfig = {
    left: {
        label: 'Left',
        color: '#FDE6F3',
    },

    current: {
        label: 'Current',
        color: '#E51D74',
    },
} satisfies ChartConfig;

const RadialChart = () => {
    return (
        <ChartContainer config={chartConfig} className='w-ful mb-[-20%]'>
            <RadialBarChart
                data={chartData}
                endAngle={180}
                innerRadius={80}
                outerRadius={130}
            >
                <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                />
                <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                    <Label
                        content={({ viewBox }) => {
                            if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                                return (
                                    <text
                                        x={viewBox.cx}
                                        y={viewBox.cy}
                                        textAnchor='middle'
                                    >
                                        <tspan
                                            x={viewBox.cx}
                                            y={(viewBox.cy || 0) - 8}
                                            className='text-2xl font-bold'
                                        >
                                            {percent}%
                                        </tspan>
                                    </text>
                                );
                            }
                        }}
                    />
                </PolarRadiusAxis>
                <RadialBar
                    dataKey='left'
                    stackId='a'
                    cornerRadius={5}
                    fill='var(--color-left)'
                    className='stroke-transparent stroke-2'
                />
                <RadialBar
                    dataKey='current'
                    fill='var(--color-current)'
                    stackId='a'
                    cornerRadius={5}
                    className='stroke-transparent stroke-2'
                />
            </RadialBarChart>
        </ChartContainer>
    );
};

export default RadialChart;
