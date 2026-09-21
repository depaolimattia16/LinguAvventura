/* ============ MEMORIA (abbina primitivo e derivato della stessa famiglia) ============ */
const MEMORIA_PAIRS = 6;
function startMemoria(){
  state.gameMode = 'memoria';
  state.view = 'game';
  const usable = PRIMITIVI_FAMIGLIE.filter(f => f.derivati && f.derivati.length > 0);
  const chosenFamilies = shuffle(usable).slice(0, MEMORIA_PAIRS);
  const cards = [];
  chosenFamilies.forEach((f, i)=>{
    const derivato = pickRandom(f.derivati);
    cards.push({text:f.primitivo, family:i, matched:false});
    cards.push({text:derivato, family:i, matched:false});
  });
  state.memoria = {
    cards: shuffle(cards),
    firstIdx: null,
    secondIdx: null,
    resolved: true,
    matchedCount: 0,
    totalPairs: chosenFamilies.length,
    attempts: 0,
  };
  render();
}
function viewMemoria(){
  const m = state.memoria;
  if(m.matchedCount === m.totalPairs){
    return `
    <div class="quiz-card">
      <h2>🎉 Tutte le coppie trovate!</h2>
      <p>Tentativi impiegati: ${m.attempts}</p>
      <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-top:14px">
        <button class="btn btn-coral" onclick="startMemoria()">Gioca ancora</button>
        <button class="btn btn-ghost" onclick="goPrimitiviChoose()">Altre sfide</button>
      </div>
    </div>`;
  }
  const cardsHtml = m.cards.map((c, idx)=>{
    const isFlipped = idx===m.firstIdx || idx===m.secondIdx;
    let cls = 'memoria-card';
    if(c.matched) cls += ' matched';
    else if(isFlipped) cls += ' flipped';
    const label = (c.matched || isFlipped) ? c.text : '❓';
    return `<button class="${cls}" ${c.matched?'disabled':''} onclick="flipMemoriaCard(${idx})">${label}</button>`;
  }).join('');
  return `
  ${progressHeader('Coppie trovate: '+m.matchedCount+' di '+m.totalPairs, 'Tentativi: '+m.attempts)}
  <div class="memoria-grid">${cardsHtml}</div>
  ${!m.resolved ? `<button class="btn btn-ink" style="margin-top:14px;width:100%" onclick="continueMemoria()">Continua</button>` : ''}
  `;
}
function flipMemoriaCard(idx){
  const m = state.memoria;
  if(!m.resolved) return; // c'è ancora una coppia sbagliata da chiudere prima
  const card = m.cards[idx];
  if(card.matched || idx===m.firstIdx) return;
  if(m.firstIdx===null){
    m.firstIdx = idx;
    render();
    return;
  }
  m.secondIdx = idx;
  m.attempts++;
  const first = m.cards[m.firstIdx];
  const second = m.cards[m.secondIdx];
  if(first.family === second.family){
    first.matched = true;
    second.matched = true;
    m.matchedCount++;
    recordAnswer(true, 'memoria');
    m.firstIdx = null;
    m.secondIdx = null;
    m.resolved = true;
  } else {
    recordAnswer(false, 'memoria');
    m.resolved = false; // aspetta il tap su "Continua" prima di richiudere le carte
  }
  render();
}
function continueMemoria(){
  const m = state.memoria;
  m.firstIdx = null;
  m.secondIdx = null;
  m.resolved = true;
  render();
}
