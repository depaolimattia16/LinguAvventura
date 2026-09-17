/* ============ MODALITÀ CLASSE ============ */
function goClassroomChoose(){ clearIntervals(); state.view='classroomChoose'; render(); }
function viewClassroomChoose(){
  return `
  <h2>Modalità classe</h2>
  <p class="hint">Scegli come usarla alla LIM.</p>
  <div class="mode-list">
    <button class="mode-card" onclick="startClassroomShared()"><span class="emoji">📺</span><div class="txt"><strong>Schermo condiviso</strong><span>Una domanda per tutti, vince la prima squadra ad arrivare a 10 punti</span></div></button>
    <button class="mode-card" onclick="goClassroomSplitChoose()"><span class="emoji">⚔️</span><div class="txt"><strong>Squadra contro squadra</strong><span>Schermo diviso a metà, a tempo: scegli tu il contenuto</span></div></button>
  </div>`;
}

/* --- Schermo condiviso: nessun timer, si va avanti a mano, vince chi arriva prima a 10 --- */
const CLASSROOM_WIN_SCORE = 10;
const TEAM_META = {
  blu:{label:'Blu', emoji:'🔵'},
  rosso:{label:'Rosso', emoji:'🔴'},
  verde:{label:'Verde', emoji:'🟢'},
};
function startClassroomShared(){
  clearIntervals();
  state.view='classroom';
  state.classTeam={blu:0,rosso:0,verde:0};
  state.classWinner=null;
  state.game = {};
  nextClassroomWord();
  render();
}
function nextClassroomWord(){
  const tipiList = activeTipiList();
  const pool = wordsByTipi(tipiList);
  const word = pickRandom(pool);
  const options = shuffle(tipiList.slice());
  state.game.current = {word, options, answered:false};
}
function viewClassroom(){
  const team = state.classTeam;
  if(state.classWinner){
    const w = TEAM_META[state.classWinner];
    return `
    <div class="quiz-card">
      <h2>🏆 Ha vinto la squadra ${w.emoji} ${w.label}!</h2>
      <div class="team-row">
        <div class="team-box team-blu"><div>🔵 Blu</div><div class="score">${team.blu}</div></div>
        <div class="team-box team-rosso"><div>🔴 Rosso</div><div class="score">${team.rosso}</div></div>
        <div class="team-box team-verde"><div>🟢 Verde</div><div class="score">${team.verde}</div></div>
      </div>
      <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-top:16px">
        <button class="btn btn-coral" onclick="startClassroomShared()">Nuova partita</button>
        <button class="btn btn-ghost" onclick="goClassroomChoose()">Cambia modalità</button>
      </div>
    </div>`;
  }
  if(!state.game.current) nextClassroomWord();
  const c = state.game.current;
  const optsHtml = c.options.map(t=>{
    let cls='option-btn';
    if(c.answered && t===c.word.t) cls+=' correct';
    return `<button class="${cls}" onclick="revealClassroom('${t}')">${TIPI_LABELS[t]}</button>`;
  }).join('');
  return `
  <p class="hint" style="text-align:center">Vince la prima squadra che arriva a ${CLASSROOM_WIN_SCORE} punti.</p>
  <div class="quiz-card">
    <div class="quiz-prompt">Che cos'è...</div>
    <div class="quiz-word" style="font-size:clamp(2.2rem,10vw,3.4rem)">${c.word.w}</div>
    <div class="options-grid">${optsHtml}</div>
    ${c.answered ? `<p class="feedback ok" style="margin-top:14px">La risposta corretta è: ${TIPI_LABELS[c.word.t]}</p><button class="btn btn-ink" style="margin-top:6px" onclick="nextClassroomBtn()">Parola successiva →</button>` : ''}
  </div>
  <div class="team-row">
    <div class="team-box team-blu"><div>🔵 Blu</div><div class="score">${team.blu}</div><button class="btn btn-ink" onclick="addTeamPoint('blu')">+1 punto</button></div>
    <div class="team-box team-rosso"><div>🔴 Rosso</div><div class="score">${team.rosso}</div><button class="btn btn-coral" onclick="addTeamPoint('rosso')">+1 punto</button></div>
    <div class="team-box team-verde"><div>🟢 Verde</div><div class="score">${team.verde}</div><button class="btn btn-grass" onclick="addTeamPoint('verde')">+1 punto</button></div>
  </div>`;
}
function revealClassroom(){
  state.game.current.answered = true;
  render();
}
function nextClassroomBtn(){ nextClassroomWord(); render(); }
function addTeamPoint(team){
  if(state.classWinner) return;
  state.classTeam[team]++;
  if(state.classTeam[team] >= CLASSROOM_WIN_SCORE){
    state.classWinner = team;
  }
  render();
}

