export interface IdbServiceInsertSolvingInfo {
    userName: string;
    problemId: string;
    solvedAt: Date;
    problemLevel: number;
}
export interface IGetRecentRecordsFormat {
    user_name: string;
    problem_id: number;
    problem_level: number;
    solved_at: string;
}
