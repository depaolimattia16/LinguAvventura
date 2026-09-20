/* ============ STATISTICHE DI CLASSE (legge da Supabase) ============ */
let classStats = null;
function goClassStats(){
  state.view = 'classStats';
  classStats = null;
  render();
  loadClassStats();
}
async function loadClassStats(){
  if(!supabaseClient){ classStats = {error:'not-configured'}; if(state.view==='classStats') render(); return; }
  try{
    const [attemptsRes, views] = await Promise.all([
      supabaseClient.from('attempts').select('nickname, topic, correct').limit(5000),
      getSiteViews(),
    ]);
    if(attemptsRes.error) throw attemptsRes.error;
    classStats = summarizeAttempts(attemptsRes.data || []);
    classStats.siteViews = views;
  }catch(e){
    console.error('Errore nel caricamento delle statistiche:', e);
    classStats = {error:'fetch-failed'};
  }
  if(state.view==='classStats') render();
}
function summarizeAttempts(rows){
  const byNickname = {};
  const byTopic = {};
  rows.forEach(r=>{
    if(!byNickname[r.nickname]) byNickname[r.nickname] = {tot:0, ok:0};
    byNickname[r.nickname].tot++; if(r.correct) byNickname[r.nickname].ok++;
    if(!byTopic[r.topic]) byTopic[r.topic] = {tot:0, ok:0};
    byTopic[r.topic].tot++; if(r.correct) byTopic[r.topic].ok++;
  });
  return {byNickname, byTopic, totalRows: rows.length};
}
function topicLabel(topic){
  return (topic || 'sconosciuto').split(':').join(' · ');
}
function statCardsFrom(obj, labelFn){
  return Object.keys(obj)
    .sort((a,b)=> (obj[a].ok/obj[a].tot) - (obj[b].ok/obj[b].tot))
    .map(key=>{
      const s = obj[key];
      const pct = Math.round(s.ok/s.tot*100);
      return `<div class="stat-card"><div class="big">${pct}%</div><div class="lbl">${labelFn(key)} · ${s.tot} risposte</div></div>`;
    }).join('');
}
function viewClassStats(){
  if(classStats===null){
    return `<h2>Statistiche di classe</h2><div class="quiz-card"><p class="hint" style="text-align:center">Caricamento...</p></div>`;
  }
  if(classStats.error==='not-configured'){
    return `
    <h2>Statistiche di classe</h2>
    <div class="quiz-card">
      <p>Per vedere le statistiche devi prima collegare Supabase: vedi il README, sezione "Statistiche di classe".</p>
      <p class="hint">Finché non lo colleghi, l'app funziona comunque normalmente in locale.</p>
    </div>`;
  }
  if(classStats.error){
    return `
    <h2>Statistiche di classe</h2>
    <div class="quiz-card">
      <p>Non riesco a leggere le statistiche in questo momento.</p>
      <button class="btn btn-ink" style="margin-top:10px" onclick="loadClassStats()">Riprova</button>
    </div>`;
  }
  const viewsLine = classStats.siteViews!=null ? `<p class="hint">👀 ${classStats.siteViews} visite al sito in totale (una al giorno per dispositivo).</p>` : '';
  if(classStats.totalRows===0){
    return `<h2>Statistiche di classe</h2>${viewsLine}<div class="quiz-card"><p>Nessuna risposta registrata ancora. Torna qui dopo che qualcuno avrà giocato.</p></div>`;
  }
  return `
  <h2>Statistiche di classe</h2>
  ${viewsLine}
  <p class="hint">${classStats.totalRows} risposte registrate in totale. In cima le cose più difficili.</p>
  <h3 style="margin-top:18px">Per studente</h3>
  <div class="stat-grid">${statCardsFrom(classStats.byNickname, n=>n)}</div>
  <h3 style="margin-top:18px">Per argomento</h3>
  <div class="stat-grid">${statCardsFrom(classStats.byTopic, topicLabel)}</div>
  <button class="btn btn-ghost" style="margin-top:18px" onclick="loadClassStats()">Aggiorna</button>`;
}
