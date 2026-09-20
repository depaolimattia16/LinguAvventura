/* ============ TEORIA (schede di regole, contenuto da data/teoria.json) ============ */
function goTeoriaChoose(){ state.view='teoriaChoose'; render(); }
function viewTeoriaChoose(){
  const groupHtml = (group, label) => `
    <div class="mode-section-label">${label}</div>
    <div class="mode-list">
      ${[...TEORIA[group]].sort((a,b)=>stripLeadingArticle(a.title).localeCompare(stripLeadingArticle(b.title),'it')).map(t=>`<button class="mode-card" onclick="showTeoria('${group}','${t.key}')"><span class="emoji">${t.icon}</span><div class="txt"><strong>${t.title}</strong></div></button>`).join('')}
    </div>`;
  return `
  <h2>Teoria</h2>
  <p class="hint">Le regole spiegate in breve, con un link diretto all'esercizio.</p>
  ${groupHtml('grammatica','Grammatica')}
  <div style="height:14px"></div>
  ${groupHtml('ortografia','Ortografia')}`;
}
function showTeoria(group, key){
  state.view='teoriaPage';
  state.teoriaGroup = group;
  state.teoriaKey = key;
  render();
}
function viewTeoriaPage(){
  const t = (TEORIA[state.teoriaGroup] || []).find(x=>x.key===state.teoriaKey);
  if(!t) return `<div class="quiz-card"><p>Scheda non trovata.</p><button class="btn btn-ink" onclick="goTeoriaChoose()">Torna alla teoria</button></div>`;
  const esempiHtml = t.esempi.map(e=>`<li>${e}</li>`).join('');
  return `
  <div class="quiz-card" style="text-align:left">
    <div style="text-align:center;font-size:2rem">${t.icon}</div>
    <h2 style="text-align:center">${t.title}</h2>
    <div class="teoria-section">
      <div class="teoria-label">📖 Regola</div>
      <div class="teoria-text">${t.regola}</div>
    </div>
    <div class="teoria-section">
      <div class="teoria-label">✏️ Esempi</div>
      <ul class="teoria-esempi">${esempiHtml}</ul>
    </div>
    <div class="teoria-callout">
      <div class="teoria-label">⚠️ Eccezioni</div>
      <div class="teoria-text">${t.eccezioni}</div>
    </div>
    <button class="btn btn-coral" style="margin-top:16px;width:100%" onclick="${t.esercizio}">Esercitati ora →</button>
  </div>`;
}
