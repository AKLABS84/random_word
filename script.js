// 슬롯, 버튼, 입력창, 단어 리스트 등의 DOM 요소들을 가져옴
const slot = document.getElementById("slot");
const controlButton = document.getElementById("controlButton");
const retryButton = document.getElementById("retryButton");
const resultDiv = document.getElementById("result");
const wordInput = document.getElementById("wordInput");
const addWordButton = document.getElementById("addWordButton");
const wordList = document.getElementById("wordList");
const inputSection = document.querySelector(".input-section");
const slotStage = document.getElementById("slotStage");
const stages = ["누가", "언제", "왜", "어디서", "무엇을", "어떻게" ];
let words = []; // 단어들을 저장할 배열
let interval; // setInterval을 저장할 변수
let isRunning = false; // 슬롯머신의 상태를 저장할 변수
let stageIndex = 0; // 현재 6하원칙 단계 인덱스

// 단어를 추가하는 함수
const addWord = () => {
    const word = wordInput.value.trim(); // 입력된 단어의 앞뒤 공백을 제거
    if (word) {
        words.push(word); // 단어 배열에 추가
        updateWordList(); // 단어 리스트 업데이트
        wordInput.value = ""; // 입력창 초기화
        wordInput.focus(); // 입력창에 포커스
        console.log(`Added word: ${word}`);
        controlButton.disabled = false;  // 단어가 추가되면 Start 버튼 활성화
    }
};

// 단어 리스트를 업데이트하는 함수
const updateWordList = () => {
    wordList.innerHTML = ""; // 기존 리스트 초기화
    words.forEach((word, index) => {
        const li = document.createElement("li"); // 새로운 리스트 아이템 생성
        li.textContent = word; // 리스트 아이템에 단어 텍스트 설정
        const removeButton = document.createElement("button"); // 삭제 버튼 생성
        removeButton.textContent = "x"; // 삭제 버튼 텍스트 설정
        // 삭제 버튼 클릭 이벤트 리스너
        removeButton.addEventListener("click", () => {
            words.splice(index, 1); // 단어 배열에서 단어 삭제
            updateWordList(); // 단어 리스트 업데이트
            if (words.length === 0) {
                controlButton.disabled = true;  // 단어가 모두 삭제되면 Start 버튼 비활성화
            }
        });
        li.appendChild(removeButton); // 리스트 아이템에 삭제 버튼 추가
        wordList.appendChild(li); // 단어 리스트에 리스트 아이템 추가
    });
};

// '단어 추가하기' 버튼 클릭 이벤트 리스너
addWordButton.addEventListener("click", addWord);

// Enter 키를 눌렀을 때 단어를 추가하는 이벤트 리스너
wordInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        addWord();
    }
});

// 'Start' 버튼 클릭 이벤트 리스너
controlButton.addEventListener("click", () => {
    if (!isRunning) {
        // Start 버튼을 눌렀을 때
        controlButton.textContent = "Stop"; // 버튼 텍스트를 Stop으로 변경
        isRunning = true; // 슬롯머신 상태를 실행 중으로 변경
        inputSection.style.display = "none"; // 입력창과 단어 추가 버튼 숨김
        wordList.style.display = "none"; // 단어 리스트 숨김
        interval = setInterval(() => {
            slot.textContent = words[Math.floor(Math.random() * words.length)]; // 단어 배열에서 랜덤한 단어를 슬롯에 표시
        }, 30);
    } else {
        // Stop 버튼을 눌렀을 때
        controlButton.style.display = "none"; // Stop 버튼 숨김
        isRunning = false; // 슬롯머신 상태를 정지 중으로 변경
        let currentInterval = 30; // 초기 interval 시간 설정
        const slowDownIntervals = [50,100,150,200,210,220,230,240,250,260,270,280,290,300,320,350,380,400,420,450,480,500]; // 점차 줄어드는 interval 시간 배열
        
        // 슬롯머신을 점점 느리게 멈추는 함수
        const slowDown = () => {
            if (slowDownIntervals.length > 0) {
                clearInterval(interval); // 기존 interval 정지
                currentInterval = slowDownIntervals.shift(); // 다음 interval 시간 설정
                interval = setInterval(() => {
                    slot.textContent = words[Math.floor(Math.random() * words.length)];
                }, currentInterval);
                setTimeout(slowDown, currentInterval); // 다음 slowDown 호출
            } else {
                clearInterval(interval); // interval 완전히 정지
                const finalWord = slot.textContent; // 최종 단어 저장
                const colorClass = `color${(stageIndex % 6) + 1}`; // 색상 클래스를 순환하며 적용
                resultDiv.innerHTML += `<span class="${colorClass}"> ${finalWord}</span>`;
                stageIndex++; // 다음 단계로 이동
                if (stageIndex < stages.length) {
                    slotStage.textContent = stages[stageIndex];
                    inputSection.style.display = "flex"; // 입력창과 단어 추가 버튼 표시
                    wordList.style.display = "block"; // 단어 리스트 표시
                    words = []; // 단어 배열 초기화
                    updateWordList(); // 단어 리스트 업데이트
                    controlButton.style.display = "block"; // Start 버튼을 다시 표시
                    controlButton.disabled = false; // Start 버튼을 다시 활성화
                    controlButton.textContent = "Start"; 
                } else {
                    // 모든 단계가 완료된 경우
                    slotMachineComplete();
                }
            }
        };
        slowDown(); // 슬롯머신 멈추기 시작
    }
});

// 슬롯머신 작업이 완료된 경우 호출되는 함수
const slotMachineComplete = () => {
    slotStage.style.display = "none";
    controlButton.style.display = "none";
    slot.style.display = "none";
    retryButton.style.display = "block";
    resultDiv.style.display = "block";
    controlButton.textContent = "Start"; // Start 버튼으로 텍스트 변경
};

// '다시하기' 버튼 클릭 이벤트 리스너
retryButton.addEventListener("click", () => {
    resultDiv.textContent = "";
    stageIndex = 0;
    slotStage.textContent = stages[stageIndex];
    slotStage.style.display = "block";
    controlButton.style.display = "block";
    slot.style.display = "flex";
    retryButton.style.display = "none";
    inputSection.style.display = "flex";
    wordList.style.display = "block";
    words = [];
    updateWordList();
});
