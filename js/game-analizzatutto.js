/* ============ ANALIZZA TUTTO (frase intera, parola per parola) ============ */
function startAnalizzaTutto(){
  state.gameMode='analizzatutto';
  const sentence = pickRandom(SENTENCES);
  state.game = {sentence, tokenIndex:0, score:0, totalQuestions:0};
  loadAnalizzaTuttoToken();
  state.view='game'; render();
}
function loadAnalizzaTuttoToken(){
  const g = state.game;
  const token = g.sentence[g.tokenIndex];
  g.steps = activeStepsFor(token.t);
  g.totalQuestions += g.steps.length;
  g.stepIndex = 0;
  g.answered = false;
  g.chosen = null;
}
function viewAnalizzaTutto(){
  const g = state.game;
  if(g.tokenIndex >= g.sentence.length){
    return analizzaTuttoSummary(g);
  }
  const token = g.sentence[g.tokenIndex];
  const cfg = ANALYSIS_CONFIG[token.t];
  const stepKey = g.steps[g.stepIndex];
  const sq = cfg.stepDef[stepKey];
  const sentenceHtml = g.sentence.map((t,i)=> i===g.tokenIndex ? `<strong style="color:var(--coral)">${t.w}</strong>` : t.w).join(' ');
  const optsHtml = sq.opts.map(opt=>{
    let cls='option-btn';
    if(g.answered){
      if(opt===token[sq.field]) cls+=' correct';
      else if(opt===g.chosen) cls+=' wrong';
    }
    return `<button class="${cls}" ${g.answered?'disabled':''} onclick="answerAnalizzaTutto('${opt}')">${sq.labels[opt]}</button>`;
  }).join('');
  return `
  <div class="progress-line">Parola ${g.tokenIndex+1} di ${g.sentence.length}</div>
  <div class="quiz-card">
    <p style="font-family:'Baloo 2';font-size:1.2rem;color:var(--ink-soft);margin-bottom:16px">${sentenceHtml}</p>
    <div class="quiz-prompt">${sq.q}</div>
    <div class="quiz-word">${token.w}</div>
    <div class="options-grid">${optsHtml}</div>
    ${g.answered ? feedbackBlock(g.chosen===token[sq.field], null, 'nextAnalizzaTuttoStep()') : ''}
  </div>`;
}
function answerAnalizzaTutto(opt){
  const g = state.game;
  if(g.answered) return;
  const token = g.sentence[g.tokenIndex];
  const cfg = ANALYSIS_CONFIG[token.t];
  const stepKey = g.steps[g.stepIndex];
  const field = cfg.stepDef[stepKey].field;
  g.answered=true; g.chosen=opt;
  const correct = opt===token[field];
  if(correct) g.score++;
  recordAnswer(correct, 'analizzatutto:'+token.t+':'+stepKey);
  render();
}
function nextAnalizzaTuttoStep(){
  const g = state.game;
  g.stepIndex++;
  if(g.stepIndex >= g.steps.length){
    g.tokenIndex++;
    if(g.tokenIndex < g.sentence.length) loadAnalizzaTuttoToken();
    else {
      addXP(20);
      awardBadge('prima_frase');
      finishRound();
    }
  } else {
    g.answered=false; g.chosen=null;
  }
  render();
}
function analizzaTuttoSummary(g){
  const sentenceText = g.sentence.map(t=>t.w).join(' ');
  return `
  <div class="quiz-card">
    <div class="quiz-prompt">🎉 Frase completata!</div>
    <p style="font-family:'Baloo 2';font-size:1.3rem;color:var(--ink)">${sentenceText}</p>
    <div class="quiz-word" style="font-size:2.2rem">${g.score} / ${g.totalQuestions}</div>
    <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-top:14px">
      <button class="btn btn-coral" onclick="startAnalizzaTutto()">Un'altra frase</button>
      <button class="btn btn-ghost" onclick="goAnalizzaChoose()">Altre sfide</button>
    </div>
  </div>`;
}
