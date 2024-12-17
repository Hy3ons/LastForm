import { getRecentFetch } from '@/services/dbService';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function OPTIONS(request: Request) {
    const response = new Response(null, { status: 204 });

    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set(
        'Access-Control-Allow-Methods',
        'GET, POST, PUT, DELETE'
    );
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');

    return response;
}

export async function GET() {
    try {
        const data = await getRecentFetch(14);
        return NextResponse.json({ data });
    } catch (err) {
        console.log(err);
        return NextResponse.json(
            { error: 'Something went wrong' },
            { status: 500 }
        );
    }
}
