/* ============ SINCRONIZZAZIONE (nickname + invio risposte a Supabase) ============ */
let supabaseClient = null;
if(typeof window !== 'undefined' && window.supabase && SUPABASE_URL && SUPABASE_ANON_KEY){
  try{
    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }catch(e){
    console.error('Supabase non configurato correttamente:', e);
  }
}

function getNickname(){
  try{ return localStorage.getItem('lv_nickname') || null; }
  catch(e){ return null; }
}
function setNickname(name){
  try{ localStorage.setItem('lv_nickname', name); }catch(e){}
}
function clearNickname(){
  try{ localStorage.removeItem('lv_nickname'); }catch(e){}
}

/* Coda locale delle risposte non ancora inviate a Supabase: così, se manca
   la connessione (o Supabase non era ancora collegato), niente va perso —
   resta in attesa sul dispositivo finché non riesce a partire. */
function getPendingQueue(){
  try{ return JSON.parse(localStorage.getItem('lv_pending_attempts') || '[]'); }
  catch(e){ return []; }
}
function savePendingQueue(queue){
  try{ localStorage.setItem('lv_pending_attempts', JSON.stringify(queue)); }catch(e){}
}

/* Mette in coda una risposta e prova subito a spedirla. Non blocca mai il
   gioco: se Supabase non è configurato o non c'è ancora un nickname, non fa
   nulla (niente da mettere in coda, per lo stesso motivo per cui non si
   chiede il nickname senza Supabase configurato). */
function logAttempt(topic, correct){
  if(!supabaseClient) return;
  const nickname = getNickname();
  if(!nickname) return;
  const queue = getPendingQueue();
  queue.push({nickname, topic, correct, created_at:new Date().toISOString()});
  savePendingQueue(queue);
  flushPendingQueue();
}

let flushingQueue = false;
async function flushPendingQueue(){
  if(!supabaseClient || flushingQueue) return;
  flushingQueue = true;
  try{
    let queue = getPendingQueue();
    while(queue.length > 0){
      const item = queue[0];
      const { error } = await supabaseClient.from('attempts').insert(item);
      if(error){ break; } // problema di rete o simili: mi fermo, riproverò più tardi
      queue.shift();
      savePendingQueue(queue);
    }
  }catch(e){
    console.error('Sincronizzazione in sospeso, riproverò più tardi:', e);
  }
  flushingQueue = false;
}

/* Se sul dispositivo c'era già un po' di storico locale (XP/risposte) da
   PRIMA di scegliere un nickname, lo carica una volta sola come sintesi
   (senza il dettaglio per argomento, che prima non veniva registrato),
   così quel lavoro pregresso non sparisce dalle statistiche. */
function uploadHistoricalSummaryIfAny(){
  if(!supabaseClient) return;
  try{
    if(localStorage.getItem('lv_historical_uploaded')) return;
  }catch(e){ return; }
  if(!progress || progress.totalAnswered <= 0) return;
  const nickname = getNickname();
  if(!nickname) return;
  const correctCount = progress.totalCorrect;
  const wrongCount = Math.max(0, progress.totalAnswered - progress.totalCorrect);
  const queue = getPendingQueue();
  const now = new Date().toISOString();
  for(let i=0;i<correctCount;i++) queue.push({nickname, topic:'storico_precedente', correct:true, created_at:now});
  for(let i=0;i<wrongCount;i++) queue.push({nickname, topic:'storico_precedente', correct:false, created_at:now});
  savePendingQueue(queue);
  try{ localStorage.setItem('lv_historical_uploaded','1'); }catch(e){}
  flushPendingQueue();
}
