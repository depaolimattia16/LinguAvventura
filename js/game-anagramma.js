/* ============ ANAGRAMMA (ricomponi la parola: tap sulle lettere sotto, tap su una lettera piazzata per toglierla) ============ */
const ANAGRAMMA_TOTAL = 8;
function startAnagramma(){
  state.gameMode='anagramma';
  state.view='game';
  state.anagram = {qIndex:0, total:ANAGRAMMA_TOTAL, score:0, current:null};
  nextAnagramma();
  render();
}
function nextAnagramma(){
  const word = pickRandom(ANAGRAMMI);
  const letters = shuffle(word.split('').map((ch,i)=>({ch, id:i, used:false})));
  state.anagram.current = {word, letters, placed:[], answered:false, correct:null};
}
function tapBankLetter(id){
  const c = state.anagram.current;
  if(c.answered) return;
  const letter = c.letters.find(l=>l.id===id && !l.used);
  if(!letter) return;
  letter.used = true;
  c.placed.push(letter);
  if(c.placed.length === c.word.length){
    const attempt = c.placed.map(l=>l.ch).join('');
    c.answered = true;
    c.correct = attempt === c.word;
    if(c.correct){ state.anagram.score++; addXP(10); }
    recordAnswer(c.correct, 'anagramma');
  }
  render();
}
function tapPlacedLetter(idx){
  const c = state.anagram.current;
  if(c.answered) return;
  const letter = c.placed[idx];
  letter.used = false;
  c.placed.splice(idx,1);
  render();
}
function retryAnagramma(){
  const c = state.anagram.current;
  c.placed.forEach(l=>{ l.used=false; });
  c.placed = [];
  c.answered = false;
  c.correct = null;
  render();
}
function nextAnagrammaBtn(){
  state.anagram.qIndex++;
  if(state.anagram.qIndex < state.anagram.total) nextAnagramma();
  render();
}
function viewAnagramma(){
  const g = state.anagram;
  if(g.qIndex >= g.total) return roundSummary(g.score, g.total, 'anagramma');
  const c = g.current;
  const slotsHtml = Array.from({length:c.word.length}).map((_,i)=>{
    const letter = c.placed[i];
    if(letter) return `<button class="anagram-slot filled" ${c.answered?'disabled':''} onclick="tapPlacedLetter(${i})">${letter.ch}</button>`;
    return `<div class="anagram-slot"></div>`;
  }).join('');
  const bankHtml = c.letters.filter(l=>!l.used).map(l=>
    `<button class="anagram-tile" onclick="tapBankLetter(${l.id})">${l.ch}</button>`
  ).join('');
  let feedbackHtml = '';
  if(c.answered){
    feedbackHtml = c.correct
      ? `<p class="feedback ok" style="margin-top:10px">✅ Giusto! È "${c.word}".</p><button class="btn btn-ink" style="margin-top:8px" onclick="nextAnagrammaBtn()">Avanti →</button>`
      : `<p class="feedback bad" style="margin-top:10px">❌ Non è "${c.placed.map(l=>l.ch).join('')}". Riprova!</p><button class="btn btn-ink" style="margin-top:8px" onclick="retryAnagramma()">Riprova</button>`;
  }
  return `
  <div class="progress-line">Parola ${g.qIndex+1} di ${g.total} · Punteggio: ${g.score}</div>
  <div class="quiz-card">
    <div class="quiz-prompt">Ricomponi la parola:</div>
    <div class="anagram-slots">${slotsHtml}</div>
    <div class="anagram-bank">${bankHtml}</div>
    ${feedbackHtml}
  </div>`;
}
