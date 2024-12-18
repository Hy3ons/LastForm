'use client';

import { IGetRecentRecordsFormat } from '@/interfaces/IdbService';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import './MainInsertTable.css';

export default function MainInsertTable() {
    const [recentLogs, setRecentLogs] = useState<IGetRecentRecordsFormat[]>([]);

    useEffect(() => {
        const func = async () => {
            try {
                const res = await fetch('/api/getFetch', {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                });

                const data = await res.json();
                setRecentLogs(data.data);
            } catch (err) {
                console.log(err);
            }
        };

        func();
    }, []);

    return (
        <table className="recent-info-table">
            <thead>
                <tr>
                    <th>User</th>
                    <th>Problem</th>
                    <th>Solved At</th>
                </tr>
            </thead>
            <tbody>
                {recentLogs.map((log: IGetRecentRecordsFormat, idx: number) => (
                    <tr key={`${log.user_name}_${idx}`}>
                        <td className="table-name-box">{log.user_name}</td>
                        <td className="table-problem-box">
                            <Image
                                src={`/tier/lv_${log.problem_level}.svg`}
                                alt={`lv_${log.problem_level}`}
                                width={18}
                                height={18}
                            />
                            {`${log.problem_id}`}
                        </td>
                        <td className="table-date-box">
                            {new Date(log.solved_at).toLocaleString()}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
