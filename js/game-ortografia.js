/* ============ ORTOGRAFIA: più regole ============ */
/* Le liste di parole (bank) sono caricate da data/ortografia.json (vedi js/app.js) */
const ORTHO_TOPICS = {
  cege:{label:'Ce/Cie - Ge/Gie', mode:'transform', bank:[]},
  scesci:{label:'Sce - Sci', mode:'pick', bank:[]},
  glili:{label:'Gli - Li', mode:'pick', bank:[]},
  cuqu:{label:'Cu - Qu - Cqu - Qqu', mode:'pick', bank:[]},
  doppie:{label:'Le doppie', mode:'pick', bank:[]},
  letterah:{label:'La lettera H', mode:'sentence', bank:[]},
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
  <div class="mode-list">${cards}</div>`;
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
  recordAnswer(correct);
  render();
}
function nextOrtografiaBtn(){
  state.game.qIndex++;
  if(state.game.qIndex < state.game.total) nextOrtografiaQuestion();
  else finishRound();
  render();
}
