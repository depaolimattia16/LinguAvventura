/* ============ ORTOGRAFIA: più regole ============ */
/* Le liste di parole (bank) sono caricate da data/ortografia.json (vedi js/app.js) */
const ORTHO_TOPICS = {
  cege:{label:'Ce/Cie - Ge/Gie', mode:'transform', bank:[]},
  scesci:{label:'Sce - Sci', mode:'pick', bank:[]},
  glili:{label:'Gli - Li', mode:'pick', bank:[]},
  cuqu:{label:'Cu - Qu - Cqu - Qqu', mode:'pick', bank:[]},
  doppie:{label:'Le doppie', mode:'pick', bank:[]},
  letterah:{label:'La lettera H', mode:'sentence', bank:[]},
  sillabe:{label:'Divisione in sillabe', mode:'pick', bank:[]},
  accento:{label:'Accento', mode:'sentence', bank:[]},
  apostrofo:{label:'Apostrofo', mode:'pick', bank:[]},
  punteggiatura:{label:'Punteggiatura', mode:'sentence', bank:[]},
};
function fillOrthoBanks(data){
  Object.keys(ORTHO_TOPICS).forEach(k=>{ ORTHO_TOPICS[k].bank = data[k] || []; });
}
function goOrtografiaChoose(){ state.view='ortografiaChoose'; render(); }
function viewOrtografiaChoose(){
  const cards = Object.keys(ORTHO_TOPICS).map(k=>{
    const n = ORTHO_TOPICS[k].bank.length;
    return `<button class="mode-card" onclick="startOrtografiaTopic('${k}')"><span class="emoji">🔤</span><div class="txt"><strong>${ORTHO_TOPICS[k].label}</strong><span>${n} esempi</span></div></button>`;
  }).join('');
  return `
  <h2>Ortografia</h2>
  <p class="hint">Scegli su quale regola vuoi allenarti.</p>
  <div class="mode-list">
    <button class="mode-card" onclick="goOrtografiaMistaChoose()"><span class="emoji">🎲</span><div class="txt"><strong>Sfida mista</strong><span>Mescola le regole che vuoi</span></div></button>
    <button class="mode-card" onclick="startAnagramma()"><span class="emoji">🔡</span><div class="txt"><strong>Anagramma</strong><span>Ricomponi la parola con le lettere mescolate</span></div></button>
    ${cards}
  </div>`;
}

