/* ============ CHE COS'È — scelta dello stile ============ */
function goCheCosEChoose(){ state.view='checoseChoose'; render(); }
function viewCheCosEChoose(){
  return `
  <h2>Che cos'è?</h2>
  <p class="hint">Scegli come vuoi giocare.</p>
  <div class="mode-list">
    <button class="mode-card" onclick="startLampo()"><span class="emoji">⚡</span><div class="txt"><strong>A tempo</strong><span>60 secondi, più risposte puoi dare</span></div></button>
    <button class="mode-card" onclick="startCheCosE()"><span class="emoji">🎯</span><div class="txt"><strong>Classica</strong><span>10 domande, senza fretta</span></div></button>
    <button class="mode-card" onclick="startMostro()"><span class="emoji">🐉</span><div class="txt"><strong>Contro il mostro</strong><span>Rispondi bene per sconfiggerlo</span></div></button>
    <button class="mode-card" onclick="startParolaMisteriosa()"><span class="emoji">🔍</span><div class="txt"><strong>Dentro una frase</strong><span>Trova la parola evidenziata nel contesto</span></div></button>
    <button class="mode-card" onclick="startOrdina()"><span class="emoji">🗂️</span><div class="txt"><strong>Ordina</strong><span>Smista più parole insieme nel contenitore giusto</span></div></button>
    <button class="mode-card" onclick="startRollRead()"><span class="emoji">🎲</span><div class="txt"><strong>Tira e leggi</strong><span>Tira il dado, leggi la parola, rispondi</span></div></button>
  </div>`;
}

/* ============ TIRA E LEGGI (dado + griglia di 6 parole) ============ */
const ROLLREAD_TOTAL = 8;
function startRollRead(){
  state.gameMode='rollread';
  state.view='game';
  const tipiList = activeTipiList();
  const pool = wordsByTipi(tipiList);
  const words = shuffle(pool).slice(0,6);
  state.rollread = {words, qIndex:0, total:ROLLREAD_TOTAL, score:0, rolling:false, landedIdx:null, current:null};
  render();
}
function rollDice(){
  const r = state.rollread;
  if(r.rolling) return;
  r.rolling = true;
  render();
  setTimeout(()=>{
    const idx = Math.floor(Math.random()*r.words.length);
    r.rolling = false;
    r.landedIdx = idx;
    const tipiList = activeTipiList();
    const options = tipiList.slice(); // ordine fisso: le etichette sono sempre le stesse, mescolarle è solo fastidioso
    r.current = {word:r.words[idx], options, answered:false, chosen:null};
    render();
  }, 500);
}
function viewRollRead(){
  const r = state.rollread;
  if(r.qIndex >= r.total){
    return roundSummary(r.score, r.total, 'rollread');
  }
  const gridHtml = r.words.map((w,idx)=>{
    const cls = idx===r.landedIdx ? 'rollread-cell landed' : 'rollread-cell';
    return `<div class="${cls}"><span class="rollread-num">${idx+1}</span>${w.w}</div>`;
  }).join('');
  let bottomHtml;
  if(r.rolling){
    bottomHtml = `<p class="hint" style="text-align:center">🎲 Tirando...</p>`;
  } else if(!r.current){
    bottomHtml = `<button class="btn btn-coral" style="width:100%" onclick="rollDice()">🎲 Tira il dado</button>`;
  } else {
    const c = r.current;
    const optsHtml = c.options.map(t=>{
      let cls='option-btn';
      if(c.answered){ if(t===c.word.t) cls+=' correct'; else if(t===c.chosen) cls+=' wrong'; }
      return `<button class="${cls}" ${c.answered?'disabled':''} onclick="answerRollRead('${t}')">${TIPI_LABELS[t]}</button>`;
    }).join('');
    bottomHtml = `
    <div class="quiz-prompt">Che cos'è...</div>
    <div class="quiz-word">${c.word.w}</div>
    <div class="options-grid">${optsHtml}</div>
    ${c.answered ? feedbackBlock(c.chosen===c.word.t, null, 'nextRollReadBtn()') : ''}`;
  }
  return `
  <div class="progress-line">Tiro ${r.qIndex+1} di ${r.total} · Punteggio: ${r.score}</div>
  <div class="rollread-grid">${gridHtml}</div>
  <div class="quiz-card">${bottomHtml}</div>`;
}
function answerRollRead(t){
  const c = state.rollread.current;
  if(c.answered) return;
  c.answered=true; c.chosen=t;
  const correct = t===c.word.t;
  if(correct){ state.rollread.score++; addXP(10); }
  recordAnswer(correct, 'rollread');
  render();
}
function nextRollReadBtn(){
  const r = state.rollread;
  r.qIndex++;
  r.current = null;
  r.landedIdx = null;
  render();
}

