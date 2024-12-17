import {
    IdbServiceInsertSolvingInfo,
    IGetRecentRecordsFormat,
} from '@/interfaces/IdbService';
import { createClient } from '@supabase/supabase-js';
import { IChartData } from './ILineChart';

const supabaseUrl = process.env.SUPABASE_URL as string;
const supabaseKey = process.env.SUPABASE_KEY as string;
const tableName = process.env.SUPABASE_TABLE_NAME as string;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDuplicate(
    userName: string,
    problemId: string
): Promise<boolean> {
    const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .eq('user_name', userName)
        .eq('problem_id', Number(problemId));

    if (error) {
        console.error('Error fetching data:', error);
        return true;
    }

    if (data.length > 0) {
        return true;
    } else {
        return false;
    }
}

export async function insertSolvingInfo({
    userName,
    problemId,
    solvedAt,
    problemLevel,
}: IdbServiceInsertSolvingInfo): Promise<string> {
    try {
        const duplicated = await checkDuplicate(userName, problemId);

        if (duplicated) {
            return 'Information is already stored';
        }

        const { error } = await supabase.from(tableName).insert([
            {
                user_name: userName,
                problem_id: problemId,
                problem_level: problemLevel,
                solved_at: solvedAt.toISOString(),
            },
        ]);

        if (error) throw new Error(error.message || 'Unknown error occurred');

        return 'Solving info inserted successfully';
    } catch (error: unknown) {
        if (error instanceof Error) {
            return `Error: ${error.message}`;
        } else {
            return `Unknown Error Occured`;
        }
    }
}

//특정 유저가 푼 최근문제를 가져옵니다.
export async function getRecentProblems(
    username: string,
    amount: number
): Promise<IChartData[]> {
    const { data, error } = await supabase
        .from(tableName)
        .select('problem_id, problem_level, solved_at')
        .order('solved_at', { ascending: false })
        .eq('user_name', username)
        .limit(amount);

    if (error) {
        console.error('Error fetching recent records:', error.message);
        throw new Error(error.message);
    }

    return data;
}

export async function getRecentFetch(
    amount: number
): Promise<IGetRecentRecordsFormat[]> {
    const { data, error } = await supabase
        .from(tableName)
        .select('user_name, problem_id, problem_level, solved_at')
        .order('created_at', { ascending: false })
        .limit(amount);

    if (error) {
        console.error('Error fetching recent records:', error.message);
        throw new Error(error.message);
    }

    return data;
}
