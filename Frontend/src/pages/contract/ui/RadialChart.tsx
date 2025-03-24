import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from 'recharts';

import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from '../../../components/ui/chart';

interface RadialChartProps {
    color?: 'pink' | 'blue';
}

const total = 1000000;
const current = 850000;

const chartData = [
    { Data: 'ProgressData', left: total - current, current: current },
];

const percent = Math.round((current / total) * 100);

// Tailwind 색상 클래스 매핑 함수
const getChartConfig = (color: 'pink' | 'blue') => {
    if (color === 'blue') {
        return {
            left: {
                label: 'Left',
                color: '#DDEAFF',
            },
            current: {
                label: 'Current',
                color: '#4C6AFF',
            },
        };
    }
    return {
        left: {
            label: 'Left',
            color: '#FDE6F3',
        },
        current: {
            label: 'Current',
            color: '#E51D74',
        },
    };
};

const RadialChart = ({ color = 'pink' }: RadialChartProps) => {
    const fillClasses = getChartConfig(color);

    return (
        <ChartContainer config={fillClasses} className='mb-[-20%] w-full'>
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
                    fill={fillClasses.left.color}
                />
                <RadialBar
                    dataKey='current'
                    stackId='a'
                    cornerRadius={5}
                    fill={fillClasses.current.color}
                />
            </RadialBarChart>
        </ChartContainer>
    );
};

export default RadialChart;
