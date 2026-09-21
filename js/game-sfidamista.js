/* ============ SFIDA MISTA (pesca da tutte le modalità di grammatica) ============ */
function buildRound_checose(){
  const tipiList = activeTipiList();
  const pool = wordsByTipi(tipiList);
  if(pool.length===0) return null;
  const word = pickRandom(pool);
  const options = tipiList.slice(); // ordine fisso: le etichette sono sempre le stesse, mescolarle è solo fastidioso
  return {kind:'checose', word, options};
}
function buildRound_intruso(){
  const r = generateIntruso();
  if(!r) return null;
  return {kind:'intruso', ...r};
}
function buildRound_misteriosa(){
  const sentence = pickRandom(SENTENCES);
  const tokenIndex = Math.floor(Math.random()*sentence.length);
  const options = ['nome','verbo','aggettivo','articolo']; // ordine fisso, sempre le stesse etichette
  return {kind:'misteriosa', sentence, tokenIndex, options};
}
function buildRound_primitivi(){
  const primitivi = PRIMITIVI_DERIVATI.filter(w=>w.tipo==='primitivo');
  const derivati = PRIMITIVI_DERIVATI.filter(w=>w.tipo==='derivato');
  if(primitivi.length===0 || derivati.length===0) return null;
  const item = Math.random() < 0.5 ? pickRandom(primitivi) : pickRandom(derivati);
  const options = ['primitivo','derivato']; // ordine fisso, sempre le stesse due etichette
  return {kind:'primitivi', item, options};
}
function buildRound_analisi(){
  const types = ['nome','aggettivo','articolo','verbo','pronome','preposizione','avverbio'].filter(t=>{
    const steps = activeStepsFor(t).filter(s=>s!=='tipo_parola');
    return steps.length>0 && poolFor(t).length>0;
  });
  if(types.length===0) return null;
  const type = pickRandom(types);
  const steps = activeStepsFor(type).filter(s=>s!=='tipo_parola');
  const stepKey = pickRandom(steps);
  const cfg = ANALYSIS_CONFIG[type];
  const sq = cfg.stepDef[stepKey];
  const word = pickRandom(poolFor(type));
  const options = sq.opts.slice(); // ordine fisso, come nell'Analisi grammaticale vera e propria
  return {kind:'analisi', type, sq, word, options};
}
const MIXED_BUILDERS = {
  checose: buildRound_checose,
  intruso: buildRound_intruso,
  misteriosa: buildRound_misteriosa,
  primitivi: buildRound_primitivi,
  analisi: buildRound_analisi,
};
function startSfidaMista(){
  state.gameMode='sfidamista';
  state.game = {qIndex:0, total:10, score:0};
  nextSfidaMistaQuestion();
  state.view='game'; render();
}
function nextSfidaMistaQuestion(){
  const kinds = shuffle(Object.keys(MIXED_BUILDERS));
  let round = null;
  for(const k of kinds){
    round = MIXED_BUILDERS[k]();
    if(round) break;
  }
  if(!round) round = buildRound_checose(); // sempre disponibile, garantisce che non si blocchi mai
  state.game.current = round;
  state.game.answered = false;
  state.game.chosen = null;
}
function viewSfidaMista(){
  const g = state.game;
  if(g.qIndex >= g.total){
    return roundSummary(g.score, g.total, 'sfidamista');
  }
  const c = g.current;
  let bodyHtml = '';
  if(c.kind==='checose'){
    const optsHtml = c.options.map(t=>{
      let cls='option-btn';
      if(g.answered){ if(t===c.word.t) cls+=' correct'; else if(t===g.chosen) cls+=' wrong'; }
      return `<button class="${cls}" ${g.answered?'disabled':''} onclick="answerSfidaMista('${t}')">${TIPI_LABELS[t]}</button>`;
    }).join('');
    bodyHtml = `<div class="quiz-prompt">Che cos'è...</div><div class="quiz-word">${c.word.w}</div><div class="options-grid">${optsHtml}</div>`;
  } else if(c.kind==='intruso'){
    const tilesHtml = c.four.map(item=>{
      let cls='word-tile';
      if(g.answered){
        if(item.w===c.intruder.w) cls+=' correct';
        else if(g.chosen && item.w===g.chosen) cls+=' wrong';
      }
      return `<button class="${cls}" ${g.answered?'disabled':''} onclick="answerSfidaMista('${escJs(item.w)}')">${item.w}</button>`;
    }).join('');
    bodyHtml = `<div class="quiz-prompt">Qual è l'intruso?</div><div class="quiz-grid-4">${tilesHtml}</div>`;
  } else if(c.kind==='misteriosa'){
    const token = c.sentence[c.tokenIndex];
    const sentenceHtml = c.sentence.map((t,i)=> i===c.tokenIndex ? `<strong style="color:var(--coral)">${t.w}</strong>` : t.w).join(' ');
    const optsHtml = c.options.map(t=>{
      let cls='option-btn';
      if(g.answered){ if(t===token.t) cls+=' correct'; else if(t===g.chosen) cls+=' wrong'; }
      return `<button class="${cls}" ${g.answered?'disabled':''} onclick="answerSfidaMista('${t}')">${TIPI_LABELS[t]}</button>`;
    }).join('');
    bodyHtml = `<p style="font-family:'Baloo 2';font-size:1.2rem;color:var(--ink-soft);margin-bottom:14px">${sentenceHtml}</p><div class="quiz-prompt">Che cos'è la parola evidenziata?</div><div class="options-grid">${optsHtml}</div>`;
  } else if(c.kind==='primitivi'){
    const optsHtml = c.options.map(t=>{
      let cls='option-btn';
      if(g.answered){ if(t===c.item.tipo) cls+=' correct'; else if(t===g.chosen) cls+=' wrong'; }
      return `<button class="${cls}" ${g.answered?'disabled':''} onclick="answerSfidaMista('${t}')">${PRIMDERIV_LABELS[t]}</button>`;
    }).join('');
    bodyHtml = `<div class="quiz-prompt">È primitivo o derivato?</div><div class="quiz-word">${c.item.w}</div><div class="options-grid">${optsHtml}</div>`;
  } else if(c.kind==='analisi'){
    const optsHtml = c.options.map(opt=>{
      let cls='option-btn';
      if(g.answered){ if(opt===c.word[c.sq.field]) cls+=' correct'; else if(opt===g.chosen) cls+=' wrong'; }
      return `<button class="${cls}" ${g.answered?'disabled':''} onclick="answerSfidaMista('${opt}')">${c.sq.labels[opt]}</button>`;
    }).join('');
    bodyHtml = `<div class="quiz-prompt">${c.sq.q}</div><div class="quiz-word">${c.word.w}</div><div class="options-grid">${optsHtml}</div>`;
  }
  return `
  ${progressHeader('Domanda '+(g.qIndex+1)+' di '+g.total, 'Punteggio: '+g.score)}
  <div class="quiz-card">
    ${bodyHtml}
    ${g.answered ? feedbackBlock(g.lastCorrect, null, 'nextSfidaMistaBtn()') : ''}
  </div>`;
}
function answerSfidaMista(value){
  const g = state.game;
  if(g.answered) return;
  const c = g.current;
  let correct = false;
  if(c.kind==='checose') correct = value===c.word.t;
  else if(c.kind==='intruso') correct = value===c.intruder.w;
  else if(c.kind==='misteriosa') correct = value===c.sentence[c.tokenIndex].t;
  else if(c.kind==='primitivi') correct = value===c.item.tipo;
  else if(c.kind==='analisi') correct = value===c.word[c.sq.field];
  g.answered = true;
  g.chosen = value;
  g.lastCorrect = correct;
  if(correct){ g.score++; addXP(10); }
  recordAnswer(correct, 'sfidamista:'+c.kind);
  render();
}
function nextSfidaMistaBtn(){
  state.game.qIndex++;
  if(state.game.qIndex < state.game.total) nextSfidaMistaQuestion();
  else finishRound();
  render();
}