/* --- Sfida mista di ortografia: checkbox per scegliere quali regole mescolare --- */
function goOrtografiaMistaChoose(){
  if(!state.orthoMistaTypes) state.orthoMistaTypes = Object.keys(ORTHO_TOPICS).slice();
  state.view='ortografiaMistaChoose';
  render();
}
function viewOrtografiaMistaChoose(){
  const selected = state.orthoMistaTypes;
  const rows = Object.keys(ORTHO_TOPICS).map(k=>{
    const checked = selected.includes(k);
    return `<label class="check-row"><input type="checkbox" ${checked?'checked':''} onchange="toggleOrthoMistaType('${k}')"> ${ORTHO_TOPICS[k].label}</label>`;
  }).join('');
  return `
  <h2>Sfida mista di ortografia</h2>
  <p class="hint">Scegli quali regole mescolare (di default sono tutte attive).</p>
  <div class="settings-block">${rows}</div>
  <button class="btn btn-coral" style="margin-top:16px" onclick="startOrtografiaMista()">Inizia sfida</button>`;
}
function toggleOrthoMistaType(k){
  const list = state.orthoMistaTypes;
  const idx = list.indexOf(k);
  if(idx>=0){
    if(list.length<=1){ showToast('Deve restare selezionata almeno una regola'); return; }
    list.splice(idx,1);
  } else {
    list.push(k);
  }
  render();
}
function startOrtografiaMista(){
  state.gameMode='ortografiaMista';
  if(!state.orthoMistaTypes || state.orthoMistaTypes.length===0) state.orthoMistaTypes = Object.keys(ORTHO_TOPICS).slice();
  state.game={qIndex:0,total:10,score:0};
  nextOrtografiaMistaQuestion();
  state.view='game'; render();
}
function nextOrtografiaMistaQuestion(){
  const topicKey = pickRandom(state.orthoMistaTypes);
  const topic = ORTHO_TOPICS[topicKey];
  const item = pickRandom(topic.bank);
  const options = shuffle([item.ok, item.bad]);
  state.game.current = {topicKey, topic, item, options, answered:false, chosen:null};
}
function viewOrtografiaMista(){
  const g = state.game;
  if(g.qIndex >= g.total){
    return roundSummary(g.score, g.total, 'ortografiaMista');
  }
  const c = g.current;
  const tileClass = c.topic.mode==='pick' ? 'word-tile' : 'option-btn';
  const optsHtml = c.options.map(opt=>{
    let cls = tileClass;
    if(c.answered){
      if(opt===c.item.ok) cls+=' correct';
      else if(opt===c.chosen) cls+=' wrong';
    }
    return `<button class="${cls}" ${c.answered?'disabled':''} onclick="answerOrtografiaMista('${opt}')">${opt}</button>`;
  }).join('');
  const promptText = c.topic.mode==='transform' ? "Qual è il plurale corretto di..." : (c.topic.mode==='sentence' ? '' : "Quale delle due è scritta bene?");
  const wordText = c.topic.mode==='transform' ? c.item.s : (c.topic.mode==='sentence' ? c.item.sentence : '');
  return `
  <div class="progress-line">${c.topic.label} · Domanda ${g.qIndex+1} di ${g.total} · Punteggio: ${g.score}</div>
  <div class="quiz-card">
    ${promptText ? `<div class="quiz-prompt">${promptText}</div>` : ''}
    ${wordText ? `<div class="quiz-word" style="${c.topic.mode==='sentence'?'font-size:1.5rem':''}">${wordText}</div>` : ''}
    <div class="${c.topic.mode==='pick'?'quiz-grid-4':'options-grid'}">${optsHtml}</div>
    ${c.answered ? feedbackBlock(c.chosen===c.item.ok, null, 'nextOrtografiaMistaBtn()') : ''}
  </div>`;
}
function answerOrtografiaMista(opt){
  const c = state.game.current;
  if(c.answered) return;
  c.answered=true; c.chosen=opt;
  const correct = opt===c.item.ok;
  if(correct){ state.game.score++; addXP(10); }
  recordAnswer(correct, 'ortografiaMista:'+c.topicKey);
  render();
}
function nextOrtografiaMistaBtn(){
  state.game.qIndex++;
  if(state.game.qIndex < state.game.total) nextOrtografiaMistaQuestion();
  else finishRound();
  render();
}
function startOrtografiaTopic(topicKey){
  state.gameMode='ortografia';
  state.game={topic:topicKey,qIndex:0,total:10,score:0};
  nextOrtografiaQuestion();
  state.view='game'; render();
}
function nextOrtografiaQuestion(){
  const bank = ORTHO_TOPICS[state.game.topic].bank;
  const item = pickRandom(bank);
  const options = shuffle([item.ok, item.bad]);
  state.game.current = {item, options, answered:false};
}
function viewOrtografia(){
  const g = state.game;
  const topic = ORTHO_TOPICS[g.topic];
  if(g.qIndex >= g.total){
    return roundSummary(g.score, g.total, 'ortografia');
  }
  const c = g.current;
  const tileClass = topic.mode==='pick' ? 'word-tile' : 'option-btn';
  const optsHtml = c.options.map(opt=>{
    let cls = tileClass;
    if(c.answered){
      if(opt===c.item.ok) cls+=' correct';
      else if(opt===c.chosen) cls+=' wrong';
    }
    return `<button class="${cls}" ${c.answered?'disabled':''} onclick="answerOrtografia('${opt}')">${opt}</button>`;
  }).join('');
  const promptText = topic.mode==='transform' ? "Qual è il plurale corretto di..." : (topic.mode==='sentence' ? '' : "Quale delle due è scritta bene?");
  const wordText = topic.mode==='transform' ? c.item.s : (topic.mode==='sentence' ? c.item.sentence : '');
  return `
  <div class="progress-line">${topic.label} · Domanda ${g.qIndex+1} di ${g.total} · Punteggio: ${g.score}</div>
  <div class="quiz-card">
    ${promptText ? `<div class="quiz-prompt">${promptText}</div>` : ''}
    ${wordText ? `<div class="quiz-word" style="${topic.mode==='sentence'?'font-size:1.5rem':''}">${wordText}</div>` : ''}
    <div class="${topic.mode==='pick'?'quiz-grid-4':'options-grid'}">${optsHtml}</div>
    ${c.answered ? feedbackBlock(c.chosen===c.item.ok, null, 'nextOrtografiaBtn()') : ''}
  </div>`;
}
function answerOrtografia(opt){
  const c = state.game.current;
  if(c.answered) return;
  c.answered=true; c.chosen=opt;
  const correct = opt===c.item.ok;
  if(correct){ state.game.score++; addXP(10); }
  recordAnswer(correct, 'ortografia:'+state.game.topic);
  render();
}
function nextOrtografiaBtn(){
  state.game.qIndex++;
  if(state.game.qIndex < state.game.total) nextOrtografiaQuestion();
  else finishRound();
  render();
}
