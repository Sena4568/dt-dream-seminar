// ── 페이지 전환 ──
function showPage(id) {
  document.querySelectorAll(".page").forEach(function (p) {
    p.classList.toggle("active", p.id === id);
  });
  document.querySelectorAll(".nav-btn").forEach(function (b) {
    b.classList.toggle("active", b.dataset.page === id);
  });
  window.scrollTo({ top: 0, behavior: "smooth" });
  if (id === "quiz") startQuiz();
}

document.addEventListener("click", function (e) {
  var trigger = e.target.closest("[data-page]");
  if (trigger) showPage(trigger.dataset.page);
});

// ── 복습 퀴즈 ──
var QUESTIONS = [
  {
    q: "보고서의 4가지 구성 요소에 해당하지 않는 것은?",
    options: ["목적", "결론", "분량", "실행"],
    answer: 2,
    explain: "보고서의 4요소는 목적·결론·근거·실행입니다. 분량은 요소가 아닙니다."
  },
  {
    q: "두괄식 보고서에서 첫 문단에 와야 하는 것은?",
    options: ["자료 수집 과정", "결론", "참고 문헌", "작성자 소개"],
    answer: 1,
    explain: "두괄식은 결론을 맨 앞에 둡니다. 바쁜 의사결정자가 첫 문단에서 핵심을 찾습니다."
  },
  {
    q: "보고서 쓰기 5단계 흐름에서 '구조 잡기' 바로 다음 단계는?",
    options: ["자료 수집", "초안 작성", "제출", "검토·수정"],
    answer: 1,
    explain: "흐름은 자료 수집 → 구조 잡기 → 초안 작성 → 검토·수정 → 제출 순서입니다."
  },
  {
    q: "'보고서는 글짓기가 아니다'라는 말이 강조하는 것은?",
    options: ["화려한 표현", "긴 분량", "명확한 목적", "어려운 용어"],
    answer: 2,
    explain: "보고서는 읽는 사람이 판단하고 행동하도록 돕는 '목적이 있는 문서'입니다."
  },
  {
    q: "구성 요소 중 '읽는 사람이 무엇을 하면 되는가'에 답하는 것은?",
    options: ["목적", "근거", "결론", "실행"],
    answer: 3,
    explain: "'실행'은 읽는 사람이 취해야 할 행동을 알려 주는 요소입니다."
  }
];

var order = [];
var idx = 0;
var score = 0;

function shuffle(arr) {
  var a = arr.slice();
  for (var i = a.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var t = a[i]; a[i] = a[j]; a[j] = t;
  }
  return a;
}

function startQuiz() {
  order = shuffle(QUESTIONS.map(function (_, i) { return i; }));
  idx = 0;
  score = 0;
  renderQuestion();
}

function renderQuestion() {
  var q = QUESTIONS[order[idx]];
  var body = document.getElementById("quizBody");
  document.getElementById("quizBar").style.width = (idx / QUESTIONS.length * 100) + "%";
  var last = (idx + 1 === QUESTIONS.length);
  body.innerHTML =
    '<div class="qnum">문제 ' + (idx + 1) + ' / ' + QUESTIONS.length + '</div>' +
    '<div class="question">' + q.q + '</div>' +
    '<div class="options" id="options"></div>' +
    '<div class="feedback" id="feedback"></div>' +
    '<div class="quiz-foot"><button id="next" disabled>' +
    (last ? "결과 보기" : "다음 문제") + '</button></div>';
  var wrap = document.getElementById("options");
  q.options.forEach(function (text, i) {
    var btn = document.createElement("button");
    btn.className = "option";
    btn.textContent = text;
    btn.onclick = function () { choose(i, q); };
    wrap.appendChild(btn);
  });
  document.getElementById("next").onclick = nextQuestion;
}

function choose(i, q) {
  var buttons = document.querySelectorAll(".option");
  buttons.forEach(function (b, bi) {
    b.disabled = true;
    if (bi === q.answer) b.classList.add("correct");
    if (bi === i && i !== q.answer) b.classList.add("wrong");
  });
  var fb = document.getElementById("feedback");
  if (i === q.answer) {
    score++;
    fb.className = "feedback ok";
    fb.textContent = "정답입니다! " + q.explain;
  } else {
    fb.className = "feedback no";
    fb.textContent = "아쉬워요. " + q.explain;
  }
  document.getElementById("next").disabled = false;
}

function nextQuestion() {
  idx++;
  if (idx < QUESTIONS.length) {
    renderQuestion();
  } else {
    renderResult();
  }
}

function renderResult() {
  document.getElementById("quizBar").style.width = "100%";
  var total = QUESTIONS.length;
  var msg;
  if (score === total) msg = "완벽합니다! 1차시 핵심을 모두 기억하고 있어요.";
  else if (score >= total - 1) msg = "훌륭해요. 거의 다 맞혔습니다.";
  else if (score >= total / 2) msg = "잘했어요. 틀린 개념만 다시 살펴보세요.";
  else msg = "1차시 교안을 한 번 더 복습하고 다시 도전해 보세요.";
  document.getElementById("quizBody").innerHTML =
    '<div class="result">' +
    '<div class="score">' + score + ' / ' + total + '</div>' +
    '<h3>복습 완료!</h3>' +
    '<p>' + msg + '</p>' +
    '<button id="retry">다시 풀기</button>' +
    '</div>';
  document.getElementById("retry").onclick = startQuiz;
}
