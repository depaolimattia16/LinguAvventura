/* ============ HELPERS ============ */
function shuffle(arr){
  const a = arr.slice();
  for(let i=a.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1));
    [a[i],a[j]]=[a[j],a[i]];
  }
  return a;
}
function pickRandom(arr){ return arr[Math.floor(Math.random()*arr.length)]; }
function activeTipiList(){
  let list = Object.keys(settings.tipi).filter(k=>settings.tipi[k]);
  if(list.length < 2) list = Object.keys(settings.tipi);
  return list;
}
function wordsByTipi(list){ return WORDS.filter(w=>list.includes(w.t)); }

/* Condivise dai giochi a round (Che cos'è, Trova l'intruso, Ortografia...) */
function feedbackBlock(correct, _unused, nextFn){
  return `<div class="feedback ${correct?'ok':'bad'}">${correct?'✅ Giusto!':'❌ Non proprio...'}</div>
  <button class="btn btn-ink" style="margin-top:14px" onclick="${nextFn}">Avanti →</button>`;
}
function finishRound(){
  progress.giochiCompletati++;
  if(progress.giochiCompletati>=1) awardBadge('prima_sfida');
  saveProgress();
}
function modeBackTarget(mode){
  const map = {
    checose:'goCheCosEChoose',
    misteriosa:'goCheCosEChoose',
    ortografia:'goOrtografiaChoose',
    ortografiaMista:'goOrtografiaMistaChoose',
  };
  return map[mode] || 'goModeSelect';
}
function roundSummary(score,total,mode){
  return `
  <div class="quiz-card">
    <h2>Round completato!</h2>
    <div class="quiz-word" style="font-size:2.4rem">${score} / ${total}</div>
    <p>Ottimo lavoro, continua così!</p>
    <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-top:14px">
      <button class="btn btn-coral" onclick="restartMode('${mode}')">Rigioca</button>
      <button class="btn btn-ghost" onclick="${modeBackTarget(mode)}()">Altre sfide</button>
    </div>
  </div>`;
}
function restartMode(mode){
  if(mode==='checose') startCheCosE();
  else if(mode==='intruso') startIntruso();
  else if(mode==='ortografia') startOrtografiaTopic(state.game.topic);
  else if(mode==='ortografiaMista') startOrtografiaMista();
  else if(mode==='misteriosa') startParolaMisteriosa();
  else if(mode==='primitivi') startPrimitivi();
  else if(mode==='sfidamista') startSfidaMista();
}
