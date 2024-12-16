(() => {
    const problemId = window.location.pathname.split("/").pop(); // URL에서 문제 번호 추출
    const username = document.querySelector(".username").innerText; // 사용자 이름

    const table = document.getElementById("status-table"); // table 요소 가져오기
    const rows = table.querySelectorAll("tbody tr"); 

    let flag = 0;
    let date;

    rows.forEach((row) => {
        if (flag) return;

        const name = row.childNodes[1].innerText;
        const result = row.childNodes[3].innerText;

        if (name !== username) return;

        const solvedTime= row.childNodes[8].childNodes[0].getAttribute('data-original-title')
        const [year, month, day, hours, minutes, seconds] = solvedTime.match(/\d+/g).map(Number);

        date = new Date(year, month - 1, day, hours, minutes, seconds);

        if (result === '맞았습니다!!') {
            flag = 1;
        }
    })

    if (!flag) return;
    console.log(`user ${username} Solved Problem ${problemId} Detected`);

    return;

    //서버에 이전에 기록한 결과가 있는지 검토 후, 쿼리 


    // 서버로 데이터 전송
    fetch("https://your-server.com/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username,
        problemId,
        timestamp: new Date().toISOString()
      })
    }).then(() => console.log(`문제 ${problemId} 추적 완료.`));
  }
)();
