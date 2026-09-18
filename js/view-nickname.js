/* ============ SCHERMATA NICKNAME (prima cosa vista, se non impostato) ============ */
function viewNickname(){
  return `
  <div class="hero">
    <h1>Come ti chiami?</h1>
    <p>Scrivi il tuo nome o un soprannome. Resta su questo dispositivo, così l'insegnante può vedere come vai.</p>
  </div>
  <div class="quiz-card">
    <input type="text" id="nickname-input" class="text-input" placeholder="Il tuo nome..." maxlength="24" autofocus>
    <button class="btn btn-coral" style="margin-top:14px;width:100%" onclick="submitNickname()">Continua</button>
  </div>`;
}
function submitNickname(){
  const input = document.getElementById('nickname-input');
  const name = ((input && input.value) || '').trim();
  if(!name){ showToast('Scrivi un nome per continuare'); return; }
  setNickname(name);
  uploadHistoricalSummaryIfAny();
  goHome();
}
function changeNickname(){
  if(confirm('Vuoi cambiare nome? (utile se sta per giocare qualcun altro su questo dispositivo)')){
    clearNickname();
    state.view = 'nickname';
    render();
  }
}
