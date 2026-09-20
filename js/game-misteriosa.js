/* ============ PAROLA MISTERIOSA ============ */
function startParolaMisteriosa(){
  state.gameMode='misteriosa';
  state.game={qIndex:0,total:10,score:0};
  nextParolaMisteriosa();
  state.view='game'; render();
}
function nextParolaMisteriosa(){
  const sentence = pickRandom(SENTENCES);
  const tokenIndex = Math.floor(Math.random()*sentence.length);
  const options = ['nome','verbo','aggettivo','articolo']; // ordine fisso, sempre le stesse etichette
  state.game.current = {sentence, tokenIndex, options, answered:false};
}
function viewParolaMisteriosa(){
  const g = state.game;
  if(g.qIndex >= g.total){
    return roundSummary(g.score, g.total, 'misteriosa');
  }
  const c = g.current;
  const token = c.sentence[c.tokenIndex];
  const sentenceHtml = c.sentence.map((t,i)=> i===c.tokenIndex ? `<strong style="color:var(--coral)">${t.w}</strong>` : t.w).join(' ');
  const optsHtml = c.options.map(t=>{
    let cls='option-btn';
    if(c.answered){
      if(t===token.t) cls+=' correct';
      else if(t===c.chosen) cls+=' wrong';
    }
    return `<button class="${cls}" ${c.answered?'disabled':''} onclick="answerParolaMisteriosa('${t}')">${TIPI_LABELS[t]}</button>`;
  }).join('');
  return `
  <div class="progress-line">Domanda ${g.qIndex+1} di ${g.total} · Punteggio: ${g.score}</div>
  <div class="quiz-card">
    <p style="font-family:'Baloo 2';font-size:1.3rem;color:var(--ink)">${sentenceHtml}</p>
    <div class="quiz-prompt" style="margin-top:14px">Che cos'è la parola evidenziata?</div>
    <div class="options-grid">${optsHtml}</div>
    ${c.answered ? feedbackBlock(c.chosen===token.t, null, 'nextParolaMisteriosaBtn()') : ''}
  </div>`;
}
function answerParolaMisteriosa(t){
  const c = state.game.current;
  if(c.answered) return;
  c.answered=true; c.chosen=t;
  const correct = t===c.sentence[c.tokenIndex].t;
  if(correct){ state.game.score++; addXP(10); }
  recordAnswer(correct, 'misteriosa');
  render();
}
function nextParolaMisteriosaBtn(){
  state.game.qIndex++;
  if(state.game.qIndex < state.game.total) nextParolaMisteriosa();
  else finishRound();
  render();
}
