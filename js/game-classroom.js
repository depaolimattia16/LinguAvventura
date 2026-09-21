/* ============ MODALITÀ CLASSE ============ */
function goClassroomChoose(){ clearIntervals(); state.view='classroomChoose'; render(); }
function viewClassroomChoose(){
  return `
  <h2>Modalità classe</h2>
  <p class="hint">Scegli come usarla alla LIM.</p>
  <div class="mode-list">
    <button class="mode-card" onclick="goShipChoose()"><span class="emoji">🚢</span><div class="txt"><strong>Battaglia navale</strong><span>Ogni risposta giusta spara un colpo alla nave avversaria</span></div></button>
    <button class="mode-card" onclick="goWheelChoose()"><span class="emoji">🎡</span><div class="txt"><strong>Ruota della fortuna</strong><span>Gira la ruota per i punti, poi rispondi</span></div></button>
    <button class="mode-card" onclick="startClassroomShared()"><span class="emoji">📺</span><div class="txt"><strong>Schermo condiviso</strong><span>Una domanda per tutti, vince la prima squadra ad arrivare a 10 punti</span></div></button>
    <button class="mode-card" onclick="goClassroomSplitChoose()"><span class="emoji">⚔️</span><div class="txt"><strong>Squadra contro squadra</strong><span>Schermo diviso a metà, a tempo: scegli tu il contenuto</span></div></button>
    <button class="mode-card" onclick="goTugChoose()"><span class="emoji">🪢</span><div class="txt"><strong>Tiro alla fune</strong><span>Una domanda alla volta: chi risponde giusto tira la fune dalla propria parte</span></div></button>
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
    const options = tipiList.slice(); // ordine fisso: le etichette sono sempre le stesse, mescolarle è solo fastidioso
    current = {kind:'grammar', display:word.w, correct:word.t, options, labels:TIPI_LABELS};
  } else if(type==='primitivi'){
    const primitivi = PRIMITIVI_DERIVATI.filter(w=>w.tipo==='primitivo');
    const derivati = PRIMITIVI_DERIVATI.filter(w=>w.tipo==='derivato');
    const item = Math.random() < 0.5 ? pickRandom(primitivi) : pickRandom(derivati);
    const options = ['primitivo','derivato']; // ordine fisso, sempre le stesse due etichette
    current = {kind:'grammar', display:item.w, correct:item.tipo, options, labels:PRIMDERIV_LABELS};
  } else if(type==='sincontr'){
    const kind = Math.random()<0.5 ? 'sinonimi' : 'contrari';
    const pair = pickRandom(SINONIMI_CONTRARI[kind]);
    const options = Object.keys(SINCONTR_LABELS); // ordine fisso, sempre le stesse due etichette
    current = {kind:'grammar', display:pair[0]+' / '+pair[1], correct:kind, options, labels:SINCONTR_LABELS};
  } else if(type==='alterati'){
    const item = pickRandom(NOMI_ALTERATI);
    const options = Object.keys(ALTERATO_LABELS); // ordine fisso, sempre le stesse quattro etichette
    current = {kind:'grammar', display:item.w, correct:item.tipo, options, labels:ALTERATO_LABELS};
  } else if(type==='composti'){
    const isComposto = Math.random()<0.5;
    const item = isComposto ? pickRandom(NOMI_COMPOSTI.composti) : {w:pickRandom(NOMI_COMPOSTI.semplici)};
    const options = Object.keys(SEMPCOMP_LABELS); // ordine fisso, sempre le stesse due etichette
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

/* --- Motore condiviso "gara a due": stessa domanda su entrambi i lati dello schermo diviso,
   chi tocca la risposta giusta per primo vince il punto del round. Usato da Tiro alla fune,
   Battaglia navale e Ruota della fortuna. --- */
function newRace(type){
  return {
    question: generateContentQuestion(type),
    blu:{answered:false, correct:null, chosen:null},
    rosso:{answered:false, correct:null, chosen:null},
    winner:null, // 'blu' | 'rosso' | 'none' (entrambi sbagliato) | null (round in corso)
  };
}
function raceAnswer(race, side, opt, onWin){
  if(race.winner) return; // round già deciso, si aspetta "avanti"
  const s = race[side];
  if(s.answered) return; // questo lato ha già tentato
  s.answered = true;
  s.chosen = opt;
  s.correct = opt === contentQuestionCorrectValue(race.question);
  if(s.correct){
    race.winner = side;
    if(onWin) onWin(side);
  } else {
    const other = side==='blu' ? 'rosso' : 'blu';
    if(race[other].answered) race.winner = 'none'; // sbagliato da entrambe le parti
  }
  renderInstant();
}
function raceColumnHtml(race, side, meta, makeOnClick){
  const q = race.question;
  const s = race[side];
  const correctVal = contentQuestionCorrectValue(q);
  const roundClosed = !!race.winner;
  const bodyHtml = contentQuestionBodyHtmlForRace(q, s, roundClosed, makeOnClick, 'options-grid-single');
  let statusHtml = '';
  if(roundClosed){
    if(race.winner===side) statusHtml = `<p class="feedback ok" style="margin-top:6px">🏆 Risposto per primi!</p>`;
    else if(race.winner==='none') statusHtml = `<p class="hint" style="margin-top:6px">Nessuna delle due, questa volta.</p>`;
    else statusHtml = `<p class="hint" style="margin-top:6px">Ha risposto prima l'altra squadra.</p>`;
  } else if(s.answered && !s.correct){
    statusHtml = `<p class="feedback bad" style="margin-top:6px">Sbagliato, aspetta...</p>`;
  }
  const winClass = race.winner===side ? ' winner-flash' : '';
  return `
  <div class="split-col ${meta.cls}${winClass}">
    <h3>${meta.emoji} Squadra ${meta.label}</h3>
    ${bodyHtml}
    ${statusHtml}
  </div>`;
}
// Come contentQuestionBodyHtml, ma lo stato "risposto" è quello del singolo lato (s), non della domanda condivisa,
// e la risposta giusta si rivela solo quando il round è chiuso (per non favorire l'altra squadra in corsa).
function contentQuestionBodyHtmlForRace(q, s, roundClosed, makeOnClick, gridClass){
  const correctVal = contentQuestionCorrectValue(q);
  const wordText = q.kind==='grammar'
    ? q.display
    : (q.orthoMode==='transform' ? q.item.s : (q.orthoMode==='sentence' ? q.item.sentence : ''));
  const optsHtml = q.options.map(opt=>{
    let cls='option-btn';
    if(roundClosed && opt===correctVal) cls+=' correct';
    else if(s.answered && opt===s.chosen && !s.correct) cls+=' wrong';
    const disabled = s.answered || roundClosed;
    return `<button class="${cls}" ${disabled?'disabled':''} ${disabled?'':`onclick="${makeOnClick(opt)}"`}>${q.kind==='grammar'?q.labels[opt]:opt}</button>`;
  }).join('');
  const wordHtml = wordText ? `<div class="quiz-word" style="${q.kind==='ortho'?'font-size:1.3rem':'font-size:1.5rem'}">${wordText}</div>` : '';
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
  const options = tipiList.slice(); // ordine fisso: le etichette sono sempre le stesse, mescolarle è solo fastidioso
  state.game.current = {word, options, answered:false};
}
function viewClassroom(){
  const team = state.classTeam;
  if(state.classWinner){
    const w = TEAM_META[state.classWinner];
    return `
    ${confettiHtml()}
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
  renderInstant();
}
function nextClassroomBtn(){ nextClassroomWord(); renderInstant(); }
function addTeamPoint(team){
  if(state.classWinner) return;
  state.classTeam[team]++;
  if(state.classTeam[team] >= CLASSROOM_WIN_SCORE){
    state.classWinner = team;
    playVictorySound();
  }
  renderInstant();
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
  const rows = sortedKeysByLabel(Object.keys(CONTENT_TYPES), Object.fromEntries(Object.entries(CONTENT_TYPES).map(([k,v])=>[k,v.label]))).map(k=>{
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
  state.tug = {position:0, winner:null, race:null, animateFromPct:null};
  nextTugRound();
  render();
}
function nextTugRound(){
  const type = pickRandom(state.tugContentTypes);
  state.tug.race = newRace(type);
}
function answerTugSide(side, opt){
  if(state.tug.winner) return;
  const fromPct = 50 + (state.tug.position / TUG_HALF) * 42;
  raceAnswer(state.tug.race, side, opt, (winSide)=>{
    if(winSide==='blu') state.tug.position -= 1; else state.tug.position += 1;
    if(state.tug.position <= -TUG_HALF){ state.tug.winner = 'blu'; playVictorySound(); }
    else if(state.tug.position >= TUG_HALF){ state.tug.winner = 'rosso'; playVictorySound(); }
    state.tug.animateFromPct = fromPct; // il render dentro raceAnswer dipingerà ancora la vecchia posizione
  });
  if(state.tug.animateFromPct != null){
    const toPct = 50 + (state.tug.position / TUG_HALF) * 42;
    // Stesso trucco della ruota: un render() pieno crea un nodo nuovo, quindi la transizione CSS
    // non avrebbe nulla da cui partire. Aspettiamo che il browser disegni la posizione vecchia,
    // poi spostiamo lo stesso nodo direttamente: così la fune scivola davvero.
    requestAnimationFrame(()=>{
      requestAnimationFrame(()=>{
        const knotEl = document.querySelector('.tug-knot');
        if(knotEl) knotEl.style.left = toPct+'%';
      });
    });
    state.tug.animateFromPct = null;
  }
}
function nextTugRoundBtn(){
  if(state.tug.winner) return;
  nextTugRound();
  renderInstant();
}
function viewTugOfWar(){
  const g = state.tug;
  if(g.winner){
    const w = TEAM_META[g.winner];
    return `
    ${confettiHtml()}
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
  const race = g.race;
  const currentPct = 50 + (g.position / TUG_HALF) * 42;
  const pct = g.animateFromPct != null ? g.animateFromPct : currentPct;
  return `
  <div class="tug-field">
    <span class="tug-goal left">🔵</span>
    <div class="tug-knot" style="left:${pct}%">🚩</div>
    <span class="tug-goal right">🔴</span>
  </div>
  <p class="hint" style="text-align:center">Stessa domanda per tutti e due: chi tocca la risposta giusta per primo tira la fune.</p>
  <div class="split-row">
    ${raceColumnHtml(race, 'blu', SPLIT_TEAMS.blu, opt=>`answerTugSide('blu','${escJs(opt)}')`)}
    ${raceColumnHtml(race, 'rosso', SPLIT_TEAMS.rosso, opt=>`answerTugSide('rosso','${escJs(opt)}')`)}
  </div>
  ${race.winner ? `<button class="btn btn-ink" style="margin-top:14px;width:100%" onclick="nextTugRoundBtn()">Prossima domanda →</button>` : ''}`;
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
  const rows = sortedKeysByLabel(Object.keys(CONTENT_TYPES), Object.fromEntries(Object.entries(CONTENT_TYPES).map(([k,v])=>[k,v.label]))).map(k=>{
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
    race:null,
    justHit:null,
  };
  nextShipRound();
  render();
}
function nextShipRound(){
  const type = pickRandom(state.shipContentTypes);
  state.ship.race = newRace(type);
}
function answerShipSide(side, opt){
  if(state.ship.winner) return;
  raceAnswer(state.ship.race, side, opt, (winSide)=>{
    const target = winSide==='blu' ? 'rosso' : 'blu';
    state.ship[target].hp -= 1;
    state.ship.justHit = target; // il render dentro raceAnswer dipinge il colpo appena preso
    if(state.ship[target].hp <= 0){ state.ship.winner = winSide; playVictorySound(); }
  });
  state.ship.justHit = null; // consumato: l'animazione è già partita sul nodo appena creato
}
function nextShipRoundBtn(){
  if(state.ship.winner) return;
  nextShipRound();
  renderInstant();
}
function heartsHtml(hp, max){
  let out = '';
  for(let i=0;i<max;i++) out += i<hp ? '❤️' : '🖤';
  return out;
}
function shipBoxHtml(g, side, emoji, label){
  const hit = g.justHit === side;
  return `
  <div class="ship-box ${hit?'hit-shake':''}">
    <div style="font-size:2rem;position:relative">🚢${hit?'<span class="ship-explosion">💥</span>':''}</div>
    <div>${heartsHtml(g[side].hp, SHIP_START_HP)}</div>
    <div class="hint">${emoji} Squadra ${label}</div>
  </div>`;
}
function viewShipBattle(){
  const g = state.ship;
  if(g.winner){
    const w = TEAM_META[g.winner];
    return `
    ${confettiHtml()}
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
  const race = g.race;
  return `
  <div class="ship-row">
    ${shipBoxHtml(g, 'blu', '🔵', 'Blu')}
    ${shipBoxHtml(g, 'rosso', '🔴', 'Rossa')}
  </div>
  <p class="hint" style="text-align:center">Stessa domanda per tutti e due: chi tocca la risposta giusta per primo spara.</p>
  <div class="split-row">
    ${raceColumnHtml(race, 'blu', SPLIT_TEAMS.blu, opt=>`answerShipSide('blu','${escJs(opt)}')`)}
    ${raceColumnHtml(race, 'rosso', SPLIT_TEAMS.rosso, opt=>`answerShipSide('rosso','${escJs(opt)}')`)}
  </div>
  ${race.winner ? `<button class="btn btn-ink" style="margin-top:14px;width:100%" onclick="nextShipRoundBtn()">Prossima domanda →</button>` : ''}`;
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
  const rows = sortedKeysByLabel(Object.keys(CONTENT_TYPES), Object.fromEntries(Object.entries(CONTENT_TYPES).map(([k,v])=>[k,v.label]))).map(k=>{
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
    team:{blu:0,rosso:0},
    rotation:0,
    spinning:false,
    value:null,
    race:null,
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
  const finalRotation = baseRotation + spins*360 + (360 - targetCenter);
  g.spinning = true;
  g.pendingValue = value;
  renderInstant(); // disegna la ruota ferma, ancora alla rotazione precedente
  // Un render() pieno sostituisce il div della ruota: la transizione CSS non avrebbe
  // nulla da cui partire e scatterebbe dritta al valore finale, senza girare visibilmente.
  // Aspettiamo che il browser disegni lo stato di partenza, poi tocchiamo lo stesso nodo
  // direttamente: così la transizione ha un prima e un dopo da animare davvero.
  requestAnimationFrame(()=>{
    requestAnimationFrame(()=>{
      const wheelEl = document.querySelector('.wheel');
      if(wheelEl) wheelEl.style.transform = 'rotate('+finalRotation+'deg)';
    });
  });
  setTimeout(()=>{
    g.rotation = finalRotation;
    g.spinning = false;
    g.value = g.pendingValue;
    g.race = newRace(pickRandom(state.wheelContentTypes));
    renderInstant();
  }, 3000);
}
function answerWheelSide(side, opt){
  if(!state.wheel.value) return;
  raceAnswer(state.wheel.race, side, opt, (winSide)=>{
    state.wheel.team[winSide] += state.wheel.value;
  });
}
function nextWheelRoundBtn(){
  state.wheel.value = null;
  state.wheel.race = null;
  renderInstant();
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
  } else if(!g.race){
    bottomHtml = `<button class="btn btn-coral" style="width:100%" onclick="spinWheel()">🎡 Gira la ruota</button>`;
  } else {
    bottomHtml = `
    <p class="quiz-prompt" style="text-align:center">In palio: <strong>${g.value} punti</strong> — chi risponde giusto per primo li prende</p>
    <div class="split-row">
      ${raceColumnHtml(g.race, 'blu', SPLIT_TEAMS.blu, opt=>`answerWheelSide('blu','${escJs(opt)}')`)}
      ${raceColumnHtml(g.race, 'rosso', SPLIT_TEAMS.rosso, opt=>`answerWheelSide('rosso','${escJs(opt)}')`)}
    </div>
    ${g.race.winner ? `<button class="btn btn-ink" style="margin-top:14px;width:100%" onclick="nextWheelRoundBtn()">Gira di nuovo →</button>` : ''}`;
  }
  return `
  <div class="team-row" style="margin-bottom:4px">
    <div class="team-box team-blu"><div>🔵 Blu</div><div class="score">${team.blu}</div></div>
    <div class="team-box team-rosso"><div>🔴 Rosso</div><div class="score">${team.rosso}</div></div>
  </div>
  <div class="wheel-wrap">
    <div class="wheel-pointer">▼</div>
    <div class="wheel" style="transform:rotate(${g.rotation}deg)">${segsHtml}</div>
  </div>
  ${g.race ? bottomHtml : `<div class="quiz-card">${bottomHtml}</div>`}`;
}

/* --- Squadra contro squadra: schermo diviso, un solo timer totale, vince chi ha più punti --- */
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
  const rows = sortedKeysByLabel(Object.keys(CONTENT_TYPES), Object.fromEntries(Object.entries(CONTENT_TYPES).map(([k,v])=>[k,v.label]))).map(k=>{
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
    list.splice(idx,1);
  } else {
    list.push(k);
  }
  render();
}
const SPLIT_MATCH_SECONDS = 60;
const SPLIT_REVEAL_SECONDS = 1;
function startClassroomSplit(){
  clearIntervals();
  state.view='classroomSplit';
  if(!state.splitContentTypes || state.splitContentTypes.length===0) state.splitContentTypes=['checose'];
  state.split = {
    blu:{score:0, current:null},
    rosso:{score:0, current:null},
    timeLeft: SPLIT_MATCH_SECONDS,
    finished: false,
  };
  loadSplitWord('blu');
  loadSplitWord('rosso');
  state.splitIntervalId = setInterval(splitTick, 1000);
  render();
}
function loadSplitWord(side){
  const type = pickRandom(state.splitContentTypes);
  state.split[side].current = generateContentQuestion(type);
}
function splitTick(){
  state.split.timeLeft--;
  if(state.split.timeLeft <= 0){
    state.split.timeLeft = 0;
    state.split.finished = true;
    clearIntervals();
    playVictorySound();
  }
  renderInstant();
}
function splitColumnHtml(side){
  const meta = SPLIT_TEAMS[side];
  const s = state.split[side];
  const bodyHtml = contentQuestionBodyHtml(s.current, opt=>`answerSplit('${side}','${escJs(opt)}')`, 'options-grid-single');
  return `
  <div class="split-col ${meta.cls}">
    <h3>${meta.emoji} Squadra ${meta.label}</h3>
    <div class="split-score">${s.score}</div>
    ${bodyHtml}
  </div>`;
}
function viewClassroomSplit(){
  const st = state.split;
  const types = state.splitContentTypes;
  const contentLabel = types.length<=2
    ? types.map(t=>CONTENT_TYPES[t].label).join(' + ')
    : `${types.length} contenuti mescolati`;
  if(st.finished){
    let resultHtml;
    if(st.blu.score > st.rosso.score) resultHtml = `<h2>🏆 Ha vinto la squadra 🔵 Blu!</h2>`;
    else if(st.rosso.score > st.blu.score) resultHtml = `<h2>🏆 Ha vinto la squadra 🔴 Rosso!</h2>`;
    else resultHtml = `<h2>🤝 Pareggio!</h2>`;
    return `
    ${st.blu.score !== st.rosso.score ? confettiHtml() : ''}
    <div class="quiz-card">
      ${resultHtml}
      <p>Tempo scaduto: 60 secondi giocati.</p>
      <div class="team-row">
        <div class="team-box team-blu"><div>🔵 Blu</div><div class="score">${st.blu.score}</div></div>
        <div class="team-box team-rosso"><div>🔴 Rosso</div><div class="score">${st.rosso.score}</div></div>
      </div>
      <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-top:16px">
        <button class="btn btn-coral" onclick="startClassroomSplit()">Rivincita</button>
        <button class="btn btn-ghost" onclick="goClassroomSplitChoose()">Cambia contenuto</button>
        <button class="btn btn-ghost" onclick="goClassroomChoose()">Cambia modalità</button>
      </div>
    </div>`;
  }
  return `
  <p class="hint" style="text-align:center">⏱ ${st.timeLeft}s rimasti · ${contentLabel} · vince chi ha più punti allo scadere del tempo</p>
  <div class="split-row">
    ${splitColumnHtml('blu')}
    ${splitColumnHtml('rosso')}
  </div>
  <div style="text-align:center;margin-top:16px;display:flex;gap:10px;justify-content:center;flex-wrap:wrap">
    <button class="btn btn-ghost" onclick="startClassroomSplit()">Ricomincia</button>
    <button class="btn btn-ghost" onclick="goClassroomSplitChoose()">Cambia contenuto</button>
  </div>`;
}
function answerSplit(side, value){
  const s = state.split[side];
  if(state.split.finished || s.current.answered) return;
  const correct = value===contentQuestionCorrectValue(s.current);
  s.current.answered = true;
  s.current.chosen = value;
  if(correct) s.score++;
  renderInstant();
  setTimeout(()=>{
    if(!state.split.finished){
      loadSplitWord(side);
      renderInstant();
    }
  }, SPLIT_REVEAL_SECONDS*1000);
}
