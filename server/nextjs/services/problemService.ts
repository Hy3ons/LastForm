export async function queryProblem(problemId: number): Promise<string> {
    try {
        const res = await fetch(
            `https://solved.ac/api/v3/problem/show?problemId=${problemId}`,
            {
                method: 'GET',
                headers: {
                    Accept: 'application/json', // 응답을 JSON 형식으로 받기
                    'x-solvedac-language': 'ko',
                },
            }
        );

        const data = await res.json();
        return JSON.stringify(data);
    } catch (error) {
        console.log(error);
        return `Solved AC API QUERY ${problemId} error occured`;
    }
}

export async function getProblemLevel(problemId: number): Promise<number> {
    const problemINFO: string = await queryProblem(problemId);
    const { level } = JSON.parse(problemINFO);

    return level;
}
