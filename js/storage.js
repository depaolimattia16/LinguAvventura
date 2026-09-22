/* ============ STORAGE ============ */
function loadSettings(){
  const defaults = {
    questionCount:10,
    tipi:{nome:true, verbo:true, aggettivo:true, articolo:true, pronome:true, preposizione:true, avverbio:true},
    nomiSkills:{tipo:true, categoria:true, forma:true, genere:true, numero:true},
    aggSkills:{sottotipo:true, genere:true, numero:true},
    artSkills:{tipo:true, genere:true, numero:true},
    verboSkills:{persona:true, numero:true, tempo:true, modo:true},
    verboBasi:{essere:true, avere:true, parlare:false, credere:false, dormire:false},
    pronomeSkills:{persona:true, numero:true},
    preposizioneSkills:{tipo:true},
    avverbioSkills:{tipo:true}
  };
  try{
    const raw = localStorage.getItem('lv_settings');
    if(raw){
      const p = JSON.parse(raw);
      return {
        questionCount:p.questionCount || defaults.questionCount,
        tipi:{...defaults.tipi, ...(p.tipi||{})},
        nomiSkills:{...defaults.nomiSkills, ...(p.nomiSkills||{})},
        aggSkills:{...defaults.aggSkills, ...(p.aggSkills||{})},
        artSkills:{...defaults.artSkills, ...(p.artSkills||{})},
        verboSkills:{...defaults.verboSkills, ...(p.verboSkills||{})},
        verboBasi:{...defaults.verboBasi, ...(p.verboBasi||{})},
        pronomeSkills:{...defaults.pronomeSkills, ...(p.pronomeSkills||{})},
        preposizioneSkills:{...defaults.preposizioneSkills, ...(p.preposizioneSkills||{})},
        avverbioSkills:{...defaults.avverbioSkills, ...(p.avverbioSkills||{})}
      };
    }
  }catch(e){}
  return defaults;
}
function saveSettings(){
  try{ localStorage.setItem('lv_settings', JSON.stringify(settings)); }catch(e){}
}
function loadProgress(){
  try{
    const raw = localStorage.getItem('lv_progress');
    if(raw) return JSON.parse(raw);
  }catch(e){}
  return {xp:0,totalCorrect:0,totalAnswered:0,lastPlayDate:null,streak:0,badges:[],recordLampo:0,giochiCompletati:0};
}
function saveProgress(){
  try{ localStorage.setItem('lv_progress', JSON.stringify(progress)); }catch(e){}
}

let settings = loadSettings();
let progress = loadProgress();
let sessionCorrectStreak = 0;

function dateStr(d){ return d.toISOString().slice(0,10); }
function touchStreak(){
  const today = dateStr(new Date());
  if(progress.lastPlayDate === today) return;
  if(progress.lastPlayDate){
    const y = new Date(); y.setDate(y.getDate()-1);
    if(progress.lastPlayDate === dateStr(y)) progress.streak += 1;
    else progress.streak = 1;
  } else {
    progress.streak = 1;
  }
  progress.lastPlayDate = today;
  if(progress.streak >= 7) awardBadge('settimana_di_fuoco');
  saveProgress();
}

function addXP(n){ progress.xp += n; saveProgress(); renderTopbar(); }

function recordAnswer(correct, topic){
  progress.totalAnswered++;
  if(correct){
    progress.totalCorrect++;
    sessionCorrectStreak++;
    if(sessionCorrectStreak >= 10) awardBadge('dieci_di_fila');
  } else {
    sessionCorrectStreak = 0;
  }
  if(progress.totalCorrect >= 100) awardBadge('cento_risposte');
  saveProgress();
  logAttempt(topic || 'sconosciuto', correct);
  if(correct) playCorrectSound(); else playWrongSound();
}

function awardBadge(id){
  if(!progress.badges.includes(id)){
    progress.badges.push(id);
    saveProgress();
    showToast((BADGES_META[id]?.ic||'🏅') + '  Nuovo traguardo: ' + (BADGES_META[id]?.nm||id));
  }
}

let toastTimer=null;
function showToast(msg){
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=>el.classList.remove('show'), 2600);
}
