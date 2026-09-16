/* ============ MODALITÀ CLASSE ============ */
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
