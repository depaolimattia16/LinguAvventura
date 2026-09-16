/* ============ STATE / ROUTER ============ */
let state = { view:'home', gameMode:null, game:{} };

function goHome(){ clearIntervals(); state.view='home'; state.gameMode=null; render(); }
function goModeSelect(){ clearIntervals(); state.view='modeSelect'; render(); }
function goSettings(){ clearIntervals(); state.view='settings'; render(); }
function goProgress(){ clearIntervals(); state.view='progress'; render(); }
function clearIntervals(){ if(state.game && state.game.intervalId){ clearInterval(state.game.intervalId); } }

function render(){
  renderTopbar();
  const app = document.getElementById('app');
  if(state.view==='home') app.innerHTML = viewHome();
  else if(state.view==='modeSelect') app.innerHTML = viewModeSelect();
  else if(state.view==='settings') app.innerHTML = viewSettings();
  else if(state.view==='progress') app.innerHTML = viewProgress();
  else if(state.view==='classroomChoose') app.innerHTML = viewClassroomChoose();
  else if(state.view==='classroom') app.innerHTML = viewClassroom();
  else if(state.view==='classroomSplit') app.innerHTML = viewClassroomSplit();
  else if(state.view==='analizzaChoose') app.innerHTML = viewAnalizzaChoose();
  else if(state.view==='ortografiaChoose') app.innerHTML = viewOrtografiaChoose();
  else if(state.view==='game'){
    if(state.gameMode==='checose') app.innerHTML = viewCheCosE();
    else if(state.gameMode==='analizza') app.innerHTML = viewAnalizza();
    else if(state.gameMode==='intruso') app.innerHTML = viewIntruso();
    else if(state.gameMode==='lampo') app.innerHTML = viewLampo();
    else if(state.gameMode==='mostro') app.innerHTML = viewMostro();
    else if(state.gameMode==='ortografia') app.innerHTML = viewOrtografia();
    else if(state.gameMode==='analizzatutto') app.innerHTML = viewAnalizzaTutto();
    else if(state.gameMode==='misteriosa') app.innerHTML = viewParolaMisteriosa();
  }
  window.scrollTo(0,0);
}

const MAPPA_VIEWS = ['game','classroom','classroomSplit','classroomChoose','analizzaChoose','ortografiaChoose'];
function renderTopbar(){
  const tb = document.getElementById('topbar');
  if(state.view==='home'){ tb.innerHTML=''; return; }
  const onMappa = MAPPA_VIEWS.includes(state.view);
  tb.innerHTML = `
    <button class="back-btn" onclick="${onMappa ? 'goModeSelectOrHome()' : 'goHome()'}">‹ ${onMappa?'Mappa':'Home'}</button>
    <div class="stats">
      <span class="pill">⭐ ${progress.xp} XP</span>
      <span class="pill">🔥 ${progress.streak}</span>
    </div>`;
}
function goModeSelectOrHome(){
  if(state.view==='classroom' || state.view==='classroomSplit'){ goClassroomChoose(); return; }
  goModeSelect();
}
