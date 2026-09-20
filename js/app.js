/* ============ INIT ============ */
/* Il database (parole, frasi, ortografia) vive in file JSON dentro /data,
   così è modificabile e consultabile senza toccare il codice. */
async function loadContentData(){
  const [words, sentences, ortho, primitiviData, teoria, sinContr, alterati, composti, anagrammi] = await Promise.all([
    fetch('data/words.json').then(r=>r.json()),
    fetch('data/sentences.json').then(r=>r.json()),
    fetch('data/ortografia.json').then(r=>r.json()),
    fetch('data/primitivi-derivati.json').then(r=>r.json()),
    fetch('data/teoria.json').then(r=>r.json()),
    fetch('data/sinonimi-contrari.json').then(r=>r.json()),
    fetch('data/nomi-alterati.json').then(r=>r.json()),
    fetch('data/nomi-composti.json').then(r=>r.json()),
    fetch('data/anagrammi.json').then(r=>r.json()),
  ]);
  WORDS = words;
  SENTENCES = sentences;
  fillOrthoBanks(ortho);
  PRIMITIVI_FAMIGLIE = primitiviData.famiglie;
  PRIMITIVI_DERIVATI = [];
  PRIMITIVI_FAMIGLIE.forEach(f=>{
    PRIMITIVI_DERIVATI.push({w:f.primitivo, tipo:'primitivo'});
    f.derivati.forEach(d=> PRIMITIVI_DERIVATI.push({w:d, tipo:'derivato'}));
  });
  TEORIA = teoria;
  SINONIMI_CONTRARI = sinContr;
  NOMI_ALTERATI_FAMIGLIE = alterati.famiglie;
  NOMI_ALTERATI = [];
  NOMI_ALTERATI_FAMIGLIE.forEach(f=>{
    f.alterati.forEach(a=> NOMI_ALTERATI.push({w:a.w, tipo:a.tipo, base:f.base}));
  });
  NOMI_COMPOSTI = composti;
  ANAGRAMMI = anagrammi;
}

loadContentData().then(()=>{
  touchStreak();
  // Il nickname si chiede solo se Supabase è configurato (altrimenti non servirebbe a nulla):
  // così l'app resta a zero attrito finché non decidi tu di collegare le statistiche.
  state.view = (supabaseClient && !getNickname()) ? 'nickname' : 'home';
  render();
  if(supabaseClient){
    flushPendingQueue(); // riprova a spedire eventuali risposte rimaste in sospeso
    trackSiteVisit(); // conta la visita (al massimo una volta al giorno per dispositivo)
  }
}).catch(err=>{
  console.error('Errore nel caricamento dei dati:', err);
  const app = document.getElementById('app');
  if(app){
    app.innerHTML = `
    <div class="quiz-card">
      <h2>Non riesco a caricare i dati</h2>
      <p>Questa pagina deve essere aperta tramite un server locale, non con doppio click sul file.</p>
      <p class="hint">Nella cartella del progetto lancia: <code>npx serve .</code>, poi apri l'indirizzo che ti stampa a schermo.</p>
    </div>`;
  }
});