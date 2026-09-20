/* ============ MODALITÀ CLASSE ============ */
function goClassroomChoose(){ clearIntervals(); state.view='classroomChoose'; render(); }
function viewClassroomChoose(){
  return `
  <h2>Modalità classe</h2>
  <p class="hint">Scegli come usarla alla LIM.</p>
  <div class="mode-list">
    <button class="mode-card" onclick="startClassroomShared()"><span class="emoji">📺</span><div class="txt"><strong>Schermo condiviso</strong><span>Una domanda per tutti, vince la prima squadra ad arrivare a 10 punti</span></div></button>
    <button class="mode-card" onclick="goTugChoose()"><span class="emoji">🪢</span><div class="txt"><strong>Tiro alla fune</strong><span>Una domanda alla volta: chi risponde giusto tira la fune dalla propria parte</span></div></button>
    <button class="mode-card" onclick="goShipChoose()"><span class="emoji">🚢</span><div class="txt"><strong>Battaglia navale</strong><span>Ogni risposta giusta spara un colpo alla nave avversaria</span></div></button>
    <button class="mode-card" onclick="goWheelChoose()"><span class="emoji">🎡</span><div class="txt"><strong>Ruota della fortuna</strong><span>Gira la ruota per i punti, poi rispondi</span></div></button>
    <button class="mode-card" onclick="goClassroomSplitChoose()"><span class="emoji">⚔️</span><div class="txt"><strong>Squadra contro squadra</strong><span>Schermo diviso a metà, a tempo: scegli tu il contenuto</span></div></button>
  </div>`;
}

