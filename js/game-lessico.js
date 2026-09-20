/* ============ LESSICO (sinonimi/contrari, nomi alterati, nomi composti) ============ */
function goLessicoChoose(){ state.view='lessicoChoose'; render(); }
function viewLessicoChoose(){
  return `
  <h2>Lessico</h2>
  <p class="hint">Il significato delle parole, non la loro grammatica.</p>
  <div class="mode-list">
    <button class="mode-card" onclick="startAlterati()"><span class="emoji">🔎</span><div class="txt"><strong>Nomi alterati</strong><span>Accrescitivo, diminutivo, vezzeggiativo o dispregiativo?</span></div></button>
    <button class="mode-card" onclick="startComposti()"><span class="emoji">🧩</span><div class="txt"><strong>Nomi composti</strong><span>Semplice o composto da due parole?</span></div></button>
    <button class="mode-card" onclick="startSinContr()"><span class="emoji">🔀</span><div class="txt"><strong>Sinonimi e contrari</strong><span>Questa coppia di parole cosa sono?</span></div></button>
  </div>`;
}

/* --- Sinonimi e contrari --- */
function startSinContr(){
  state.gameMode='sincontr';
  state.game = {qIndex:0, total:10, score:0};
  nextSinContr();
  state.view='game'; render();
}
function nextSinContr(){
  const kind = Math.random()<0.5 ? 'sinonimi' : 'contrari';
  const pair = pickRandom(SINONIMI_CONTRARI[kind]);
  state.game.current = {pair, kind, answered:false, chosen:null};
}
function viewSinContr(){
  const g = state.game;
  if(g.qIndex >= g.total) return roundSummary(g.score, g.total, 'sincontr');
  const c = g.current;
  const optsHtml = Object.keys(SINCONTR_LABELS).map(k=>{
    let cls='option-btn';
    if(c.answered){ if(k===c.kind) cls+=' correct'; else if(k===c.chosen) cls+=' wrong'; }
    return `<button class="${cls}" ${c.answered?'disabled':''} onclick="answerSinContr('${k}')">${SINCONTR_LABELS[k]}</button>`;
  }).join('');
  return `
  <div class="progress-line">Round ${g.qIndex+1} di ${g.total} · Punteggio: ${g.score}</div>
  <div class="quiz-card">
    <div class="quiz-prompt">Che rapporto c'è tra queste due parole?</div>
    <div class="quiz-word" style="font-size:1.7rem">${c.pair[0]} &nbsp;/&nbsp; ${c.pair[1]}</div>
    <div class="options-grid">${optsHtml}</div>
    ${c.answered ? feedbackBlock(c.chosen===c.kind, null, 'nextSinContrBtn()') : ''}
  </div>`;
}
function answerSinContr(k){
  const c = state.game.current;
  if(c.answered) return;
  c.answered=true; c.chosen=k;
  const correct = k===c.kind;
  if(correct){ state.game.score++; addXP(10); }
  recordAnswer(correct, 'sincontr');
  render();
}
function nextSinContrBtn(){
  state.game.qIndex++;
  if(state.game.qIndex < state.game.total) nextSinContr();
  render();
}

/* --- Nomi alterati --- */
function startAlterati(){
  state.gameMode='alterati';
  state.game = {qIndex:0, total:10, score:0};
  nextAlterati();
  state.view='game'; render();
}
function nextAlterati(){
  const item = pickRandom(NOMI_ALTERATI);
  const options = Object.keys(ALTERATO_LABELS); // ordine fisso, sempre le stesse quattro etichette
  state.game.current = {item, options, answered:false, chosen:null};
}
function viewAlterati(){
  const g = state.game;
  if(g.qIndex >= g.total) return roundSummary(g.score, g.total, 'alterati');
  const c = g.current;
  const optsHtml = c.options.map(k=>{
    let cls='option-btn';
    if(c.answered){ if(k===c.item.tipo) cls+=' correct'; else if(k===c.chosen) cls+=' wrong'; }
    return `<button class="${cls}" ${c.answered?'disabled':''} onclick="answerAlterati('${k}')">${ALTERATO_LABELS[k]}</button>`;
  }).join('');
  return `
  <div class="progress-line">Round ${g.qIndex+1} di ${g.total} · Punteggio: ${g.score}</div>
  <div class="quiz-card">
    <div class="quiz-prompt">Che tipo di alterazione è questa parola?</div>
    <div class="quiz-word">${c.item.w}</div>
    <div class="options-grid">${optsHtml}</div>
    ${c.answered ? `<p class="hint" style="margin-top:8px">Viene da "${c.item.base}".</p>${feedbackBlock(c.chosen===c.item.tipo, null, 'nextAlteratiBtn()')}` : ''}
  </div>`;
}
function answerAlterati(k){
  const c = state.game.current;
  if(c.answered) return;
  c.answered=true; c.chosen=k;
  const correct = k===c.item.tipo;
  if(correct){ state.game.score++; addXP(10); }
  recordAnswer(correct, 'alterati');
  render();
}
function nextAlteratiBtn(){
  state.game.qIndex++;
  if(state.game.qIndex < state.game.total) nextAlterati();
  render();
}

/* --- Nomi composti --- */
function startComposti(){
  state.gameMode='composti';
  state.game = {qIndex:0, total:10, score:0};
  nextComposti();
  state.view='game'; render();
}
function nextComposti(){
  const isComposto = Math.random()<0.5;
  const item = isComposto ? pickRandom(NOMI_COMPOSTI.composti) : {w:pickRandom(NOMI_COMPOSTI.semplici)};
  state.game.current = {item, tipo:isComposto?'composto':'semplice', answered:false, chosen:null};
}
function viewComposti(){
  const g = state.game;
  if(g.qIndex >= g.total) return roundSummary(g.score, g.total, 'composti');
  const c = g.current;
  const optsHtml = Object.keys(SEMPCOMP_LABELS).map(k=>{
    let cls='option-btn';
    if(c.answered){ if(k===c.tipo) cls+=' correct'; else if(k===c.chosen) cls+=' wrong'; }
    return `<button class="${cls}" ${c.answered?'disabled':''} onclick="answerComposti('${k}')">${SEMPCOMP_LABELS[k]}</button>`;
  }).join('');
  return `
  <div class="progress-line">Round ${g.qIndex+1} di ${g.total} · Punteggio: ${g.score}</div>
  <div class="quiz-card">
    <div class="quiz-prompt">Semplice o composto?</div>
    <div class="quiz-word">${c.item.w}</div>
    <div class="options-grid">${optsHtml}</div>
    ${c.answered && c.item.parti ? `<p class="hint" style="margin-top:8px">Viene da "${c.item.parti[0]}" + "${c.item.parti[1]}".</p>` : ''}
    ${c.answered ? feedbackBlock(c.chosen===c.tipo, null, 'nextCompostiBtn()') : ''}
  </div>`;
}
function answerComposti(k){
  const c = state.game.current;
  if(c.answered) return;
  c.answered=true; c.chosen=k;
  const correct = k===c.tipo;
  if(correct){ state.game.score++; addXP(10); }
  recordAnswer(correct, 'composti');
  render();
}
function nextCompostiBtn(){
  state.game.qIndex++;
  if(state.game.qIndex < state.game.total) nextComposti();
  render();
}
