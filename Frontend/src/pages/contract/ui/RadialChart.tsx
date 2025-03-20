import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from 'recharts';

import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from '../../../components/ui/chart';
const chartData = [{ month: 'january', desktop: 20, mobile: 80 }];

const chartConfig = {
    desktop: {
        label: 'Desktop',
        color: '#FDE6F3',
    },
    mobile: {
        label: 'Mobile',
        color: '#E51D74',
    },
} satisfies ChartConfig;

const RadialChart = () => {
    return (
        <ChartContainer config={chartConfig} className='aspect-square w-full'>
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
                                            className='fill-foreground text-2xl font-bold'
                                        >
                                            {chartData[0].mobile}%
                                        </tspan>
                                    </text>
                                );
                            }
                        }}
                    />
                </PolarRadiusAxis>
                <RadialBar
                    dataKey='desktop'
                    stackId='a'
                    cornerRadius={5}
                    fill='var(--color-desktop)'
                    className='stroke-transparent stroke-2'
                />
                <RadialBar
                    dataKey='mobile'
                    fill='var(--color-mobile)'
                    stackId='a'
                    cornerRadius={5}
                    className='stroke-transparent stroke-2'
                />
            </RadialBarChart>
        </ChartContainer>
    );
};

export default RadialChart;
