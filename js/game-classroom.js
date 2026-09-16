/* ============ MODALITÀ CLASSE ============ */
function goClassroomChoose(){ clearIntervals(); state.view='classroomChoose'; render(); }
function viewClassroomChoose(){
  return `
  <h2>Modalità classe</h2>
  <p class="hint">Scegli come usarla alla LIM.</p>
  <div class="mode-list">
    <button class="mode-card" onclick="startClassroomShared()"><span class="emoji">📺</span><div class="txt"><strong>Schermo condiviso</strong><span>Una domanda per tutti, vince la prima squadra ad arrivare a 10 punti</span></div></button>
    <button class="mode-card" onclick="startClassroomSplit()"><span class="emoji">⚔️</span><div class="txt"><strong>Squadra contro squadra</strong><span>Schermo diviso a metà, a tempo: le domande cambiano da sole</span></div></button>
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

/* --- Squadra contro squadra: schermo diviso, a tempo, avanza da sola --- */
const SPLIT_ANSWER_SECONDS = 10;
const SPLIT_REVEAL_SECONDS = 2;
const SPLIT_TEAMS = {
  blu:{label:'Blu', emoji:'🔵', cls:'blu'},
  rosso:{label:'Rosso', emoji:'🔴', cls:'rosso'},
};
function startClassroomSplit(){
  clearIntervals();
  state.view='classroomSplit';
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
  const tipiList = activeTipiList();
  const pool = wordsByTipi(tipiList);
  const word = pickRandom(pool);
  const options = shuffle(tipiList.slice());
  const s = state.split[side];
  s.current = {word, options, answered:false, chosen:null};
  s.phase = 'answering';
  s.timeLeft = SPLIT_ANSWER_SECONDS;
}
function splitTick(){
  ['blu','rosso'].forEach(side=>{
    const s = state.split[side];
    s.timeLeft--;
    if(s.timeLeft <= 0){
      if(s.phase==='answering'){
        s.current.answered = true;
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
  const optsHtml = c.options.map(t=>{
    let cls='option-btn';
    if(c.answered){
      if(t===c.word.t) cls+=' correct';
      else if(t===c.chosen) cls+=' wrong';
    }
    return `<button class="${cls}" ${c.answered?'disabled':''} onclick="answerSplit('${side}','${t}')">${TIPI_LABELS[t]}</button>`;
  }).join('');
  const timerLabel = s.phase==='answering' ? `⏱ ${s.timeLeft}s` : `Prossima tra ${s.timeLeft}...`;
  return `
  <div class="split-col ${meta.cls}">
    <h3>${meta.emoji} Squadra ${meta.label}</h3>
    <div class="split-score">${s.score}</div>
    <div class="hint">${timerLabel}</div>
    <div class="quiz-prompt">Che cos'è...</div>
    <div class="quiz-word" style="font-size:clamp(1.6rem,6vw,2.2rem)">${c.word.w}</div>
    <div class="options-grid-single">${optsHtml}</div>
  </div>`;
}
function viewClassroomSplit(){
  return `
  <p class="hint" style="text-align:center">Ogni squadra risponde alla propria domanda, in autonomia: le parole cambiano da sole.</p>
  <div class="split-row">
    ${splitColumnHtml('blu')}
    ${splitColumnHtml('rosso')}
  </div>
  <div style="text-align:center;margin-top:16px">
    <button class="btn btn-ghost" onclick="resetSplit()">Azzera punteggio</button>
  </div>`;
}
function answerSplit(side, t){
  const s = state.split[side];
  if(s.phase!=='answering' || s.current.answered) return;
  s.current.answered=true; s.current.chosen=t;
  if(t===s.current.word.t) s.score++;
  s.phase = 'revealing';
  s.timeLeft = SPLIT_REVEAL_SECONDS;
  render();
}
function resetSplit(){
  state.split.blu.score=0;
  state.split.rosso.score=0;
  loadSplitWord('blu');
  loadSplitWord('rosso');
  render();
}
