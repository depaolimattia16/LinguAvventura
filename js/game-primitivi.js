/* ============ PRIMITIVI E DERIVATI: scelta tra "Indovina" e "Memoria" ============ */
function goPrimitiviChoose(){ state.view='primitiviChoose'; render(); }
function viewPrimitiviChoose(){
  return `
  <h2>Primitivi e derivati</h2>
  <p class="hint">Scegli come vuoi giocare.</p>
  <div class="mode-list">
    <button class="mode-card" onclick="startPrimitivi()"><span class="emoji">🎯</span><div class="txt"><strong>Indovina</strong><span>Primitivo o derivato?</span></div></button>
    <button class="mode-card" onclick="startMemoria()"><span class="emoji">🧠</span><div class="txt"><strong>Memoria</strong><span>Trova le coppie: la parola e la sua famiglia</span></div></button>
  </div>`;
}

/* ============ PRIMITIVI E DERIVATI (esercizio a sé, non fa parte dell'Analisi) ============ */
function startPrimitivi(){
  state.gameMode='primitivi';
  const primitivi = PRIMITIVI_DERIVATI.filter(w=>w.tipo==='primitivo');
  const derivati = PRIMITIVI_DERIVATI.filter(w=>w.tipo==='derivato');
  const queue = shuffle([...makeUniqueQueue(primitivi,5), ...makeUniqueQueue(derivati,5)]);
  state.game={qIndex:0,total:10,score:0,queue};
  nextPrimitiviQuestion();
  state.view='game'; render();
}
function nextPrimitiviQuestion(){
  const item = state.game.queue[state.game.qIndex];
  const options = ['primitivo','derivato']; // ordine fisso, sempre le stesse due etichette
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
  ${progressHeader('Domanda '+(g.qIndex+1)+' di '+g.total, 'Punteggio: '+g.score)}
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
  recordAnswer(correct, 'primitivi');
  render();
}
function nextPrimitiviBtn(){
  state.game.qIndex++;
  if(state.game.qIndex < state.game.total) nextPrimitiviQuestion();
  else finishRound();
  render();
}
