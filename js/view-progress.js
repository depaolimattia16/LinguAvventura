/* ============ PROGRESS ============ */
function viewProgress(){
  const badgeHtml = Object.keys(BADGES_META).map(id=>{
    const got = progress.badges.includes(id);
    const m = BADGES_META[id];
    return `<div class="badge ${got?'':'locked'}"><div class="ic">${m.ic}</div><div class="nm">${m.nm}</div></div>`;
  }).join('');
  const acc = progress.totalAnswered>0 ? Math.round(progress.totalCorrect/progress.totalAnswered*100) : 0;
  return `
  <h2>I tuoi progressi</h2>
  <div class="stat-grid">
    <div class="stat-card"><div class="big">${progress.xp}</div><div class="lbl">XP totali</div></div>
    <div class="stat-card"><div class="big">${progress.streak}</div><div class="lbl">Giorni di fila</div></div>
    <div class="stat-card"><div class="big">${progress.totalCorrect}</div><div class="lbl">Risposte corrette</div></div>
    <div class="stat-card"><div class="big">${acc}%</div><div class="lbl">Precisione</div></div>
  </div>
  <p class="hint" style="margin-top:10px">Record Sfida Lampo: <strong>${progress.recordLampo}</strong></p>
  <h3 style="margin-top:20px">Medaglie</h3>
  <div class="badge-grid">${badgeHtml}</div>
  <button class="btn btn-ghost" style="margin-top:24px" onclick="resetProgress()">Azzera i progressi</button>`;
}
function resetProgress(){
  if(confirm('Vuoi davvero azzerare XP, medaglie e statistiche? Questa azione non si può annullare.')){
    progress = {xp:0,totalCorrect:0,totalAnswered:0,lastPlayDate:null,streak:0,badges:[],recordLampo:0,giochiCompletati:0};
    saveProgress();
    render();
  }
}
