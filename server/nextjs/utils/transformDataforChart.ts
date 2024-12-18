import { IChartData } from '@/interfaces/ILineChart';
import { ChartData } from 'chart.js';

export function transformDataForChart(
    problems: IChartData[]
): ChartData<'line'> {
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
}
