/* ============ MODALITÀ INSEGNANTE: CREA DETTATO ============ */
/* La divisione in sillabe non c'entra con un dettato (non si "sente" un trattino
   pronunciato): la escludiamo dagli argomenti disponibili qui. */
const DETTATO_TOPICS = Object.keys(ORTHO_TOPICS).filter(k=>k!=='sillabe');

function goDettatoChoose(){
  if(!state.dettatoTopics) state.dettatoTopics = ['cege'];
  if(!state.dettatoFormat) state.dettatoFormat = 'lista';
  if(!state.dettatoCount) state.dettatoCount = 15;
  state.view = 'dettatoChoose';
  render();
}
function toggleDettatoTopic(k){
  const list = state.dettatoTopics;
  const idx = list.indexOf(k);
  if(idx>=0) list.splice(idx,1); else list.push(k);
  render();
}
function setDettatoFormat(f){ state.dettatoFormat = f; render(); }
function setDettatoCount(n){ state.dettatoCount = n; render(); }

function viewDettatoChoose(){
  const selected = state.dettatoTopics;
  const rows = sortedKeysByLabel(DETTATO_TOPICS, Object.fromEntries(DETTATO_TOPICS.map(k=>[k,ORTHO_TOPICS[k].label]))).map(k=>{
    const checked = selected.includes(k);
    return `<label class="check-row"><input type="checkbox" ${checked?'checked':''} onchange="toggleDettatoTopic('${k}')"> ${ORTHO_TOPICS[k].label}</label>`;
  }).join('');
  const hasSentenceTopics = selected.some(k=>ORTHO_TOPICS[k].mode==='sentence');
  const unitLabel = state.dettatoFormat==='lista' ? 'parole' : 'frasi';
  return `
  <h2>Crea dettato</h2>
  <p class="hint">Scegli su quali regole far esercitare la classe. Puoi selezionarne più di una.</p>
  <div class="settings-block">
    <h3>Argomenti</h3>
    ${rows}
  </div>
  <div class="settings-block">
    <h3>Formato</h3>
    <label class="check-row"><input type="radio" name="dettformat" ${state.dettatoFormat==='lista'?'checked':''} onchange="setDettatoFormat('lista')"> Lista di parole</label>
    <label class="check-row"><input type="radio" name="dettformat" ${state.dettatoFormat==='testo'?'checked':''} onchange="setDettatoFormat('testo')"> Testo (frasi da dettare)</label>
    ${state.dettatoFormat==='testo' && !hasSentenceTopics ? `<p class="hint">⚠️ Il testo è disponibile solo per Accento, La lettera H e Punteggiatura: seleziona almeno uno di questi tre, oppure passa a "Lista di parole".</p>` : ''}
  </div>
  <div class="settings-block">
    <h3>Quante ${unitLabel}</h3>
    <div style="display:flex;gap:8px;flex-wrap:wrap">
      ${[10,15,20,25].map(n=>`<button class="btn ${state.dettatoCount===n?'btn-coral':'btn-ghost'}" onclick="setDettatoCount(${n})">${n}</button>`).join('')}
    </div>
  </div>
  <button class="btn btn-coral" style="margin-top:16px;width:100%" onclick="generateDettato()">Crea dettato</button>`;
}

function generateDettato(){
  const topics = state.dettatoTopics;
  if(topics.length===0){ showToast('Scegli almeno un argomento'); return; }
  if(state.dettatoFormat==='testo'){
    const sentenceTopics = topics.filter(k=>ORTHO_TOPICS[k].mode==='sentence');
    if(sentenceTopics.length===0){ showToast('Per il testo serve almeno un argomento tra Accento, Lettera H o Punteggiatura'); return; }
    const pool = [];
    sentenceTopics.forEach(k=> ORTHO_TOPICS[k].bank.forEach(item=> pool.push({topicKey:k,item})));
    const picked = makeUniqueQueue(pool, state.dettatoCount);
    state.dettato = {
      format:'testo',
      topics: sentenceTopics.map(k=>ORTHO_TOPICS[k].label),
      sentences: picked.map(p=>p.item.sentence.replace('___', p.item.ok)),
      answers: picked.map(p=>p.item.ok),
    };
  } else {
    const pool = [];
    topics.forEach(k=>{
      ORTHO_TOPICS[k].bank.forEach(item=> pool.push(item.ok));
    });
    const words = makeUniqueQueue(pool, state.dettatoCount);
    state.dettato = {
      format:'lista',
      topics: topics.map(k=>ORTHO_TOPICS[k].label),
      words,
    };
  }
  state.view = 'dettatoResult';
  render();
}

function viewDettatoResult(){
  const d = state.dettato;
  const topicsLine = d.topics.join(', ');
  let bodyHtml;
  if(d.format==='lista'){
    bodyHtml = `<ol class="dettato-list">${d.words.map(w=>`<li>${w}</li>`).join('')}</ol>`;
  } else {
    bodyHtml = `<div class="dettato-text">${d.sentences.map(s=>`<p>${s}</p>`).join('')}</div>`;
  }
  return `
  <h2>Dettato pronto</h2>
  <p class="hint">Argomenti: ${topicsLine}</p>
  <div class="quiz-card" style="text-align:left" id="dettato-content">
    ${bodyHtml}
  </div>
  <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-top:16px">
    <button class="btn btn-coral" onclick="generateDettato()">Un altro dettato uguale</button>
    <button class="btn btn-ghost" onclick="copyDettato()">Copia testo</button>
    <button class="btn btn-ghost" onclick="goDettatoChoose()">Cambia argomenti</button>
  </div>`;
}
function copyDettato(){
  const d = state.dettato;
  const text = d.format==='lista' ? d.words.join('\n') : d.sentences.join('\n');
  if(navigator.clipboard && navigator.clipboard.writeText){
    navigator.clipboard.writeText(text).then(
      ()=> showToast('Copiato! Incollalo dove vuoi (Word, stampa, ecc.)'),
      ()=> showToast('Non sono riuscito a copiare, seleziona il testo a mano')
    );
  } else {
    showToast('Copia non disponibile su questo dispositivo: seleziona il testo a mano');
  }
}
