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

function computeAppHtml(){
  if(state.view==='home') return viewHome();
  else if(state.view==='nickname') return viewNickname();
  else if(state.view==='classStats') return viewClassStats();
  else if(state.view==='modeSelect') return viewModeSelect();
  else if(state.view==='settings') return viewSettings();
  else if(state.view==='progress') return viewProgress();
  else if(state.view==='classroomChoose') return viewClassroomChoose();
  else if(state.view==='classroom') return viewClassroom();
  else if(state.view==='classroomSplitChoose') return viewClassroomSplitChoose();
  else if(state.view==='classroomSplit') return viewClassroomSplit();
  else if(state.view==='tugChoose') return viewTugChoose();
  else if(state.view==='tugOfWar') return viewTugOfWar();
  else if(state.view==='shipChoose') return viewShipChoose();
  else if(state.view==='shipBattle') return viewShipBattle();
  else if(state.view==='wheelChoose') return viewWheelChoose();
  else if(state.view==='wheel') return viewWheel();
  else if(state.view==='analizzaChoose') return viewAnalizzaChoose();
  else if(state.view==='ortografiaChoose') return viewOrtografiaChoose();
  else if(state.view==='ortografiaMistaChoose') return viewOrtografiaMistaChoose();
  else if(state.view==='checoseChoose') return viewCheCosEChoose();
  else if(state.view==='primitiviChoose') return viewPrimitiviChoose();
  else if(state.view==='lessicoChoose') return viewLessicoChoose();
  else if(state.view==='teoriaChoose') return viewTeoriaChoose();
  else if(state.view==='teoriaPage') return viewTeoriaPage();
  else if(state.view==='game'){
    if(state.gameMode==='checose') return viewCheCosE();
    else if(state.gameMode==='analizza') return viewAnalizza();
    else if(state.gameMode==='intruso') return viewIntruso();
    else if(state.gameMode==='lampo') return viewLampo();
    else if(state.gameMode==='mostro') return viewMostro();
    else if(state.gameMode==='ortografia') return viewOrtografia();
    else if(state.gameMode==='ortografiaMista') return viewOrtografiaMista();
    else if(state.gameMode==='analizzatutto') return viewAnalizzaTutto();
    else if(state.gameMode==='misteriosa') return viewParolaMisteriosa();
    else if(state.gameMode==='primitivi') return viewPrimitivi();
    else if(state.gameMode==='memoria') return viewMemoria();
    else if(state.gameMode==='ordina') return viewOrdina();
    else if(state.gameMode==='rollread') return viewRollRead();
    else if(state.gameMode==='sincontr') return viewSinContr();
    else if(state.gameMode==='alterati') return viewAlterati();
    else if(state.gameMode==='composti') return viewComposti();
    else if(state.gameMode==='anagramma') return viewAnagramma();
    else if(state.gameMode==='sfidamista') return viewSfidaMista();
  }
  return '';
}
/* Applica il nuovo HTML. Se il browser supporta le View Transitions (ormai quasi tutti,
   settembre 2026: Chrome/Edge/Safari/Firefox), il cambio tra una schermata e l'altra fa
   una breve dissolvenza automatica invece di scattare di colpo — senza dover animare
   ogni singolo elemento a mano. Nei browser che non la supportano, funziona come prima. */
function render(){
  const apply = () => {
    renderTopbar();
    const app = document.getElementById('app');
    app.innerHTML = computeAppHtml();
    window.scrollTo(0,0);
  };
  if(typeof document !== 'undefined' && document.startViewTransition){
    document.startViewTransition(apply);
  } else {
    apply();
  }
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
