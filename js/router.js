/* ============ STATE / ROUTER ============ */
let state = { view:'home', gameMode:null, game:{} };

function goHome(){ clearIntervals(); state.view='home'; state.gameMode=null; render(); }
function goModeSelect(){ clearIntervals(); state.view='modeSelect'; render(); }
function goSettings(){ clearIntervals(); state.view='settings'; render(); }
function goProgress(){ clearIntervals(); state.view='progress'; render(); }
function clearIntervals(){
  if(state.game && state.game.intervalId){ clearInterval(state.game.intervalId); state.game.intervalId=null; }
  if(state.splitIntervalId){ clearInterval(state.splitIntervalId); state.splitIntervalId=null; }
}

function render(){
  renderTopbar();
  const app = document.getElementById('app');
  if(state.view==='home') app.innerHTML = viewHome();
  else if(state.view==='nickname') app.innerHTML = viewNickname();
  else if(state.view==='classStats') app.innerHTML = viewClassStats();
  else if(state.view==='modeSelect') app.innerHTML = viewModeSelect();
  else if(state.view==='settings') app.innerHTML = viewSettings();
  else if(state.view==='progress') app.innerHTML = viewProgress();
  else if(state.view==='classroomChoose') app.innerHTML = viewClassroomChoose();
  else if(state.view==='classroom') app.innerHTML = viewClassroom();
  else if(state.view==='classroomSplitChoose') app.innerHTML = viewClassroomSplitChoose();
  else if(state.view==='classroomSplit') app.innerHTML = viewClassroomSplit();
  else if(state.view==='tugChoose') app.innerHTML = viewTugChoose();
  else if(state.view==='tugOfWar') app.innerHTML = viewTugOfWar();
  else if(state.view==='shipChoose') app.innerHTML = viewShipChoose();
  else if(state.view==='shipBattle') app.innerHTML = viewShipBattle();
  else if(state.view==='wheelChoose') app.innerHTML = viewWheelChoose();
  else if(state.view==='wheel') app.innerHTML = viewWheel();
  else if(state.view==='analizzaChoose') app.innerHTML = viewAnalizzaChoose();
  else if(state.view==='ortografiaChoose') app.innerHTML = viewOrtografiaChoose();
  else if(state.view==='ortografiaMistaChoose') app.innerHTML = viewOrtografiaMistaChoose();
  else if(state.view==='checoseChoose') app.innerHTML = viewCheCosEChoose();
  else if(state.view==='primitiviChoose') app.innerHTML = viewPrimitiviChoose();
  else if(state.view==='lessicoChoose') app.innerHTML = viewLessicoChoose();
  else if(state.view==='teoriaChoose') app.innerHTML = viewTeoriaChoose();
  else if(state.view==='teoriaPage') app.innerHTML = viewTeoriaPage();
  else if(state.view==='game'){
    if(state.gameMode==='checose') app.innerHTML = viewCheCosE();
    else if(state.gameMode==='analizza') app.innerHTML = viewAnalizza();
    else if(state.gameMode==='intruso') app.innerHTML = viewIntruso();
    else if(state.gameMode==='lampo') app.innerHTML = viewLampo();
    else if(state.gameMode==='mostro') app.innerHTML = viewMostro();
    else if(state.gameMode==='ortografia') app.innerHTML = viewOrtografia();
    else if(state.gameMode==='ortografiaMista') app.innerHTML = viewOrtografiaMista();
    else if(state.gameMode==='analizzatutto') app.innerHTML = viewAnalizzaTutto();
    else if(state.gameMode==='misteriosa') app.innerHTML = viewParolaMisteriosa();
    else if(state.gameMode==='primitivi') app.innerHTML = viewPrimitivi();
    else if(state.gameMode==='memoria') app.innerHTML = viewMemoria();
    else if(state.gameMode==='ordina') app.innerHTML = viewOrdina();
    else if(state.gameMode==='rollread') app.innerHTML = viewRollRead();
    else if(state.gameMode==='sincontr') app.innerHTML = viewSinContr();
    else if(state.gameMode==='alterati') app.innerHTML = viewAlterati();
    else if(state.gameMode==='composti') app.innerHTML = viewComposti();
    else if(state.gameMode==='anagramma') app.innerHTML = viewAnagramma();
    else if(state.gameMode==='sfidamista') app.innerHTML = viewSfidaMista();
  }
  window.scrollTo(0,0);
}

