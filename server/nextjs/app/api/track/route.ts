import { insertSolvingInfo } from '@/services/dbService';
import { getProblemLevel } from '../../../services/problemService';

export const dynamic = 'force-dynamic';
export async function OPTIONS(request: Request) {
    const response = new Response(null, { status: 204 });

    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'POST');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');

    return response;
}

export async function POST(request: Request) {
    const { username, problemId, date } = await request.json();

    const dateObject: Date = new Date(date);
    const problemLevel: number = await getProblemLevel(Number(problemId));

    const result = await insertSolvingInfo({
        userName: username,
        problemId,
        solvedAt: dateObject,
        problemLevel,
    });

    const response = new Response(result);
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'POST');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');

    return response;
}
