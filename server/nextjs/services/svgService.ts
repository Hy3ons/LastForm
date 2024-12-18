import { getRecentProblems } from './dbService';
import * as d3 from 'd3';
import { IChartData } from '@/interfaces/ILineChart';
import { JSDOM } from 'jsdom';

interface ID3Data {
    x: Date;
    y: number;
    image: string;
}

const transformDataforSvg = (data: IChartData[]): ID3Data[] => {
    data.sort((a, b) => {
        return (
            new Date(a.solved_at).getTime() - new Date(b.solved_at).getTime()
        );
    });

    const result: ID3Data[] = [];

    let prefix = 0;

    for (let i = 0; i < data.length; i++) {
        prefix += data[i].problem_level;
        result.push({
            x: new Date(data[i].solved_at),
            y: prefix,
            image: `/tier/lv_${data[i].problem_level}.svg`,
        });
    }

    return result;
};

export async function drawChartToSvg(userName: string, limit: number) {
    const data = await getRecentProblems(userName, limit);
    const chartData = transformDataforSvg(data);

    const width = 700;
    const height = 250;
    const marginTop = 20;
    const marginBottom = 20;
    const marginRight = 40;
    const marginLeft = 40;

    const svgWidth = width + marginLeft + marginRight;
    const svgHeight = height + marginTop + marginBottom;

    const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
    const document = dom.window.document;
    // SVG 요소 생성
    const svg = d3
        .select(document.createElementNS('http://www.w3.org/2000/svg', 'svg'))
        .attr('xmlns', 'http://www.w3.org/2000/svg')
        .attr('width', svgWidth)
        .attr('height', svgHeight);

    svg.append('rect')
        .attr('width', svgWidth)
        .attr('height', svgHeight)
        .attr('rx', 20)
        .attr('ry', 20)
        .attr('fill', '#BCBCBC'); // 배경색 설정

    // 내부 여백 그룹
    const chartGroup = svg
        .append('g')
        .attr('transform', `translate(${marginLeft}, ${marginTop})`);

    // X축과 Y축 스케일 정의
    const xScale = d3
        .scaleUtc()
        .domain(d3.extent(chartData, (d) => d.x) as [Date, Date])
        .range([0, width]);

    const yScale = d3
        .scaleLinear()
        .domain([0, d3.max(chartData, (d) => d.y) || 0])
        .range([height, 0]);

    // X축과 Y축 생성
    const xAxis = d3
        .axisBottom<Date>(xScale)
        .ticks(6)
        .tickFormat(d3.timeFormat('%YYYY-%mm-%dd'));
    const yAxis = d3.axisLeft(yScale).ticks(5);

    // X축 추가
    chartGroup
        .append('g')
        .attr('transform', `translate(0, ${height})`)
        .call(xAxis)
        .selectAll('text')
        .remove();

    // Y축 추가
    chartGroup.append('g').call(yAxis);

    // 선 생성기
    const line = d3
        .line<ID3Data>()
        .x((d) => xScale(d.x))
        .y((d) => yScale(d.y));

    // 선 추가
    chartGroup
        .append('path')
        .datum(chartData)
        .attr('fill', 'none')
        .attr('stroke', 'red')
        .attr('stroke-width', 2)
        .attr('d', line);

    // 데이터 점 추가
    chartGroup
        .selectAll('.dot')
        .data(chartData)
        .enter()
        .append('circle')
        .attr('cx', (d) => xScale(d.x))
        .attr('cy', (d) => yScale(d.y))
        .attr('r', 3)
        .attr('fill', 'red');

    chartGroup
        .selectAll('.dot')
        .transition()
        .duration(1000)
        .attr('r', 6)
        .on('start', function () {
            d3.select(this).attr('r', 3);
        });

    svg.selectAll('.image')
        .data(chartData)
        .enter()
        .append('image')
        .attr('class', 'image')
        .attr('x', (d) => xScale(d.x) + 50)
        .attr('y', (d) => yScale(d.y) + 10)
        .attr('width', 15)
        .attr('height', 15)
        .attr('xlink:href', (d) => d.image);

    return svg.node()?.outerHTML;
}
