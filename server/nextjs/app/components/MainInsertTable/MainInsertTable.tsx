'use client';

import { IGetRecentRecordsFormat } from '@/interfaces/IdbService';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import styles from './MainInsertTable.module.css';

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
                        <td>{log.user_name}</td>
                        <td className="table-problem-box">
                            <Image
                                src={`lv_${log.problem_level}.svg`}
                                alt={`lv_${log.problem_level}`}
                                width={18}
                                height={18}
                            />
                            {`${log.problem_id}`}
                        </td>
                        <td>
                            {new Date(log.solved_at)
                                .toLocaleString('en-GB', {
                                    year: 'numeric',
                                    month: '2-digit',
                                    day: '2-digit',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    second: '2-digit',
                                })
                                .replace(/[\//, ]/g, '-')}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
