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

/* Ordina un elenco di chiavi in base all'etichetta italiana corrispondente (es. TIPI_LABELS),
   così i sotto-menu si presentano sempre in ordine alfabetico anche se i dati sono in un altro ordine.
   Ignora un eventuale articolo iniziale (il/lo/la/l'/i/gli/le/un/uno/una) SOLO se seguito da una vera
   parola (es. "Il nome" -> "nome"), non quando la parola è essa stessa il nome di un argomento
   (es. "Gli - Li" resta com'è: qui "Gli" non è un articolo, è il suono di cui si parla). */
function stripLeadingArticle(s){
  const m = s.match(/^(il|lo|la|i|gli|le|un|uno|una)\s+(.+)$/i);
  if(m && /^[a-zàèéìòù]/.test(m[2])) return m[2];
  const m2 = s.match(/^l['’](.+)$/i);
  if(m2) return m2[1];
  return s;
}
function sortedKeysByLabel(keys, labelsMap){
  return [...keys].sort((a,b)=> stripLeadingArticle(labelsMap[a]||a).localeCompare(stripLeadingArticle(labelsMap[b]||b), 'it'));
}

/* Rende sicuro un testo (es. una parola con l'apostrofo, come "un'amica") per essere inserito
   dentro un attributo onclick="...('testo')": senza questo, l'apostrofo del testo chiuderebbe
   la stringa JS a metà e il click smetterebbe di funzionare per quella domanda. */
function escJs(str){
  return String(str).replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

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
    rollread:'goCheCosEChoose',
    sincontr:'goLessicoChoose',
    alterati:'goLessicoChoose',
    composti:'goLessicoChoose',
    ortografia:'goOrtografiaChoose',
    ortografiaMista:'goOrtografiaMistaChoose',
    anagramma:'goOrtografiaChoose',
  };
  return map[mode] || 'goModeSelect';
}
function roundSummary(score,total,mode){
  return `
  ${score===total && total>0 ? confettiHtml() : ''}
  <div class="quiz-card">
    <h2>Round completato!</h2>
    <div class="quiz-word" style="font-size:2.4rem">${score} / ${total}</div>
    <p>${score===total && total>0 ? 'Tutto giusto, fantastico! 🎉' : 'Ottimo lavoro, continua così!'}</p>
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
  else if(mode==='rollread') startRollRead();
  else if(mode==='sincontr') startSinContr();
  else if(mode==='alterati') startAlterati();
  else if(mode==='composti') startComposti();
  else if(mode==='anagramma') startAnagramma();
  else if(mode==='sfidamista') startSfidaMista();
}

/* Un po' di coriandoli per le schermate di vittoria (posizione e tempi casuali ad ogni chiamata). */
function confettiHtml(){
  const emojis = ['🎉','✨','🎊','⭐','🎈'];
  let out = '<div class="confetti-wrap">';
  for(let i=0;i<14;i++){
    const left = Math.round(Math.random()*94);
    const delay = (Math.random()*0.5).toFixed(2);
    const dur = (1.4 + Math.random()*0.7).toFixed(2);
    out += `<span class="confetti-piece" style="left:${left}%;animation-delay:${delay}s;animation-duration:${dur}s">${emojis[i % emojis.length]}</span>`;
  }
  out += '</div>';
  return out;
}
