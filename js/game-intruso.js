/* ============ TROVA L'INTRUSO ============ */
function pickGroupedFour(items, keyFn){
  const groups = {};
  items.forEach(it=>{ const k=keyFn(it); (groups[k]=groups[k]||[]).push(it); });
  const keys = Object.keys(groups).filter(k=>groups[k].length>=3);
  if(keys.length===0) return null;
  const majorKey = pickRandom(keys);
  const otherKeys = Object.keys(groups).filter(k=>k!==majorKey && groups[k].length>=1);
  if(otherKeys.length===0) return null;
  const minorKey = pickRandom(otherKeys);
  const majoritySample = shuffle(groups[majorKey].slice()).slice(0,3);
  const minorityItem = pickRandom(groups[minorKey]);
  const four = shuffle([...majoritySample, minorityItem]);
  return {four, majorKey, minorKey, intruder:minorityItem, axisKeyFn:keyFn};
}
function buildIntrusoAxes(){
  const axes = [];
  if(activeTipiList().length>=2) axes.push('tipo');
  if(settings.tipi.nome && settings.nomiSkills.categoria) axes.push('categoria');
  if(settings.tipi.nome && settings.nomiSkills.forma) axes.push('forma');
  if(settings.tipi.nome && settings.nomiSkills.genere) axes.push('genere');
  if(settings.tipi.nome && settings.nomiSkills.numero) axes.push('numero');
  return axes;
}
function generateIntruso(){
  const axes = shuffle(buildIntrusoAxes());
  for(const axis of axes){
    let items, keyFn, labels;
    if(axis==='tipo'){ items=wordsByTipi(activeTipiList()); keyFn=w=>w.t; labels=TIPI_LABELS; }
    else { items=WORDS.filter(w=>w.t==='nome');
      if(axis==='categoria'){ keyFn=w=>w.cat; labels=CAT_LABELS; }
      else if(axis==='forma'){ keyFn=w=>w.forma; labels=FORMA_LABELS; }
      else if(axis==='genere'){ keyFn=w=>w.gen; labels=GEN_LABELS; }
      else { keyFn=w=>w.num; labels=NUM_LABELS; }
    }
    const res = pickGroupedFour(items, keyFn);
    if(res) return {...res, axis, labels};
  }
  return null;
}
function startIntruso(){
  state.gameMode='intruso';
  state.game={qIndex:0,total:10,score:0};
  const r = generateIntruso();
  if(!r){ state.game.error=true; state.view='game'; render(); return; }
  state.game.current = {...r, answered:false};
  state.view='game'; render();
}
function viewIntruso(){
  const g = state.game;
  if(g.error){
    return `<div class="quiz-card"><h2>Servono più argomenti</h2><p>Attiva almeno due tipi di parola, oppure più caratteristiche del nome, nella pagina Argomenti.</p><button class="btn btn-ink" onclick="goSettings()">Vai agli argomenti</button></div>`;
  }
  if(g.qIndex >= g.total){
    return roundSummary(g.score, g.total, 'intruso');
  }
  const c = g.current;
  const tilesHtml = c.four.map(item=>{
    let cls='word-tile';
    if(c.answered){
      if(item.w===c.intruder.w) cls+=' correct';
      else if(c.chosen && item.w===c.chosen.w) cls+=' wrong';
    }
    return `<button class="${cls}" ${c.answered?'disabled':''} onclick="answerIntruso('${item.w}')">${item.w}</button>`;
  }).join('');
  let reasonHtml='';
  if(c.answered){
    reasonHtml = `<p style="font-family:'Baloo 2';color:var(--ink-soft);margin-top:10px">Le altre avevano in comune: <strong>${c.labels[c.majorKey]}</strong>. "${c.intruder.w}" invece era: <strong>${c.labels[c.minorKey]}</strong>.</p>`;
  }
  return `
  <div class="progress-line">Round ${g.qIndex+1} di ${g.total} · Punteggio: ${g.score}</div>
  <div class="quiz-card">
    <div class="quiz-prompt">Qual è l'intruso?</div>
    <div class="quiz-grid-4">${tilesHtml}</div>
    ${reasonHtml}
    ${c.answered ? `<button class="btn btn-ink" style="margin-top:14px" onclick="nextIntrusoBtn()">Avanti →</button>` : ''}
  </div>`;
}
function answerIntruso(wStr){
  const c = state.game.current;
  if(c.answered) return;
  c.answered=true;
  c.chosen = c.four.find(it=>it.w===wStr);
  const correct = c.chosen.w===c.intruder.w;
  if(correct){ state.game.score++; addXP(10); }
  recordAnswer(correct, 'intruso:'+c.axis);
  render();
}
function nextIntrusoBtn(){
  state.game.qIndex++;
  if(state.game.qIndex < state.game.total){
    const r = generateIntruso();
    if(r) state.game.current = {...r, answered:false};
    else { state.game.error=true; }
  } else finishRound();
  render();
}
