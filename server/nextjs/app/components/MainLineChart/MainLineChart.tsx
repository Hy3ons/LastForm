'use client';

import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { IChartData, ILineChartProps } from '@/services/ILineChart';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    registerables,
    ChartData,
    TooltipItem,
} from 'chart.js';

import 'chartjs-adapter-date-fns';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ...registerables
);

const transformDataForChart = (problems: IChartData[]): ChartData<'line'> => {
    problems.sort((a, b) => {
        return (
            new Date(a.solved_at).getTime() - new Date(b.solved_at).getTime()
        );
    });

    let cumulativeDifficulty = 20;
    const chartData = {
        labels: [] as Date[],
        datasets: [
            {
                label: 'Cumulative Difficulty',
                data: [] as number[],
                borderColor: 'rgb(253, 26, 132)',
                fill: false,
                borderWidth: 3,
                pointRadius: 2,
            },
        ],
    };

    problems.forEach((problem) => {
        cumulativeDifficulty += problem.problem_level;
        chartData.labels.push(new Date(problem.solved_at)); // x축에 날짜 추가
        chartData.datasets[0].data.push(cumulativeDifficulty); // y축에 누적 난이도 추가
    });

    return chartData;
};

export default function MainLineChart({ userName, amount }: ILineChartProps) {
    const [chartData, setChartData] = useState<IChartData[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch(
                `/api/recent-problems?username=${userName}&limit=${amount}`
            );
            const data = await res.json();
            setChartData(data.data);
        };

        fetchData();
    }, []);

    const data = transformDataForChart(chartData);

    const options = {
        scales: {
            x: {
                type: 'time' as const, // x축을 시간 형식으로 설정
                time: {
                    unit: 'day' as const, // 날짜 단위로 설정 (예: 'minute', 'hour', 'day' 등)
                    tooltipFormat: 'P' as const, // 툴팁에 날짜 포맷 지정
                    displayFormats: { day: 'PPP' },
                    locale: 'ko',
                },
                title: {
                    display: true,
                    text: 'Solved Time' as const,
                },
            },
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Cumulative Difficulty' as const,
                },
            },
        },

        plugins: {
            tooltip: {
                callbacks: {
                    label: function (context: TooltipItem<'line'>) {
                        const idx = context.dataIndex;
                        return `Solved: +${chartData[idx].problem_level}`;
                    },
                },
            },
        },
    };

    return (
        <div>
            <h2>{userName} Solving Graph</h2>
            {data ? <Line data={data} options={options} /> : <></>}
        </div>
    );
}