/* --- Contenuto condiviso da più modalità: genera e disegna una domanda a partire da un "tipo" scelto --- */
const CONTENT_TYPES = {
  checose:{label:"Che cos'è?", emoji:'❓'},
  primitivi:{label:'Primitivi e derivati', emoji:'🌱'},
  cege:{label:'Ortografia: Ce/Cie - Ge/Gie', emoji:'🔤'},
  scesci:{label:'Ortografia: Sce - Sci', emoji:'🔤'},
  glili:{label:'Ortografia: Gli - Li', emoji:'🔤'},
  cuqu:{label:'Ortografia: Cu/Qu/Cqu/Qqu', emoji:'🔤'},
  doppie:{label:'Ortografia: Le doppie', emoji:'🔤'},
  letterah:{label:'Ortografia: La lettera H', emoji:'🔤'},
  sillabe:{label:'Ortografia: Sillabe', emoji:'🔤'},
  accento:{label:'Ortografia: Accento', emoji:'🔤'},
  apostrofo:{label:'Ortografia: Apostrofo', emoji:'🔤'},
  punteggiatura:{label:'Ortografia: Punteggiatura', emoji:'🔤'},
  sincontr:{label:'Sinonimi e contrari', emoji:'🔀'},
  alterati:{label:'Nomi alterati', emoji:'🔎'},
  composti:{label:'Nomi composti', emoji:'🧩'},
};
function generateContentQuestion(type){
  let current;
  if(type==='checose'){
    const tipiList = activeTipiList();
    const pool = wordsByTipi(tipiList);
    const word = pickRandom(pool);
    const options = shuffle(tipiList.slice());
    current = {kind:'grammar', display:word.w, correct:word.t, options, labels:TIPI_LABELS};
  } else if(type==='primitivi'){
    const primitivi = PRIMITIVI_DERIVATI.filter(w=>w.tipo==='primitivo');
    const derivati = PRIMITIVI_DERIVATI.filter(w=>w.tipo==='derivato');
    const item = Math.random() < 0.5 ? pickRandom(primitivi) : pickRandom(derivati);
    const options = shuffle(['primitivo','derivato']);
    current = {kind:'grammar', display:item.w, correct:item.tipo, options, labels:PRIMDERIV_LABELS};
  } else if(type==='sincontr'){
    const kind = Math.random()<0.5 ? 'sinonimi' : 'contrari';
    const pair = pickRandom(SINONIMI_CONTRARI[kind]);
    const options = shuffle(Object.keys(SINCONTR_LABELS));
    current = {kind:'grammar', display:pair[0]+' / '+pair[1], correct:kind, options, labels:SINCONTR_LABELS};
  } else if(type==='alterati'){
    const item = pickRandom(NOMI_ALTERATI);
    const options = shuffle(Object.keys(ALTERATO_LABELS));
    current = {kind:'grammar', display:item.w, correct:item.tipo, options, labels:ALTERATO_LABELS};
  } else if(type==='composti'){
    const isComposto = Math.random()<0.5;
    const item = isComposto ? pickRandom(NOMI_COMPOSTI.composti) : {w:pickRandom(NOMI_COMPOSTI.semplici)};
    const options = shuffle(Object.keys(SEMPCOMP_LABELS));
    current = {kind:'grammar', display:item.w, correct:isComposto?'composto':'semplice', options, labels:SEMPCOMP_LABELS};
  } else {
    const topic = ORTHO_TOPICS[type];
    const item = pickRandom(topic.bank);
    const options = shuffle([item.ok, item.bad]);
    current = {kind:'ortho', orthoMode:topic.mode, item, options};
  }
  current.answered = false;
  current.chosen = null;
  return current;
}
function contentQuestionCorrectValue(c){
  return c.kind==='grammar' ? c.correct : c.item.ok;
}
function contentQuestionCorrectLabel(c){
  return c.kind==='grammar' ? c.labels[c.correct] : c.item.ok;
}
// makeOnClick: funzione(opt) => stringa da mettere in onclick, oppure null per una vista di sola lettura
function contentQuestionBodyHtml(c, makeOnClick, gridClass){
  gridClass = gridClass || 'options-grid';
  const correctVal = contentQuestionCorrectValue(c);
  const wordText = c.kind==='grammar'
    ? c.display
    : (c.orthoMode==='transform' ? c.item.s : (c.orthoMode==='sentence' ? c.item.sentence : ''));
  const optsHtml = c.options.map(opt=>{
    let cls='option-btn';
    if(c.answered){
      if(opt===correctVal) cls+=' correct';
      else if(opt===c.chosen) cls+=' wrong';
    }
    const label = c.kind==='grammar' ? c.labels[opt] : opt;
    const clickable = makeOnClick && !c.answered;
    return `<button class="${cls}" ${clickable?'':'disabled'} ${clickable?`onclick="${makeOnClick(opt)}"`:''}>${label}</button>`;
  }).join('');
  const wordHtml = wordText ? `<div class="quiz-word" style="${c.kind==='ortho'?'font-size:1.4rem':''}">${wordText}</div>` : '';
  return `${wordHtml}<div class="${gridClass}">${optsHtml}</div>`;
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

/* --- Tiro alla fune: una domanda condivisa, il punto sposta la fune verso la squadra --- */
const TUG_HALF = 5;
function goTugChoose(){
  clearIntervals();
  if(!state.tugContentTypes) state.tugContentTypes = ['checose'];
  state.view = 'tugChoose';
  render();
}
function viewTugChoose(){
  const selected = state.tugContentTypes;
  const rows = Object.keys(CONTENT_TYPES).map(k=>{
    const meta = CONTENT_TYPES[k];
    const checked = selected.includes(k);
    return `<label class="check-row"><input type="checkbox" ${checked?'checked':''} onchange="toggleTugContent('${k}')"> ${meta.emoji} ${meta.label}</label>`;
  }).join('');
  return `
  <h2>Tiro alla fune</h2>
  <p class="hint">Scegli su cosa vertono le domande (anche più di una: si mescoleranno). Una domanda alla volta per tutti: chi risponde giusto per primo tira la fune dalla propria parte.</p>
  <div class="settings-block">${rows}</div>
  <button class="btn btn-coral" style="margin-top:16px" onclick="startTugOfWar()">Inizia sfida</button>`;
}
function toggleTugContent(k){
  const list = state.tugContentTypes;
  const idx = list.indexOf(k);
  if(idx>=0){
    if(list.length<=1){ showToast('Deve restare selezionato almeno un contenuto'); return; }
    list.splice(idx,1);
  } else {
    list.push(k);
  }
  render();
}
function startTugOfWar(){
  clearIntervals();
  state.view = 'tugOfWar';
  if(!state.tugContentTypes || state.tugContentTypes.length===0) state.tugContentTypes=['checose'];
  state.tug = {position:0, winner:null, current:null};
  nextTugQuestion();
  render();
}
function nextTugQuestion(){
  const type = pickRandom(state.tugContentTypes);
  state.tug.current = generateContentQuestion(type);
}
function viewTugOfWar(){
  const g = state.tug;
  if(g.winner){
    const w = TEAM_META[g.winner];
    return `
    <div class="quiz-card">
      <h2>🏆 Ha vinto la squadra ${w.emoji} ${w.label}!</h2>
      <p>Ha trascinato la fune tutta dalla sua parte.</p>
      <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-top:16px">
        <button class="btn btn-coral" onclick="startTugOfWar()">Nuova sfida</button>
        <button class="btn btn-ghost" onclick="goTugChoose()">Cambia contenuto</button>
        <button class="btn btn-ghost" onclick="goClassroomChoose()">Cambia modalità</button>
      </div>
    </div>`;
  }
  const c = g.current;
  const pct = 50 + (g.position / TUG_HALF) * 42;
  return `
  <div class="tug-field">
    <span class="tug-goal left">🔵</span>
    <div class="tug-knot" style="left:${pct}%">🚩</div>
    <span class="tug-goal right">🔴</span>
  </div>
  <div class="quiz-card">
    ${contentQuestionBodyHtml(c, null)}
    ${!c.answered
      ? `<button class="btn btn-ink" style="margin-top:14px" onclick="revealTug()">Mostra la risposta</button>`
      : `
        <p class="feedback ok" style="margin-top:10px">Risposta giusta: ${contentQuestionCorrectLabel(c)}</p>
        <p class="hint">Chi ha risposto per primo, giusto?</p>
        <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-top:6px">
          <button class="btn btn-ink" onclick="tugPoint('blu')">🔵 Blu</button>
          <button class="btn btn-coral" onclick="tugPoint('rosso')">🔴 Rosso</button>
          <button class="btn btn-ghost" onclick="tugPoint(null)">Nessuno →</button>
        </div>`
    }
  </div>`;
}
function revealTug(){
  state.tug.current.answered = true;
  render();
}
function tugPoint(team){
  const g = state.tug;
  if(team==='blu') g.position -= 1;
  else if(team==='rosso') g.position += 1;
  if(g.position <= -TUG_HALF) g.winner = 'blu';
  else if(g.position >= TUG_HALF) g.winner = 'rosso';
  else nextTugQuestion();
  render();
}

/* --- Battaglia navale: ogni risposta giusta spara alla nave avversaria --- */
const SHIP_START_HP = 5;
function goShipChoose(){
  clearIntervals();
  if(!state.shipContentTypes) state.shipContentTypes = ['checose'];
  state.view = 'shipChoose';
  render();
}
function viewShipChoose(){
  const selected = state.shipContentTypes;
  const rows = Object.keys(CONTENT_TYPES).map(k=>{
    const meta = CONTENT_TYPES[k];
    const checked = selected.includes(k);
    return `<label class="check-row"><input type="checkbox" ${checked?'checked':''} onchange="toggleShipContent('${k}')"> ${meta.emoji} ${meta.label}</label>`;
  }).join('');
  return `
  <h2>Battaglia navale</h2>
  <p class="hint">Scegli su cosa vertono le domande. Chi risponde giusto per primo spara un colpo alla nave avversaria: 5 colpi e la affonda.</p>
  <div class="settings-block">${rows}</div>
  <button class="btn btn-coral" style="margin-top:16px" onclick="startShipBattle()">Inizia battaglia</button>`;
}
function toggleShipContent(k){
  const list = state.shipContentTypes;
  const idx = list.indexOf(k);
  if(idx>=0){
    if(list.length<=1){ showToast('Deve restare selezionato almeno un contenuto'); return; }
    list.splice(idx,1);
  } else {
    list.push(k);
  }
  render();
}
function startShipBattle(){
  clearIntervals();
  state.view = 'shipBattle';
  if(!state.shipContentTypes || state.shipContentTypes.length===0) state.shipContentTypes=['checose'];
  state.ship = {
    blu:{hp:SHIP_START_HP},
    rosso:{hp:SHIP_START_HP},
    winner:null,
    current:null,
  };
  nextShipQuestion();
  render();
}
function nextShipQuestion(){
  const type = pickRandom(state.shipContentTypes);
  state.ship.current = generateContentQuestion(type);
}
function heartsHtml(hp, max){
  let out = '';
  for(let i=0;i<max;i++) out += i<hp ? '❤️' : '🖤';
  return out;
}
function viewShipBattle(){
  const g = state.ship;
  if(g.winner){
    const w = TEAM_META[g.winner];
    return `
    <div class="quiz-card">
      <h2>🏆 Ha vinto la squadra ${w.emoji} ${w.label}!</h2>
      <p>Ha affondato la nave avversaria.</p>
      <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-top:16px">
        <button class="btn btn-coral" onclick="startShipBattle()">Nuova battaglia</button>
        <button class="btn btn-ghost" onclick="goShipChoose()">Cambia contenuto</button>
        <button class="btn btn-ghost" onclick="goClassroomChoose()">Cambia modalità</button>
      </div>
    </div>`;
  }
  const c = g.current;
  return `
  <div class="ship-row">
    <div class="ship-box"><div style="font-size:2rem">🚢</div><div>${heartsHtml(g.blu.hp, SHIP_START_HP)}</div><div class="hint">🔵 Squadra Blu</div></div>
    <div class="ship-box"><div style="font-size:2rem">🚢</div><div>${heartsHtml(g.rosso.hp, SHIP_START_HP)}</div><div class="hint">🔴 Squadra Rossa</div></div>
  </div>
  <div class="quiz-card">
    ${contentQuestionBodyHtml(c, null)}
    ${!c.answered
      ? `<button class="btn btn-ink" style="margin-top:14px" onclick="revealShip()">Mostra la risposta</button>`
      : `
        <p class="feedback ok" style="margin-top:10px">Risposta giusta: ${contentQuestionCorrectLabel(c)}</p>
        <p class="hint">Chi ha risposto per primo, spara!</p>
        <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-top:6px">
          <button class="btn btn-ink" onclick="shipHit('blu')">🔵 Blu colpisce</button>
          <button class="btn btn-coral" onclick="shipHit('rosso')">🔴 Rosso colpisce</button>
          <button class="btn btn-ghost" onclick="shipHit(null)">Nessuno →</button>
        </div>`
    }
  </div>`;
}
function revealShip(){
  state.ship.current.answered = true;
  render();
}
function shipHit(team){
  const g = state.ship;
  if(team){
    const target = team==='blu' ? 'rosso' : 'blu';
    g[target].hp -= 1;
    if(g[target].hp <= 0){ g.winner = team; render(); return; }
  }
  nextShipQuestion();
  render();
}

/* --- Ruota della fortuna: si gira per i punti in palio, poi si risponde --- */
const WHEEL_VALUES = [5,10,15,20,25,30,40,50];
function goWheelChoose(){
  clearIntervals();
  if(!state.wheelContentTypes) state.wheelContentTypes = ['checose'];
  state.view = 'wheelChoose';
  render();
}
function viewWheelChoose(){
  const selected = state.wheelContentTypes;
  const rows = Object.keys(CONTENT_TYPES).map(k=>{
    const meta = CONTENT_TYPES[k];
    const checked = selected.includes(k);
    return `<label class="check-row"><input type="checkbox" ${checked?'checked':''} onchange="toggleWheelContent('${k}')"> ${meta.emoji} ${meta.label}</label>`;
  }).join('');
  return `
  <h2>Ruota della fortuna</h2>
  <p class="hint">Scegli su cosa vertono le domande. Si gira la ruota per sapere quanti punti valgono, poi si risponde.</p>
  <div class="settings-block">${rows}</div>
  <button class="btn btn-coral" style="margin-top:16px" onclick="startWheel()">Inizia</button>`;
}
function toggleWheelContent(k){
  const list = state.wheelContentTypes;
  const idx = list.indexOf(k);
  if(idx>=0){
    if(list.length<=1){ showToast('Deve restare selezionato almeno un contenuto'); return; }
    list.splice(idx,1);
  } else {
    list.push(k);
  }
  render();
}
function startWheel(){
  clearIntervals();
  state.view = 'wheel';
  if(!state.wheelContentTypes || state.wheelContentTypes.length===0) state.wheelContentTypes=['checose'];
  state.wheel = {
    team:{blu:0,rosso:0,verde:0},
    rotation:0,
    spinning:false,
    value:null,
    current:null,
  };
  render();
}
function spinWheel(){
  const g = state.wheel;
  if(g.spinning) return;
  const value = pickRandom(WHEEL_VALUES);
  const idx = WHEEL_VALUES.indexOf(value);
  const segAngle = 360/WHEEL_VALUES.length;
  const targetCenter = idx*segAngle + segAngle/2;
  const spins = 5;
  const baseRotation = g.rotation - (g.rotation % 360);
  g.rotation = baseRotation + spins*360 + (360 - targetCenter);
  g.spinning = true;
  g.pendingValue = value;
  render();
  setTimeout(()=>{
    g.spinning = false;
    g.value = g.pendingValue;
    g.current = generateContentQuestion(pickRandom(state.wheelContentTypes));
    render();
  }, 3000);
}
function viewWheel(){
  const g = state.wheel;
  const team = g.team;
  const segAngle = 360/WHEEL_VALUES.length;
  const segsHtml = WHEEL_VALUES.map((v,i)=>{
    const angle = i*segAngle + segAngle/2;
    return `<div class="wheel-label" style="transform:rotate(${angle}deg) translate(0,-78px) rotate(${-angle}deg)">${v}</div>`;
  }).join('');
  let bottomHtml;
  if(g.spinning){
    bottomHtml = `<p class="hint" style="text-align:center">🎡 Girando...</p>`;
  } else if(!g.current){
    bottomHtml = `<button class="btn btn-coral" style="width:100%" onclick="spinWheel()">🎡 Gira la ruota</button>`;
  } else {
    const c = g.current;
    bottomHtml = `
    <p class="quiz-prompt" style="text-align:center">In palio: <strong>${g.value} punti</strong></p>
    ${contentQuestionBodyHtml(c, null)}
    ${!c.answered
      ? `<button class="btn btn-ink" style="margin-top:14px" onclick="revealWheel()">Mostra la risposta</button>`
      : `
        <p class="feedback ok" style="margin-top:10px">Risposta giusta: ${contentQuestionCorrectLabel(c)}</p>
        <p class="hint">Chi ha risposto per primo?</p>
        <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-top:6px">
          <button class="btn btn-ink" onclick="wheelPoint('blu')">🔵 Blu</button>
          <button class="btn btn-coral" onclick="wheelPoint('rosso')">🔴 Rosso</button>
          <button class="btn btn-grass" onclick="wheelPoint('verde')">🟢 Verde</button>
          <button class="btn btn-ghost" onclick="wheelPoint(null)">Nessuno</button>
        </div>`
    }`;
  }
  return `
  <div class="team-row" style="margin-bottom:4px">
    <div class="team-box team-blu"><div>🔵 Blu</div><div class="score">${team.blu}</div></div>
    <div class="team-box team-rosso"><div>🔴 Rosso</div><div class="score">${team.rosso}</div></div>
    <div class="team-box team-verde"><div>🟢 Verde</div><div class="score">${team.verde}</div></div>
  </div>
  <div class="wheel-wrap">
    <div class="wheel-pointer">▼</div>
    <div class="wheel" style="transform:rotate(${g.rotation}deg)">${segsHtml}</div>
  </div>
  <div class="quiz-card">${bottomHtml}</div>`;
}
function revealWheel(){
  state.wheel.current.answered = true;
  render();
}
function wheelPoint(team){
  const g = state.wheel;
  if(team) g.team[team] += g.value;
  g.value = null;
  g.current = null;
  render();
}

/* --- Squadra contro squadra: schermo diviso, a tempo, avanza da sola, contenuto a scelta --- */
const SPLIT_ANSWER_SECONDS = 10;
const SPLIT_REVEAL_SECONDS = 2;
const SPLIT_TEAMS = {
  blu:{label:'Blu', emoji:'🔵', cls:'blu'},
  rosso:{label:'Rosso', emoji:'🔴', cls:'rosso'},
};
function goClassroomSplitChoose(){
  clearIntervals();
  if(!state.splitContentTypes) state.splitContentTypes = ['checose'];
  state.view='classroomSplitChoose';
  render();
}
function viewClassroomSplitChoose(){
  const selected = state.splitContentTypes;
  const rows = Object.keys(CONTENT_TYPES).map(k=>{
    const meta = CONTENT_TYPES[k];
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
  s.current = generateContentQuestion(type);
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
  const bodyHtml = contentQuestionBodyHtml(s.current, opt=>`answerSplit('${side}','${opt}')`, 'options-grid-single');
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
    ? types.map(t=>CONTENT_TYPES[t].label).join(' + ')
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
  if(s.phase!=='answering' || s.current.answered) return;
  const correct = value===contentQuestionCorrectValue(s.current);
  s.current.answered = true;
  s.current.chosen = value;
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
