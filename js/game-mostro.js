/* ============ MOSTRO DELLA GRAMMATICA ============ */
function startMostro(){
  state.gameMode='mostro';
  state.game={hp:10,lives:3,over:false,win:false};
  nextMostroQuestion();
  state.view='game'; render();
}
function nextMostroQuestion(){
  const tipiList = activeTipiList();
  const pool = wordsByTipi(tipiList);
  const word = pickRandom(pool);
  const options = shuffle(tipiList.slice());
  state.game.current = {word, options, answered:false};
}
function viewMostro(){
  const g = state.game;
  if(g.over){
    return `
    <div class="quiz-card">
      <h2>${g.win?'🏆 Mostro sconfitto!':'💥 Il mostro ha vinto questa volta...'}</h2>
      <p>${g.win?'Complimenti, hai risposto benissimo!':'Riprova, ce la puoi fare!'}</p>
      <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-top:14px">
        <button class="btn btn-coral" onclick="startMostro()">Rigioca</button>
        <button class="btn btn-ghost" onclick="goModeSelect()">Altre sfide</button>
      </div>
    </div>`;
  }
  const c = g.current;
  const optsHtml = c.options.map(t=>{
    let cls='option-btn';
    if(c.answered){
      if(t===c.word.t) cls+=' correct';
      else if(t===c.chosen) cls+=' wrong';
    }
    return `<button class="${cls}" ${c.answered?'disabled':''} onclick="answerMostro('${t}')">${TIPI_LABELS[t]}</button>`;
  }).join('');
  const heartsHtml = Array.from({length:3}).map((_,i)=>i<g.lives?'❤️':'🖤').join(' ');
  const pct = Math.max(0, g.hp/10*100);
  return `
  <div class="quiz-card">
    <div style="font-size:2.2rem">🐉</div>
    <div class="bar-bg" style="max-width:260px;margin:6px auto 4px"><div class="bar-fill" style="width:${pct}%;background:var(--coral)"></div></div>
    <div class="hint">Vita del mostro: ${g.hp}/10</div>
    <div class="hearts">${heartsHtml}</div>
    <div class="quiz-prompt" style="margin-top:14px">Che cos'è...</div>
    <div class="quiz-word">${c.word.w}</div>
    <div class="options-grid">${optsHtml}</div>
    ${c.answered ? feedbackBlock(c.chosen===c.word.t, null, 'nextMostroBtn()') : ''}
  </div>`;
}
function answerMostro(t){
  const c = state.game.current;
  if(c.answered) return;
  c.answered=true; c.chosen=t;
  const correct = t===c.word.t;
  recordAnswer(correct);
  if(correct) state.game.hp--;
  else state.game.lives--;
  render();
}
function nextMostroBtn(){
  const g = state.game;
  if(g.hp<=0){ g.over=true; g.win=true; addXP(30); awardBadge('cacciatore_di_mostri'); finishRound(); }
  else if(g.lives<=0){ g.over=true; g.win=false; finishRound(); }
  else nextMostroQuestion();
  render();
}
