const sections = ['누가', '언제', '왜', '어디서', '무엇을', '어떻게'];
const examples = {
    '누가': '예시) 손흥민이',
    '언제': '예시) 어젯밤에',
    '왜': '예시) 심심해서',
    '어디서': '예시) PC방에서',
    '무엇을': '예시) 라면을',
    '어떻게': '예시) 사줬다'
};
let sectionData = {};

document.addEventListener('DOMContentLoaded', () => {
    const inputSections = document.getElementById('inputSections');
    const completeButton = document.getElementById('completeButton');
    const drawButton = document.getElementById('drawButton');
    const stopButton = document.getElementById('stopButton');
    const restartButton = document.getElementById('restartButton');
    const inputPage = document.getElementById('inputPage');
    const slotMachinePage = document.getElementById('slotMachinePage');
    const slotMachines = document.getElementById('slotMachines');
    const result = document.getElementById('result');

    // 입력 섹션 생성
    sections.forEach(section => {
        const sectionDiv = document.createElement('div');
        sectionDiv.className = 'section';
        sectionDiv.innerHTML = `
            <h2>${section}</h2>
            <p class="example">${examples[section]}</p>
            <ul id="${section}List"></ul>
            <input type="text" id="${section}Input">
            <button class="add-btn" onclick="addData('${section}')">추가</button>
        `;
        inputSections.appendChild(sectionDiv);
        sectionData[section] = [];
    });

    // 완료 버튼 클릭 이벤트
    completeButton.addEventListener('click', () => {
        inputPage.style.display = 'none';
        slotMachinePage.style.display = 'block';
        createSlotMachines();
    });

    // 뽑기 버튼 클릭 이벤트
    drawButton.addEventListener('click', () => {
        drawButton.style.display = 'none';
        stopButton.style.display = 'block';
        startAllSlotMachines();
    });

    // 정지 버튼 클릭 이벤트
    stopButton.addEventListener('click', () => {
        stopButton.style.display = 'none';
        stopAllSlotMachines();
    });

    // 다시 시작하기 버튼 클릭 이벤트
    restartButton.addEventListener('click', () => {
        resetAll();
    });
});

function addData(section) {
    const input = document.getElementById(`${section}Input`);
    const list = document.getElementById(`${section}List`);
    const value = input.value.trim();

    if (value) {
        sectionData[section].push(value);
        const li = document.createElement('li');
        li.innerHTML = `
            ${value}
            <button class="delete-btn" onclick="deleteData('${section}', '${value}')">삭제</button>
        `;
        list.appendChild(li);
        input.value = '';
    }
}

function deleteData(section, value) {
    sectionData[section] = sectionData[section].filter(item => item !== value);
    updateList(section);
}

function updateList(section) {
    const list = document.getElementById(`${section}List`);
    list.innerHTML = '';
    sectionData[section].forEach(value => {
        const li = document.createElement('li');
        li.innerHTML = `
            ${value}
            <button class="delete-btn" onclick="deleteData('${section}', '${value}')">삭제</button>
        `;
        list.appendChild(li);
    });
}

function createSlotMachines() {
    const slotMachines = document.getElementById('slotMachines');
    slotMachines.innerHTML = '';
    sections.forEach(section => {
        const slotMachine = document.createElement('div');
        slotMachine.className = 'slot-machine';
        slotMachine.innerHTML = `
            <h3>${section}</h3>
            <div class="slot" id="${section}Slot"></div>
        `;
        slotMachines.appendChild(slotMachine);
    });
}

let intervals = {};

function startAllSlotMachines() {
    sections.forEach(section => {
        const slot = document.getElementById(`${section}Slot`);
        intervals[section] = setInterval(() => {
            const randomIndex = Math.floor(Math.random() * sectionData[section].length);
            slot.textContent = sectionData[section][randomIndex];
        }, 50);
    });
}

function stopAllSlotMachines() {
    let stoppedCount = 0;
    const stopInterval = setInterval(() => {
        const sectionToStop = sections[stoppedCount];
        clearInterval(intervals[sectionToStop]);
        const finalWord = document.getElementById(`${sectionToStop}Slot`).textContent;
        result.innerHTML += `<span class="result-word">${finalWord}</span> `;
        stoppedCount++;
        if (stoppedCount === sections.length) {
            clearInterval(stopInterval);
            document.getElementById('restartButton').style.display = 'block';
        }
    }, 1000);
}

function resetAll() {
    sectionData = {};
    sections.forEach(section => {
        sectionData[section] = [];
        document.getElementById(`${section}List`).innerHTML = '';
        document.getElementById(`${section}Input`).value = '';
    });
    document.getElementById('inputPage').style.display = 'block';
    document.getElementById('slotMachinePage').style.display = 'none';
    document.getElementById('drawButton').style.display = 'block';
    document.getElementById('stopButton').style.display = 'none';
    document.getElementById('restartButton').style.display = 'none';
    document.getElementById('result').innerHTML = '';
}
