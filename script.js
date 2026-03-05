// 這裡放入你提供的 PDF 題目範例
const questions = [
    { q: "下列何者不是金融市場的主要功能？", a: ["(1)提供金融工具交易的場所", "(2)擔任橋樑", "(3)促進投資效率", "(4)提供交易者投機的場所"], ans: 3 },
    { q: "下列何者不是金融市場交易的工具？", a: ["(1)商業本票", "(2)銀行存款", "(3)股票", "(4)古董與藝術品"], ans: 3 },
    { q: "金融從業人員招攬保險時，何者錯誤？", a: ["(1)解釋條款", "(2)說明要保書", "(3)公司授權", "(4)向未經授權公司招攬"], ans: 3 }
];

let currentIdx = 0;
let wrongQuestions = JSON.parse(localStorage.getItem('wrongList')) || [];

function loadQuestion() {
    const q = questions[currentIdx];
    document.getElementById('question-text').innerText = `${currentIdx + 1}. ${q.q}`;
    const container = document.getElementById('options-container');
    container.innerHTML = '';
    document.getElementById('result-message').innerText = '';

    q.a.forEach((opt, i) => {
        const btn = document.createElement('button');
        btn.innerText = opt;
        btn.onclick = () => checkAnswer(i);
        container.appendChild(btn);
    });
    renderWrongList();
}

function checkAnswer(selected) {
    const q = questions[currentIdx];
    const btns = document.querySelectorAll('#options-container button');
    
    if (selected === q.ans) {
        document.getElementById('result-message').innerText = "✅ 正確！";
        btns[selected].classList.add('correct');
        setTimeout(() => {
            currentIdx = (currentIdx + 1) % questions.length;
            loadQuestion();
        }, 1000);
    } else {
        document.getElementById('result-message').innerText = "❌ 答錯了，題目已加入錯誤區";
        btns[selected].classList.add('wrong');
        if (!wrongQuestions.some(item => item.q === q.q)) {
            wrongQuestions.push(q);
            localStorage.setItem('wrongList', JSON.stringify(wrongQuestions));
            renderWrongList();
        }
    }
}

function renderWrongList() {
    const list = document.getElementById('wrong-list');
    list.innerHTML = wrongQuestions.map(item => `<div class="wrong-item">🚩 ${item.q}</div>`).join('');
}

function clearWrong() {
    localStorage.removeItem('wrongList');
    wrongQuestions = [];
    renderWrongList();
}

loadQuestion();