// 核心邏輯：隨機出題與錯誤分類
let currentIdx = 0;
let wrongQuestions = JSON.parse(localStorage.getItem('wrongList')) || [];
let shuffledQuestions = [];

// 這裡放入完整題庫資料 (範例包含 PDF 前幾題，你可以持續增加)
const allQuestions = [
    // 金融市場常識 
    { q: "下列何者不是金融市場的主要功能？", a: ["(1)提供金融工具交易的場所", "(2)擔任資金需求者與供給者的橋樑", "(3)促進投資活動的效率", "(4)提供交易者投機的場所"], ans: 3 },
    { q: "下列何者不是金融市場交易的工具？", a: ["(1)商業本票", "(2)銀行存款", "(3)股票", "(4)古董與藝術品"], ans: 3 },
    { q: "當金融市場管理的品質較佳時，企業發行的金融產品成本會____，金融工具的流動性會____。", a: ["(1)較低, 較低", "(2)較高, 較低", "(3)較低, 較高", "(4)較高, 較高"], ans: 2 },
    { q: "依照國內金融監督管理制度的架構，主掌金融業檢查業務的單位為：", a: ["(1)銀行局", "(2)中央銀行", "(3)中央存款保險公司", "(4)檢查局"], ans: 3 },
    
    // 職業道德 
    { q: "金融從業人員從事保險招攬行為，下列那一項是錯的？", a: ["(1)解釋保險商品內容及保單條款", "(2)說明填寫要保書注意事項", "(3)經所屬公司授權從事保險招攬行為", "(4)可以向未經授權公司從事招攬行為"], ans: 3 },
    { q: "金融從業人員招攬業務時，不得以下列方式進行：", a: ["(1)向客戶作不實陳述，僅強調容易獲利未同時說明相對風險", "(2)以多層次傳銷方式進行", "(3)宣稱金融商品交易簡明易懂，適合所有人士", "(4)以上皆不得為之"], ans: 3 },
    { q: "金融從業人員辦理充分瞭解客戶作業，以下何種態度是錯誤的？", a: ["(1)應由客戶所填資料充分知悉客戶狀況", "(2)應由客戶所填資料評估客戶狀況", "(3)請客戶隨便填一填以便歸檔備查", "(4)辦理充分瞭解客戶作業是推介商品非常重要程序"], ans: 2 }
    // ... 剩餘題目可依此格式繼續貼上
];

// 隨機排序函數
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function initQuiz() {
    shuffledQuestions = shuffle([...allQuestions]); // 複製並打亂題目
    currentIdx = 0;
    loadQuestion();
}

function loadQuestion() {
    if (currentIdx >= shuffledQuestions.length) {
        document.getElementById('quiz-box').innerHTML = "<h2>恭喜！已完成所有題目練習。</h2><button onclick='initQuiz()'>重新挑戰</button>";
        return;
    }

    const q = shuffledQuestions[currentIdx];
    document.getElementById('question-text').innerText = `題目：${q.q}`;
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
    const q = shuffledQuestions[currentIdx];
    const btns = document.querySelectorAll('#options-container button');
    
    if (selected === q.ans) {
        document.getElementById('result-message').innerHTML = "<span style='color:green'>✅ 正確！</span>";
        btns[selected].classList.add('correct');
        setTimeout(() => {
            currentIdx++;
            loadQuestion();
        }, 800);
    } else {
        document.getElementById('result-message').innerHTML = `<span style='color:red'>❌ 答錯了！正確答案是：${q.a[q.ans]}</span>`;
        btns[selected].classList.add('wrong');
        
        // 加入錯誤分類紀錄 
        if (!wrongQuestions.some(item => item.q === q.q)) {
            wrongQuestions.push(q);
            localStorage.setItem('wrongList', JSON.stringify(wrongQuestions));
            renderWrongList();
        }
    }
}

function renderWrongList() {
    const list = document.getElementById('wrong-list');
    list.innerHTML = wrongQuestions.map(item => `
        <div class="wrong-item">
            <strong>❌ ${item.q}</strong><br>
            <small>正確答案：${item.a[item.ans]}</small>
        </div>
    `).join('');
}

function clearWrong() {
    if(confirm("確定要清空錯誤記錄嗎？")) {
        localStorage.removeItem('wrongList');
        wrongQuestions = [];
        renderWrongList();
    }
}

// 啟動測驗
initQuiz();
