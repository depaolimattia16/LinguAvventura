/* ============ ANALISI GRAMMATICALE (nome / aggettivo / articolo / verbo / pronome / preposizione / avverbio) ============ */
const TIPO_PAROLA_OPTS = ['nome','verbo','aggettivo','articolo','pronome','preposizione','avverbio'];
const ANALYSIS_CONFIG = {
  nome:{
    icon:'📛', label:'Nome',
    poolFilter:w=>w.t==='nome',
    skillsKey:'nomiSkills',
    order:['tipo','categoria','forma','genere','numero'],
    stepDef:{
      tipo_parola:{q:'Che cos\'è questa parola?', opts:TIPO_PAROLA_OPTS, labels:TIPI_LABELS, field:'t'},
      tipo:{q:'Che tipo di nome è?', opts:['comune','proprio'], labels:NOMETIPO_LABELS, field:'tipo'},
      categoria:{q:'Indica una...', opts:['persona','animale','cosa'], labels:CAT_LABELS, field:'cat'},
      forma:{q:'È concreto, astratto o collettivo?', opts:['concreto','astratto','collettivo'], labels:FORMA_LABELS, field:'forma'},
      genere:{q:'Genere?', opts:['m','f'], labels:GEN_LABELS, field:'gen'},
      numero:{q:'Numero?', opts:['s','p'], labels:NUM_LABELS, field:'num'},
    }
  },
  aggettivo:{
    icon:'🎨', label:'Aggettivo',
    poolFilter:w=>w.t==='aggettivo',
    skillsKey:'aggSkills',
    order:['sottotipo','genere','numero'],
    stepDef:{
      tipo_parola:{q:'Che cos\'è questa parola?', opts:TIPO_PAROLA_OPTS, labels:TIPI_LABELS, field:'t'},
      sottotipo:{q:'Che tipo di aggettivo è?', opts:['qualificativo','possessivo','dimostrativo'], labels:AGGTIPO_LABELS, field:'sottotipo'},
      genere:{q:'Genere?', opts:['m','f'], labels:GEN_LABELS, field:'gen'},
      numero:{q:'Numero?', opts:['s','p'], labels:NUM_LABELS, field:'num'},
    }
  },
  articolo:{
    icon:'🔤', label:'Articolo',
    poolFilter:w=>w.t==='articolo',
    skillsKey:'artSkills',
    order:['tipo','genere','numero'],
    stepDef:{
      tipo_parola:{q:'Che cos\'è questa parola?', opts:TIPO_PAROLA_OPTS, labels:TIPI_LABELS, field:'t'},
      tipo:{q:'Determinativo o indeterminativo?', opts:['determinativo','indeterminativo'], labels:ARTTIPO_LABELS, field:'tipo'},
      genere:{q:'Genere?', opts:['m','f'], labels:GEN_LABELS, field:'gen'},
      numero:{q:'Numero?', opts:['s','p'], labels:NUM_LABELS, field:'num'},
    }
  },
  verbo:{
    icon:'🏃', label:'Verbo',
    poolFilter:w=>w.t==='verbo' && !!w.persona && !!settings.verboBasi[w.base],
    skillsKey:'verboSkills',
    order:['persona','numero','tempo','modo'],
    stepDef:{
      tipo_parola:{q:'Che cos\'è questa parola?', opts:TIPO_PAROLA_OPTS, labels:TIPI_LABELS, field:'t'},
      persona:{q:'Che persona è?', opts:['1','2','3'], labels:PERSONA_LABELS, field:'persona'},
      numero:{q:'Numero?', opts:['s','p'], labels:NUM_LABELS, field:'num'},
      tempo:{q:'Tempo?', opts:['presente','imperfetto','futuro'], labels:TEMPO_LABELS, field:'tempo'},
      modo:{q:'Modo?', opts:['indicativo','congiuntivo','condizionale','imperativo'], labels:MODO_LABELS, field:'modo'},
    }
  },
  pronome:{
    icon:'👤', label:'Pronome',
    poolFilter:w=>w.t==='pronome',
    skillsKey:'pronomeSkills',
    order:['persona','numero'],
    stepDef:{
      tipo_parola:{q:'Che cos\'è questa parola?', opts:TIPO_PAROLA_OPTS, labels:TIPI_LABELS, field:'t'},
      persona:{q:'Che persona è?', opts:['1','2','3'], labels:PERSONA_LABELS, field:'persona'},
      numero:{q:'Numero?', opts:['s','p'], labels:NUM_LABELS, field:'num'},
    }
  },
  preposizione:{
    icon:'🔗', label:'Preposizione',
    poolFilter:w=>w.t==='preposizione',
    skillsKey:'preposizioneSkills',
    order:['tipo'],
    stepDef:{
      tipo_parola:{q:'Che cos\'è questa parola?', opts:TIPO_PAROLA_OPTS, labels:TIPI_LABELS, field:'t'},
      tipo:{q:'Semplice o articolata?', opts:['semplice','articolata'], labels:PREPTIPO_LABELS, field:'tipo'},
    }
  },
  avverbio:{
    icon:'🌤️', label:'Avverbio',
    poolFilter:w=>w.t==='avverbio',
    skillsKey:'avverbioSkills',
    order:['tipo'],
    stepDef:{
      tipo_parola:{q:'Che cos\'è questa parola?', opts:TIPO_PAROLA_OPTS, labels:TIPI_LABELS, field:'t'},
      tipo:{q:'Di che tipo è questo avverbio?', opts:['tempo','luogo','modo','quantita'], labels:AVVTIPO_LABELS, field:'tipo'},
    }
  }
};
function activeStepsFor(type){
  const cfg = ANALYSIS_CONFIG[type];
  const sk = settings[cfg.skillsKey];
  return ['tipo_parola', ...cfg.order.filter(s=>sk[s])];
}
function poolFor(type){
  return WORDS.filter(ANALYSIS_CONFIG[type].poolFilter);
}
function goAnalizzaChoose(){ state.view='analizzaChoose'; render(); }
function viewAnalizzaChoose(){
  const types = sortedKeysByLabel(['nome','aggettivo','articolo','verbo','pronome','preposizione','avverbio'], Object.fromEntries(Object.entries(ANALYSIS_CONFIG).map(([k,v])=>[k,v.label])));
  const cards = types.map(t=>{
    const n = activeStepsFor(t).length;
    const hasWords = poolFor(t).length>0;
    const status = !hasWords ? 'Nessuna parola attiva' : (n>0?n+' caratteristiche attive':'Nessuna caratteristica attiva');
    return `<button class="mode-card" onclick="startAnalizza('${t}')"><span class="emoji">${ANALYSIS_CONFIG[t].icon}</span><div class="txt"><strong>${ANALYSIS_CONFIG[t].label}</strong><span>${status}</span></div></button>`;
  }).join('');
  return `
  <h2>Analisi grammaticale</h2>
  <p class="hint">Scegli una parola a caso, una parte del discorso precisa, o analizza una frase intera.</p>
  <div class="mode-list">
    <button class="mode-card" onclick="startAnalizza(null)"><span class="emoji">🎲</span><div class="txt"><strong>Casuale</strong><span>Una parte del discorso a sorpresa</span></div></button>
    <button class="mode-card" onclick="startAnalizzaTutto()"><span class="emoji">📖</span><div class="txt"><strong>Frase intera</strong><span>Una frase intera, parola per parola</span></div></button>
    ${cards}
  </div>`;
}
function startAnalizza(forcedType){
  state.gameMode='analizza';
  let type = forcedType;
  if(!type){
    const candidates = ['nome','aggettivo','articolo','verbo','pronome','preposizione','avverbio'].filter(t=>activeStepsFor(t).length>0 && poolFor(t).length>0);
    if(candidates.length===0){ state.game={error:true}; state.view='game'; render(); return; }
    type = pickRandom(candidates);
  }
  const steps = activeStepsFor(type);
  const pool = poolFor(type);
  if(steps.length===0 || pool.length===0){ state.game={error:true}; state.view='game'; render(); return; }
  const word = pickRandom(pool);
  state.game = {type, word, steps, stepIndex:0, answered:false, forcedType};
  state.view='game'; render();
}
function viewAnalizza(){
  const g = state.game;
  if(g.error){
    return `<div class="quiz-card"><h2>Attiva un argomento</h2><p>Vai su <strong>Argomenti</strong> e attiva almeno una caratteristica (o almeno un verbo, per l'analisi del verbo) da analizzare.</p><button class="btn btn-ink" onclick="goSettings()">Vai agli argomenti</button></div>`;
  }
  if(g.stepIndex >= g.steps.length){
    return analizzaSummary(g);
  }
  const cfg = ANALYSIS_CONFIG[g.type];
  const stepKey = g.steps[g.stepIndex];
  const sq = cfg.stepDef[stepKey];
  const optsHtml = sq.opts.map(opt=>{
    let cls='option-btn';
    if(g.answered){
      if(opt===g.word[sq.field]) cls+=' correct';
      else if(opt===g.chosen) cls+=' wrong';
    }
    return `<button class="${cls}" ${g.answered?'disabled':''} onclick="answerAnalizza('${opt}')">${sq.labels[opt]}</button>`;
  }).join('');
  return `
  <div class="progress-line">${cfg.label} · Parola ${g.stepIndex+1} di ${g.steps.length}</div>
  <div class="quiz-card">
    <div class="quiz-prompt">${sq.q}</div>
    <div class="quiz-word">${g.word.w}</div>
    <div class="options-grid">${optsHtml}</div>
    ${g.answered ? feedbackBlock(g.chosen===g.word[sq.field], null, 'nextAnalizzaStep()') : ''}
  </div>`;
}
function answerAnalizza(opt){
  const g = state.game;
  if(g.answered) return;
  const cfg = ANALYSIS_CONFIG[g.type];
  const stepKey = g.steps[g.stepIndex];
  const field = cfg.stepDef[stepKey].field;
  g.answered=true; g.chosen=opt;
  const correct = opt===g.word[field];
  recordAnswer(correct, 'analizza:'+g.type+':'+stepKey);
  render();
}
function nextAnalizzaStep(){
  const g = state.game;
  g.stepIndex++; g.answered=false; g.chosen=null;
  if(g.stepIndex>=g.steps.length){
    addXP(15);
    awardBadge('prima_analisi');
  }
  render();
}
function analizzaSummary(g){
  const cfg = ANALYSIS_CONFIG[g.type];
  const rows = g.steps.map(stepKey=>{
    const sq = cfg.stepDef[stepKey];
    return sq.labels[g.word[sq.field]];
  });
  return `
  <div class="quiz-card">
    <div class="quiz-prompt">🎉 Analisi completata!</div>
    <div class="quiz-word">${g.word.w}</div>
    <p style="font-family:'Baloo 2';color:var(--ink-soft)">${cfg.label} · ${rows.join(' · ')}</p>
    <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-top:14px">
      <button class="btn btn-coral" onclick="startAnalizza(${g.forcedType?"'"+g.forcedType+"'":'null'})">Un'altra parola</button>
      <button class="btn btn-ghost" onclick="goAnalizzaChoose()">Cambia tipo</button>
      <button class="btn btn-ghost" onclick="goModeSelect()">Altre sfide</button>
    </div>
  </div>`;
}
