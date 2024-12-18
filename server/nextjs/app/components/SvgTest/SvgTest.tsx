'use client';

import { IPropsSvgTest } from '@/interfaces/ISvgTest';

export default function SvgTest({ username, limit }: IPropsSvgTest) {
    return (
        <div className="test">
            <img
                src={`/api/draw?username=${username}&limit=${limit}`}
                alt="drawChartSvg"
                width={750}
                height={250}
            />
        </div>
    );
}