/* --- Squadra contro squadra: schermo diviso, a tempo, avanza da sola, contenuto a scelta --- */
const SPLIT_ANSWER_SECONDS = 10;
const SPLIT_REVEAL_SECONDS = 2;
const SPLIT_TEAMS = {
  blu:{label:'Blu', emoji:'🔵', cls:'blu'},
  rosso:{label:'Rosso', emoji:'🔴', cls:'rosso'},
};
const SPLIT_CONTENT_TYPES = {
  checose:{label:"Che cos'è?", emoji:'❓'},
  primitivi:{label:'Primitivi e derivati', emoji:'🌱'},
  cege:{label:'Ortografia: Ce/Cie - Ge/Gie', emoji:'🔤'},
  scesci:{label:'Ortografia: Sce - Sci', emoji:'🔤'},
  glili:{label:'Ortografia: Gli - Li', emoji:'🔤'},
  cuqu:{label:'Ortografia: Cu/Qu/Cqu/Qqu', emoji:'🔤'},
  doppie:{label:'Ortografia: Le doppie', emoji:'🔤'},
  letterah:{label:'Ortografia: La lettera H', emoji:'🔤'},
};
function goClassroomSplitChoose(){
  clearIntervals();
  if(!state.splitContentTypes) state.splitContentTypes = ['checose'];
  state.view='classroomSplitChoose';
  render();
}
function viewClassroomSplitChoose(){
  const selected = state.splitContentTypes;
  const rows = Object.keys(SPLIT_CONTENT_TYPES).map(k=>{
    const meta = SPLIT_CONTENT_TYPES[k];
    const checked = selected.includes(k);
    return `<label class="check-row"><input type="checkbox" ${checked?'checked':''} onchange="toggleSplitContent('${k}')"> ${meta.emoji} ${meta.label}</label>`;
  }).join('');
  return `
  <h2>Squadra contro squadra</h2>
  <p class="hint">Scegli su cosa far sfidare le due squadre. Puoi selezionarne più di uno: si mescoleranno, e ogni squadra pesca in autonomia.</p>
  <div class="settings-block">${rows}</div>
  <button class="btn btn-coral" style="margin-top:16px" onclick="startClassroomSplit()">Inizia sfida</button>`;
}
function toggleSplitContent(k){
  const list = state.splitContentTypes;
  const idx = list.indexOf(k);
  if(idx>=0){
    if(list.length<=1){ showToast('Deve restare selezionato almeno un contenuto'); return; }
    list.splice(idx,1);
  } else {
    list.push(k);
  }
  render();
}
function startClassroomSplit(){
  clearIntervals();
  state.view='classroomSplit';
  if(!state.splitContentTypes || state.splitContentTypes.length===0) state.splitContentTypes=['checose'];
  state.split = {
    blu:{score:0, current:null, phase:'answering', timeLeft:SPLIT_ANSWER_SECONDS},
    rosso:{score:0, current:null, phase:'answering', timeLeft:SPLIT_ANSWER_SECONDS},
  };
  loadSplitWord('blu');
  loadSplitWord('rosso');
  state.splitIntervalId = setInterval(splitTick, 1000);
  render();
}
function loadSplitWord(side){
  const type = pickRandom(state.splitContentTypes);
  const s = state.split[side];
  if(type==='checose'){
    const tipiList = activeTipiList();
    const pool = wordsByTipi(tipiList);
    const word = pickRandom(pool);
    const options = shuffle(tipiList.slice());
    s.current = {kind:'grammar', display:word.w, correct:word.t, options, labels:TIPI_LABELS};
  } else if(type==='primitivi'){
    const primitivi = PRIMITIVI_DERIVATI.filter(w=>w.tipo==='primitivo');
    const derivati = PRIMITIVI_DERIVATI.filter(w=>w.tipo==='derivato');
    const item = Math.random() < 0.5 ? pickRandom(primitivi) : pickRandom(derivati);
    const options = shuffle(['primitivo','derivato']);
    s.current = {kind:'grammar', display:item.w, correct:item.tipo, options, labels:PRIMDERIV_LABELS};
  } else {
    const topic = ORTHO_TOPICS[type];
    const item = pickRandom(topic.bank);
    const options = shuffle([item.ok, item.bad]);
    s.current = {kind:'ortho', orthoMode:topic.mode, item, options};
  }
  s.answered = false;
  s.chosen = null;
  s.phase = 'answering';
  s.timeLeft = SPLIT_ANSWER_SECONDS;
}
function splitTick(){
  ['blu','rosso'].forEach(side=>{
    const s = state.split[side];
    s.timeLeft--;
    if(s.timeLeft <= 0){
      if(s.phase==='answering'){
        s.answered = true;
        s.phase = 'revealing';
        s.timeLeft = SPLIT_REVEAL_SECONDS;
      } else {
        loadSplitWord(side);
      }
    }
  });
  render();
}
function splitColumnHtml(side){
  const meta = SPLIT_TEAMS[side];
  const s = state.split[side];
  const c = s.current;
  let bodyHtml = '';
  if(c.kind==='grammar'){
    const optsHtml = c.options.map(opt=>{
      let cls='option-btn';
      if(s.answered){
        if(opt===c.correct) cls+=' correct';
        else if(opt===s.chosen) cls+=' wrong';
      }
      return `<button class="${cls}" ${s.answered?'disabled':''} onclick="answerSplit('${side}','${opt}')">${c.labels[opt]}</button>`;
    }).join('');
    bodyHtml = `<div class="quiz-word" style="font-size:clamp(1.5rem,6vw,2.1rem)">${c.display}</div><div class="options-grid-single">${optsHtml}</div>`;
  } else {
    const wordText = c.orthoMode==='transform' ? c.item.s : (c.orthoMode==='sentence' ? c.item.sentence : '');
    const optsHtml = c.options.map(opt=>{
      let cls='option-btn';
      if(s.answered){
        if(opt===c.item.ok) cls+=' correct';
        else if(opt===s.chosen) cls+=' wrong';
      }
      return `<button class="${cls}" ${s.answered?'disabled':''} onclick="answerSplit('${side}','${opt}')">${opt}</button>`;
    }).join('');
    bodyHtml = `${wordText ? `<div class="quiz-word" style="font-size:clamp(1.2rem,4.5vw,1.6rem)">${wordText}</div>` : ''}<div class="options-grid-single">${optsHtml}</div>`;
  }
  const timerLabel = s.phase==='answering' ? `⏱ ${s.timeLeft}s` : `Prossima tra ${s.timeLeft}...`;
  return `
  <div class="split-col ${meta.cls}">
    <h3>${meta.emoji} Squadra ${meta.label}</h3>
    <div class="split-score">${s.score}</div>
    <div class="hint">${timerLabel}</div>
    ${bodyHtml}
  </div>`;
}
function viewClassroomSplit(){
  const types = state.splitContentTypes;
  const contentLabel = types.length<=2
    ? types.map(t=>SPLIT_CONTENT_TYPES[t].label).join(' + ')
    : `${types.length} contenuti mescolati`;
  return `
  <p class="hint" style="text-align:center">${contentLabel} · ogni squadra risponde alla propria domanda, le parole cambiano da sole.</p>
  <div class="split-row">
    ${splitColumnHtml('blu')}
    ${splitColumnHtml('rosso')}
  </div>
  <div style="text-align:center;margin-top:16px;display:flex;gap:10px;justify-content:center;flex-wrap:wrap">
    <button class="btn btn-ghost" onclick="resetSplit()">Azzera punteggio</button>
    <button class="btn btn-ghost" onclick="goClassroomSplitChoose()">Cambia contenuto</button>
  </div>`;
}
function answerSplit(side, value){
  const s = state.split[side];
  if(s.phase!=='answering' || s.answered) return;
  const c = s.current;
  const correct = c.kind==='grammar' ? value===c.correct : value===c.item.ok;
  s.answered = true;
  s.chosen = value;
  if(correct) s.score++;
  s.phase = 'revealing';
  s.timeLeft = SPLIT_REVEAL_SECONDS;
  render();
}
function resetSplit(){
  state.split.blu.score = 0;
  state.split.rosso.score = 0;
  loadSplitWord('blu');
  loadSplitWord('rosso');
  render();
}
