/* ============ MODALITÀ CLASSE ============ */
function goClassroomChoose(){ clearIntervals(); state.view='classroomChoose'; render(); }
function viewClassroomChoose(){
  return `
  <h2>Modalità classe</h2>
  <p class="hint">Scegli come usarla alla LIM.</p>
  <div class="mode-list">
    <button class="mode-card" onclick="startClassroomShared()"><span class="emoji">📺</span><div class="txt"><strong>Schermo condiviso</strong><span>Una domanda per tutti, punti assegnati a mano a 3 squadre</span></div></button>
    <button class="mode-card" onclick="startClassroomSplit()"><span class="emoji">⚔️</span><div class="txt"><strong>Squadra contro squadra</strong><span>Schermo diviso a metà: 2 squadre, una domanda diversa per parte</span></div></button>
  </div>`;
}

/* --- Schermo condiviso (una domanda, punti assegnati a mano) --- */
function startClassroomShared(){
  clearIntervals();
  state.view='classroom';
  state.classTeam={blu:0,rosso:0,verde:0};
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
  if(!state.game.current) nextClassroomWord();
  const c = state.game.current;
  const optsHtml = c.options.map(t=>{
    let cls='option-btn';
    if(c.answered && t===c.word.t) cls+=' correct';
    return `<button class="${cls}" onclick="revealClassroom('${t}')">${TIPI_LABELS[t]}</button>`;
  }).join('');
  const team = state.classTeam;
  return `
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
function addTeamPoint(team){ state.classTeam[team]++; render(); }

/* --- Squadra contro squadra (schermo diviso, 2 domande indipendenti) --- */
const SPLIT_TEAMS = {
  blu:{label:'Blu', emoji:'🔵', cls:'blu', btn:'btn-ink'},
  rosso:{label:'Rosso', emoji:'🔴', cls:'rosso', btn:'btn-coral'},
};
function startClassroomSplit(){
  clearIntervals();
  state.view='classroomSplit';
  state.split = {blu:{score:0,current:null}, rosso:{score:0,current:null}};
  nextSplitWord('blu');
  nextSplitWord('rosso');
  render();
}
function nextSplitWord(side){
  const tipiList = activeTipiList();
  const pool = wordsByTipi(tipiList);
  const word = pickRandom(pool);
  const options = shuffle(tipiList.slice());
  state.split[side].current = {word, options, answered:false, chosen:null};
}
function splitColumnHtml(side){
  const meta = SPLIT_TEAMS[side];
  const s = state.split[side];
  const c = s.current;
  const optsHtml = c.options.map(t=>{
    let cls='option-btn';
    if(c.answered){
      if(t===c.word.t) cls+=' correct';
      else if(t===c.chosen) cls+=' wrong';
    }
    return `<button class="${cls}" ${c.answered?'disabled':''} onclick="answerSplit('${side}','${t}')">${TIPI_LABELS[t]}</button>`;
  }).join('');
  return `
  <div class="split-col ${meta.cls}">
    <h3>${meta.emoji} Squadra ${meta.label}</h3>
    <div class="split-score">${s.score}</div>
    <div class="quiz-prompt">Che cos'è...</div>
    <div class="quiz-word" style="font-size:clamp(1.6rem,6vw,2.2rem)">${c.word.w}</div>
    <div class="options-grid-single">${optsHtml}</div>
    ${c.answered ? `<button class="btn ${meta.btn}" style="margin-top:12px" onclick="nextSplitBtn('${side}')">Prossima →</button>` : ''}
  </div>`;
}
function viewClassroomSplit(){
  return `
  <p class="hint" style="text-align:center">Ogni squadra risponde alla propria domanda, in autonomia.</p>
  <div class="split-row">
    ${splitColumnHtml('blu')}
    ${splitColumnHtml('rosso')}
  </div>
  <div style="text-align:center;margin-top:16px">
    <button class="btn btn-ghost" onclick="resetSplit()">Azzera punteggio</button>
  </div>`;
}
function answerSplit(side, t){
  const c = state.split[side].current;
  if(c.answered) return;
  c.answered=true; c.chosen=t;
  if(t===c.word.t) state.split[side].score++;
  render();
}
function nextSplitBtn(side){ nextSplitWord(side); render(); }
function resetSplit(){
  state.split.blu.score=0;
  state.split.rosso.score=0;
  nextSplitWord('blu');
  nextSplitWord('rosso');
  render();
}