const MAPPA_VIEWS = ['game','classroom','classroomSplit','classroomChoose','classroomSplitChoose','tugChoose','tugOfWar','shipChoose','shipBattle','wheelChoose','wheel','analizzaChoose','ortografiaChoose','ortografiaMistaChoose','checoseChoose','teoriaPage','primitiviChoose'];
function renderTopbar(){
  const tb = document.getElementById('topbar');
  if(state.view==='home' || state.view==='nickname'){ tb.innerHTML=''; return; }
  const onMappa = MAPPA_VIEWS.includes(state.view);
  const nickname = getNickname();
  tb.innerHTML = `
    <button class="back-btn" onclick="${onMappa ? 'goModeSelectOrHome()' : 'goHome()'}">‹ ${onMappa?'Mappa':'Home'}</button>
    <div class="stats">
      ${nickname ? `<button class="pill" style="border:none;cursor:pointer;font-family:inherit" onclick="changeNickname()">👤 ${nickname}</button>` : ''}
      <span class="pill">⭐ ${progress.xp} XP</span>
      <span class="pill">🔥 ${progress.streak}</span>
    </div>`;
}
const ORTHO_GAME_MODES = ['ortografia','ortografiaMista','anagramma'];
const CHECOSE_GAME_MODES = ['checose','lampo','mostro','misteriosa','ordina','rollread'];
const ANALIZZA_GAME_MODES = ['analizza','analizzatutto'];
const PRIMITIVI_GAME_MODES = ['primitivi','memoria'];
const LESSICO_GAME_MODES = ['sincontr','alterati','composti'];
function goModeSelectOrHome(){
  if(state.view==='classroom'){ goClassroomChoose(); return; }
  if(state.view==='classroomSplit'){ goClassroomSplitChoose(); return; }
  if(state.view==='classroomSplitChoose'){ goClassroomChoose(); return; }
  if(state.view==='tugOfWar'){ goTugChoose(); return; }
  if(state.view==='tugChoose'){ goClassroomChoose(); return; }
  if(state.view==='shipBattle'){ goShipChoose(); return; }
  if(state.view==='shipChoose'){ goClassroomChoose(); return; }
  if(state.view==='wheel'){ goWheelChoose(); return; }
  if(state.view==='wheelChoose'){ goClassroomChoose(); return; }
  if(state.view==='ortografiaMistaChoose'){ goOrtografiaChoose(); return; }
  if(state.view==='checoseChoose'){ goModeSelect(); return; }
  if(state.view==='primitiviChoose'){ goModeSelect(); return; }
  if(state.view==='lessicoChoose'){ goHome(); return; }
  if(state.view==='teoriaPage'){ goTeoriaChoose(); return; }
  if(state.view==='game' && ORTHO_GAME_MODES.includes(state.gameMode)){
    if(state.gameMode==='ortografiaMista'){ goOrtografiaMistaChoose(); return; }
    goOrtografiaChoose(); return;
  }
  if(state.view==='game' && CHECOSE_GAME_MODES.includes(state.gameMode)){ goCheCosEChoose(); return; }
  if(state.view==='game' && ANALIZZA_GAME_MODES.includes(state.gameMode)){ goAnalizzaChoose(); return; }
  if(state.view==='game' && PRIMITIVI_GAME_MODES.includes(state.gameMode)){ goPrimitiviChoose(); return; }
  if(state.view==='game' && LESSICO_GAME_MODES.includes(state.gameMode)){ goLessicoChoose(); return; }
  goModeSelect();
}
