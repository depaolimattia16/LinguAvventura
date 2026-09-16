/* ============ VIEW: HOME ============ */
function viewHome(){
  return `
  <div class="hero">
    <svg class="mascot" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="42" y="8" width="16" height="58" rx="6" fill="var(--sun)" stroke="var(--charcoal)" stroke-width="2"/>
      <polygon points="42,66 58,66 50,86" fill="#E8B892" stroke="var(--charcoal)" stroke-width="2"/>
      <rect x="42" y="8" width="16" height="10" fill="var(--coral)" stroke="var(--charcoal)" stroke-width="2"/>
      <circle cx="46" cy="34" r="2.4" fill="var(--charcoal)"/>
      <circle cx="54" cy="34" r="2.4" fill="var(--charcoal)"/>
      <path d="M45 42 Q50 47 55 42" stroke="var(--charcoal)" stroke-width="2" fill="none" stroke-linecap="round"/>
    </svg>
    <h1>Linguavventura</h1>
    <p>Ripassiamo l'italiano giocando: grammatica e ortografia in tante sfide diverse.</p>
  </div>
  <div class="menu-grid">
    <button class="menu-card" onclick="goModeSelect()"><span class="emoji">🧠</span><h3>Grammatica</h3><span class="desc">Nomi, verbi, aggettivi, articoli: 7 modalità di gioco</span></button>
    <button class="menu-card" onclick="goOrtografiaChoose()"><span class="emoji">🔤</span><h3>Ortografia</h3><span class="desc">Ce/cie, ge/gie, gli/li, cu/qu, doppie, la H</span></button>
    <button class="menu-card" onclick="goClassroomChoose()"><span class="emoji">📺</span><h3>Modalità classe</h3><span class="desc">Da usare alla LIM, tutti insieme</span></button>
    <button class="menu-card" onclick="goSettings()"><span class="emoji">📚</span><h3>Argomenti</h3><span class="desc">Scegli su cosa allenarti in grammatica</span></button>
    <button class="menu-card" onclick="goProgress()"><span class="emoji">🏆</span><h3>Progressi</h3><span class="desc">XP, giorni di fila e medaglie</span></button>
  </div>`;
}

/* ============ VIEW: MODE SELECT (grammatica) ============ */
function viewModeSelect(){
  return `
  <h2>Grammatica</h2>
  <p class="hint">Scegli una sfida.</p>
  <div class="mode-list">
    <button class="mode-card" onclick="startCheCosE()"><span class="emoji">❓</span><div class="txt"><strong>Che cos'è?</strong><span>Nome, verbo, aggettivo o articolo?</span></div></button>
    <button class="mode-card" onclick="goAnalizzaChoose()"><span class="emoji">🔎</span><div class="txt"><strong>Analisi grammaticale</strong><span>Nome, aggettivo, articolo o verbo: a caso o a scelta</span></div></button>
    <button class="mode-card" onclick="startAnalizzaTutto()"><span class="emoji">📖</span><div class="txt"><strong>Analizza tutto</strong><span>Una frase intera, parola per parola</span></div></button>
    <button class="mode-card" onclick="startParolaMisteriosa()"><span class="emoji">🔍</span><div class="txt"><strong>Parola misteriosa</strong><span>Che cos'è la parola evidenziata nella frase?</span></div></button>
    <button class="mode-card" onclick="startIntruso()"><span class="emoji">🕵️</span><div class="txt"><strong>Trova l'intruso</strong><span>Tre parole simili, una diversa</span></div></button>
    <button class="mode-card" onclick="startLampo()"><span class="emoji">⚡</span><div class="txt"><strong>Sfida lampo</strong><span>60 secondi, più risposte puoi dare</span></div></button>
    <button class="mode-card" onclick="startMostro()"><span class="emoji">🐉</span><div class="txt"><strong>Il mostro della grammatica</strong><span>Rispondi bene per sconfiggerlo</span></div></button>
  </div>`;
}
