'use client';

import './MainLineChart.css';
import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { IChartData, ILineChartProps } from '@/interfaces/ILineChart';
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
    TooltipItem,
} from 'chart.js';

import 'chartjs-adapter-date-fns';
import { transformDataForChart } from '@/utils/transformDataforChart';

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

export default function MainLineChart({ userName, amount }: ILineChartProps) {
    const [chartData, setChartData] = useState<IChartData[]>([]);
    const [user, setUserName] = useState<string>(userName);

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch(
                `/api/recent-problems?username=${user}&limit=${amount}`
            );
            const data = await res.json();
            setChartData(data.data);
        };

        if (user) fetchData();
    }, [user, amount]);

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

    const [isFocused, setIsFocused] = useState(false);
    const [inputValue, setInputValue] = useState('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        if (/^[a-zA-Z0-9\s]*$/.test(newValue)) {
            setInputValue(newValue);
            setUserName(newValue);
        }
    };

    return (
        <div className="mainchart-wrapper">
            <div className="title-wrapper">
                <div>
                    <h2>{user} Recent Problem-Solving Trends</h2>
                </div>
                <div>
                    <input
                        type="text"
                        placeholder="이름을 입력하세요"
                        className={`input ${isFocused ? 'focused' : ''} ${inputValue ? 'hasValue' : ''}`}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        onChange={handleInputChange}
                        value={inputValue}
                    />
                </div>
            </div>
            {data ? <Line data={data} options={options} /> : <></>}
        </div>
    );
}