/* ============ ORDINA (smista più parole insieme nei contenitori giusti) ============ */
const ORDINA_WORDS_COUNT = 8;
function startOrdina(){
  state.gameMode='ordina';
  state.view='game';
  const tipiList = activeTipiList();
  const pool = wordsByTipi(tipiList);
  const words = shuffle(pool).slice(0, ORDINA_WORDS_COUNT).map(w=>({word:w, placed:false, wrongFlash:false}));
  state.ordina = {
    words,
    bins: tipiList,
    selectedIdx: null,
    placedCount: 0,
    mistakes: 0,
  };
  render();
}
function viewOrdina(){
  const o = state.ordina;
  if(o.placedCount === o.words.length){
    return `
    <div class="quiz-card">
      <h2>🎉 Tutte smistate!</h2>
      <p>Errori fatti: ${o.mistakes}</p>
      <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-top:14px">
        <button class="btn btn-coral" onclick="startOrdina()">Gioca ancora</button>
        <button class="btn btn-ghost" onclick="goCheCosEChoose()">Altre sfide</button>
      </div>
    </div>`;
  }
  const poolHtml = o.words.map((item, idx)=>{
    if(item.placed) return '';
    let cls = 'ordina-chip';
    if(idx===o.selectedIdx) cls += ' selected';
    if(item.wrongFlash) cls += ' wrong';
    return `<button class="${cls}" onclick="selectOrdinaWord(${idx})">${item.word.w}</button>`;
  }).join('');
  const binsHtml = o.bins.map(tipo=>{
    const placedHere = o.words.filter(w=>w.placed && w.word.t===tipo).map(w=>w.word.w);
    return `
    <button class="ordina-bin" onclick="placeInOrdinaBin('${tipo}')">
      <div class="ordina-bin-label">${TIPI_LABELS[tipo]}</div>
      <div class="ordina-bin-items">${placedHere.join(', ') || '—'}</div>
    </button>`;
  }).join('');
  return `
  <div class="progress-line">Da smistare: ${o.words.length - o.placedCount} · Errori: ${o.mistakes}</div>
  <p class="hint" style="text-align:center">Tocca una parola, poi tocca il contenitore giusto.</p>
  <div class="ordina-pool">${poolHtml}</div>
  <div class="ordina-bins">${binsHtml}</div>`;
}
function selectOrdinaWord(idx){
  state.ordina.selectedIdx = idx;
  render();
}
function placeInOrdinaBin(tipo){
  const o = state.ordina;
  if(o.selectedIdx===null) return;
  const item = o.words[o.selectedIdx];
  const correct = item.word.t === tipo;
  recordAnswer(correct, 'ordina');
  if(correct){
    item.placed = true;
    o.placedCount++;
    addXP(10);
    o.selectedIdx = null;
  } else {
    o.mistakes++;
    item.wrongFlash = true;
    o.selectedIdx = null;
    setTimeout(()=>{ item.wrongFlash = false; render(); }, 600);
  }
  render();
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
  const options = tipiList.slice(); // ordine fisso: le etichette sono sempre le stesse, mescolarle è solo fastidioso
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
