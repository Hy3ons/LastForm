import { getRecentProblems } from '@/services/dbService';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function OPTIONS() {
    const response = new Response(null, { status: 204 });

    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set(
        'Access-Control-Allow-Methods',
        'GET, POST, PUT, DELETE'
    );
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');

    return response;
}

export async function GET(request: Request) {
    const url = new URL(request.url);
    const username = url.searchParams.get('username');
    const limit = url.searchParams.get('limit');

    if (!username || !limit) {
        return NextResponse.json(
            { error: 'There is no Parameter Username or Limit' },
            { status: 400 }
        );
    }

    try {
        const data = await getRecentProblems(username, Number(limit));
        return NextResponse.json({ data });
    } catch (err) {
        console.log(err);
        return NextResponse.json(
            { error: 'Something went wrong' },
            { status: 500 }
        );
    }
}
