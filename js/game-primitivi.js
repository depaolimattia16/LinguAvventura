/* ============ PRIMITIVI E DERIVATI (esercizio a sé, non fa parte dell'Analisi) ============ */
function startPrimitivi(){
  state.gameMode='primitivi';
  state.game={qIndex:0,total:10,score:0};
  nextPrimitiviQuestion();
  state.view='game'; render();
}
function nextPrimitiviQuestion(){
  // pesco 50/50 tra primitivi e derivati, così il gioco resta equilibrato
  // anche se in lista ci sono più derivati che primitivi
  const primitivi = PRIMITIVI_DERIVATI.filter(w=>w.tipo==='primitivo');
  const derivati = PRIMITIVI_DERIVATI.filter(w=>w.tipo==='derivato');
  const item = Math.random() < 0.5 ? pickRandom(primitivi) : pickRandom(derivati);
  const options = shuffle(['primitivo','derivato']);
  state.game.current = {item, options, answered:false, chosen:null};
}
function viewPrimitivi(){
  const g = state.game;
  if(g.qIndex >= g.total){
    return roundSummary(g.score, g.total, 'primitivi');
  }
  const c = g.current;
  const optsHtml = c.options.map(t=>{
    let cls='option-btn';
    if(c.answered){
      if(t===c.item.tipo) cls+=' correct';
      else if(t===c.chosen) cls+=' wrong';
    }
    return `<button class="${cls}" ${c.answered?'disabled':''} onclick="answerPrimitivi('${t}')">${PRIMDERIV_LABELS[t]}</button>`;
  }).join('');
  return `
  <div class="progress-line">Domanda ${g.qIndex+1} di ${g.total} · Punteggio: ${g.score}</div>
  <div class="quiz-card">
    <div class="quiz-prompt">È primitivo o derivato?</div>
    <div class="quiz-word">${c.item.w}</div>
    <div class="options-grid">${optsHtml}</div>
    ${c.answered ? feedbackBlock(c.chosen===c.item.tipo, null, 'nextPrimitiviBtn()') : ''}
  </div>`;
}
function answerPrimitivi(t){
  const c = state.game.current;
  if(c.answered) return;
  c.answered=true; c.chosen=t;
  const correct = t===c.item.tipo;
  if(correct){ state.game.score++; addXP(10); }
  recordAnswer(correct);
  render();
}
function nextPrimitiviBtn(){
  state.game.qIndex++;
  if(state.game.qIndex < state.game.total) nextPrimitiviQuestion();
  else finishRound();
  render();
}
