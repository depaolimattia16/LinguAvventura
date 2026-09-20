/* ============ SFIDA LAMPO ============ */
function startLampo(){
  state.gameMode='lampo';
  state.game={score:0,timeLeft:60,running:true};
  nextLampoQuestion();
  state.game.intervalId = setInterval(()=>{
    state.game.timeLeft--;
    if(state.game.timeLeft<=0){
      clearInterval(state.game.intervalId);
      state.game.running=false;
      if(state.game.score > progress.recordLampo){ progress.recordLampo = state.game.score; }
      addXP(state.game.score*5);
      finishRound();
      saveProgress();
    }
    render();
  },1000);
  state.view='game'; render();
}
function nextLampoQuestion(){
  const tipiList = activeTipiList();
  const pool = wordsByTipi(tipiList);
  const word = pickRandom(pool);
  const options = tipiList.slice(); // ordine fisso: le etichette sono sempre le stesse, mescolarle è solo fastidioso
  state.game.current = {word, options};
}
function viewLampo(){
  const g = state.game;
  if(!g.running){
    return `
    <div class="quiz-card">
      <h2>⏱ Tempo scaduto!</h2>
      <div class="quiz-word" style="font-size:2.4rem">${g.score}</div>
      <p>Record personale: <strong>${progress.recordLampo}</strong></p>
      <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-top:14px">
        <button class="btn btn-coral" onclick="startLampo()">Rigioca</button>
        <button class="btn btn-ghost" onclick="goCheCosEChoose()">Altre sfide</button>
      </div>
    </div>`;
  }
  const c = g.current;
  const optsHtml = c.options.map(t=>`<button class="option-btn" onclick="answerLampo('${t}')">${TIPI_LABELS[t]}</button>`).join('');
  return `
  <div class="progress-line">⏱ ${g.timeLeft}s · Corrette: ${g.score}</div>
  <div class="quiz-card">
    <div class="quiz-prompt">Che cos'è...</div>
    <div class="quiz-word">${c.word.w}</div>
    <div class="options-grid">${optsHtml}</div>
  </div>`;
}
function answerLampo(t){
  const g = state.game;
  if(!g.running) return;
  const correct = t===g.current.word.t;
  if(correct) g.score++;
  recordAnswer(correct, 'lampo');
  nextLampoQuestion();
  render();
}
