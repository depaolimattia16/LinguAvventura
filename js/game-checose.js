/* ============ CHE COS'È — scelta dello stile ============ */
function goCheCosEChoose(){ state.view='checoseChoose'; render(); }
function viewCheCosEChoose(){
  return `
  <h2>Che cos'è?</h2>
  <p class="hint">Scegli come vuoi giocare.</p>
  <div class="mode-list">
    <button class="mode-card" onclick="startCheCosE()"><span class="emoji">🎯</span><div class="txt"><strong>Classica</strong><span>10 domande, senza fretta</span></div></button>
    <button class="mode-card" onclick="startLampo()"><span class="emoji">⚡</span><div class="txt"><strong>A tempo</strong><span>60 secondi, più risposte puoi dare</span></div></button>
    <button class="mode-card" onclick="startMostro()"><span class="emoji">🐉</span><div class="txt"><strong>Contro il mostro</strong><span>Rispondi bene per sconfiggerlo</span></div></button>
    <button class="mode-card" onclick="startParolaMisteriosa()"><span class="emoji">🔍</span><div class="txt"><strong>Dentro una frase</strong><span>Trova la parola evidenziata nel contesto</span></div></button>
  </div>`;
}

/* ============ CHE COS'È ============ */
function startCheCosE(){
  state.gameMode='checose';
  state.game={qIndex:0,total:10,score:0};
  nextCheCosEQuestion();
  state.view='game'; render();
}
function nextCheCosEQuestion(){
  const tipiList = activeTipiList();
  const pool = wordsByTipi(tipiList);
  const word = pickRandom(pool);
  const options = shuffle(tipiList.slice());
  state.game.current = {word, options, answered:false};
}
function viewCheCosE(){
  const g = state.game;
  if(g.qIndex >= g.total){
    return roundSummary(g.score, g.total, 'checose');
  }
  const c = g.current;
  const optsHtml = c.options.map(t=>{
    let cls='option-btn';
    if(c.answered){
      if(t===c.word.t) cls+=' correct';
      else if(t===c.chosen) cls+=' wrong';
    }
    return `<button class="${cls}" ${c.answered?'disabled':''} onclick="answerCheCosE('${t}')">${TIPI_LABELS[t]}</button>`;
  }).join('');
  return `
  <div class="progress-line">Domanda ${g.qIndex+1} di ${g.total} · Punteggio: ${g.score}</div>
  <div class="quiz-card">
    <div class="quiz-prompt">Che cos'è...</div>
    <div class="quiz-word">${c.word.w}</div>
    <div class="options-grid">${optsHtml}</div>
    ${c.answered ? feedbackBlock(c.chosen===c.word.t, () => {}, 'nextCheCosEBtn()') : ''}
  </div>`;
}
function answerCheCosE(t){
  const c = state.game.current;
  if(c.answered) return;
  c.answered = true; c.chosen = t;
  const correct = t===c.word.t;
  if(correct){ state.game.score++; addXP(10); }
  recordAnswer(correct, 'checose');
  render();
}
function nextCheCosEBtn(){
  state.game.qIndex++;
  if(state.game.qIndex < state.game.total) nextCheCosEQuestion();
  else finishRound();
  render();
}
