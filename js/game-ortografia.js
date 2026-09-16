/* ============ ORTOGRAFIA: più regole ============ */
const CEGE_WORDS = [
  {s:'arancia',ok:'arance',bad:'arancie'},
  {s:'pioggia',ok:'piogge',bad:'pioggie'},
  {s:'faccia',ok:'facce',bad:'faccie'},
  {s:'provincia',ok:'province',bad:'provincie'},
  {s:'focaccia',ok:'focacce',bad:'focaccie'},
  {s:'spiaggia',ok:'spiagge',bad:'spiaggie'},
  {s:'freccia',ok:'frecce',bad:'freccie'},
  {s:'roccia',ok:'rocce',bad:'roccie'},
  {s:'minaccia',ok:'minacce',bad:'minaccie'},
  {s:'guancia',ok:'guance',bad:'guancie'},
  {s:'mancia',ok:'mance',bad:'mancie'},
  {s:'doccia',ok:'docce',bad:'doccie'},
  {s:'lancia',ok:'lance',bad:'lancie'},
  {s:'bilancia',ok:'bilance',bad:'bilancie'},
  {s:'farmacia',ok:'farmacie',bad:'farmace'},
  {s:'valigia',ok:'valigie',bad:'valige'},
  {s:'ciliegia',ok:'ciliegie',bad:'ciliege'},
  {s:'camicia',ok:'camicie',bad:'camice'},
  {s:'magia',ok:'magie',bad:'mage'},
  {s:'bugia',ok:'bugie',bad:'buge'},
  {s:'allergia',ok:'allergie',bad:'allerge'},
  {s:'energia',ok:'energie',bad:'energe'},
];
const SCESCI_WORDS = [
  {ok:'pesce',bad:'pescie'},{ok:'scendere',bad:'sciendere'},{ok:'nascere',bad:'nasciere'},
  {ok:'crescere',bad:'cresciere'},{ok:'scena',bad:'sciena'},{ok:'scemo',bad:'sciemo'},
  {ok:'scienza',bad:'scenza'},{ok:'coscienza',bad:'coscenza'},
];
const GLILI_WORDS = [
  {ok:'figlio',bad:'filio'},{ok:'famiglia',bad:'familia'},{ok:'foglia',bad:'folia'},
  {ok:'aglio',bad:'alio'},{ok:'quaglia',bad:'qualia'},{ok:'maglia',bad:'malia'},
  {ok:'bottiglia',bad:'botilia'},{ok:'voglio',bad:'volio'},{ok:'luglio',bad:'lulio'},
  {ok:'egli',bad:'eli'},
];
const CUQU_WORDS = [
  {ok:'cuore',bad:'quore'},{ok:'scuola',bad:'squola'},{ok:'cuoco',bad:'quoco'},
  {ok:'cuoio',bad:'quoio'},{ok:'quaderno',bad:'cuaderno'},{ok:'questo',bad:'cuesto'},
  {ok:'quadro',bad:'cuadro'},{ok:'quando',bad:'cuando'},{ok:'acqua',bad:'acua'},
  {ok:'acquario',bad:'aquario'},{ok:'nacque',bad:'naque'},{ok:'soqquadro',bad:'soquadro'},
];
const DOPPIE_WORDS = [
  {ok:'mamma',bad:'mama'},{ok:'gatto',bad:'gato'},{ok:'bello',bad:'belo'},
  {ok:'tutto',bad:'tuto'},{ok:'sabbia',bad:'sabia'},{ok:'gomma',bad:'goma'},
  {ok:'pallone',bad:'palone'},{ok:'farfalla',bad:'farfala'},{ok:'freddo',bad:'fredo'},
  {ok:'mattina',bad:'matina'},{ok:'gallina',bad:'galina'},{ok:'fratello',bad:'fratelo'},
  {ok:'cappello',bad:'capelo'},
];
const LETTERAH_WORDS = [
  {sentence:'Io ___ un cane.', ok:'ho', bad:'o'},
  {sentence:'Io ___ fatto i compiti.', ok:'ho', bad:'o'},
  {sentence:'Non ___ tempo.', ok:'ho', bad:'o'},
  {sentence:'Tu ___ ragione.', ok:'hai', bad:'ai'},
  {sentence:'___ visto il film?', ok:'hai', bad:'ai'},
  {sentence:'Quanti anni ___?', ok:'hai', bad:'ai'},
  {sentence:'Lei ___ sete.', ok:'ha', bad:'a'},
  {sentence:'Marco ___ un fratello.', ok:'ha', bad:'a'},
  {sentence:'Il gatto ___ fame.', ok:'ha', bad:'a'},
  {sentence:'Loro ___ fame.', ok:'hanno', bad:'anno'},
  {sentence:'I bambini ___ giocato.', ok:'hanno', bad:'anno'},
  {sentence:'Non ___ capito.', ok:'hanno', bad:'anno'},
];
const ORTHO_TOPICS = {
  cege:{label:'Ce/Cie - Ge/Gie', mode:'transform', bank:CEGE_WORDS},
  scesci:{label:'Sce - Sci', mode:'pick', bank:SCESCI_WORDS},
  glili:{label:'Gli - Li', mode:'pick', bank:GLILI_WORDS},
  cuqu:{label:'Cu - Qu - Cqu - Qqu', mode:'pick', bank:CUQU_WORDS},
  doppie:{label:'Le doppie', mode:'pick', bank:DOPPIE_WORDS},
  letterah:{label:'La lettera H', mode:'sentence', bank:LETTERAH_WORDS},
};
function goOrtografiaChoose(){ state.view='ortografiaChoose'; render(); }
function viewOrtografiaChoose(){
  const cards = Object.keys(ORTHO_TOPICS).map(k=>
    `<button class="mode-card" onclick="startOrtografiaTopic('${k}')"><span class="emoji">🔤</span><div class="txt"><strong>${ORTHO_TOPICS[k].label}</strong></div></button>`
  ).join('');
  return `
  <h2>Ortografia</h2>
  <p class="hint">Scegli su quale regola vuoi allenarti.</p>
  <div class="mode-list">${cards}</div>`;
}
function startOrtografiaTopic(topicKey){
  state.gameMode='ortografia';
  state.game={topic:topicKey,qIndex:0,total:10,score:0};
  nextOrtografiaQuestion();
  state.view='game'; render();
}
function nextOrtografiaQuestion(){
  const bank = ORTHO_TOPICS[state.game.topic].bank;
  const item = pickRandom(bank);
  const options = shuffle([item.ok, item.bad]);
  state.game.current = {item, options, answered:false};
}
function viewOrtografia(){
  const g = state.game;
  const topic = ORTHO_TOPICS[g.topic];
  if(g.qIndex >= g.total){
    return roundSummary(g.score, g.total, 'ortografia');
  }
  const c = g.current;
  const tileClass = topic.mode==='pick' ? 'word-tile' : 'option-btn';
  const optsHtml = c.options.map(opt=>{
    let cls = tileClass;
    if(c.answered){
      if(opt===c.item.ok) cls+=' correct';
      else if(opt===c.chosen) cls+=' wrong';
    }
    return `<button class="${cls}" ${c.answered?'disabled':''} onclick="answerOrtografia('${opt}')">${opt}</button>`;
  }).join('');
  const promptText = topic.mode==='transform' ? "Qual è il plurale corretto di..." : (topic.mode==='sentence' ? '' : "Quale delle due è scritta bene?");
  const wordText = topic.mode==='transform' ? c.item.s : (topic.mode==='sentence' ? c.item.sentence : '');
  return `
  <div class="progress-line">${topic.label} · Domanda ${g.qIndex+1} di ${g.total} · Punteggio: ${g.score}</div>
  <div class="quiz-card">
    ${promptText ? `<div class="quiz-prompt">${promptText}</div>` : ''}
    ${wordText ? `<div class="quiz-word" style="${topic.mode==='sentence'?'font-size:1.5rem':''}">${wordText}</div>` : ''}
    <div class="${topic.mode==='pick'?'quiz-grid-4':'options-grid'}">${optsHtml}</div>
    ${c.answered ? feedbackBlock(c.chosen===c.item.ok, null, 'nextOrtografiaBtn()') : ''}
  </div>`;
}
function answerOrtografia(opt){
  const c = state.game.current;
  if(c.answered) return;
  c.answered=true; c.chosen=opt;
  const correct = opt===c.item.ok;
  if(correct){ state.game.score++; addXP(10); }
  recordAnswer(correct);
  render();
}
function nextOrtografiaBtn(){
  state.game.qIndex++;
  if(state.game.qIndex < state.game.total) nextOrtografiaQuestion();
  else finishRound();
  render();
}
