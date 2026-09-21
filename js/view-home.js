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
    <p>${getNickname() ? `Ciao, ${getNickname()}! ` : ''}Ripassiamo l'italiano giocando: grammatica e ortografia in tante sfide diverse.</p>
  </div>
  <div class="menu-grid">
    <button class="menu-card" onclick="goModeSelect()"><span class="emoji">🧠</span><h3>Grammatica</h3><span class="desc">Nomi, verbi, aggettivi, articoli: 5 modalità di gioco</span></button>
    <button class="menu-card" onclick="goOrtografiaChoose()"><span class="emoji">🔤</span><h3>Ortografia</h3><span class="desc">Ce/cie, ge/gie, gli/li, cu/qu, doppie, la H</span></button>
    <button class="menu-card" onclick="goLessicoChoose()"><span class="emoji">📖</span><h3>Lessico</h3><span class="desc">Sinonimi, contrari, alterati, composti</span></button>
    <button class="menu-card" onclick="goClassroomChoose()"><span class="emoji">📺</span><h3>Modalità classe</h3><span class="desc">Da usare alla LIM, tutti insieme</span></button>
    <button class="menu-card" onclick="goSettings()"><span class="emoji">📚</span><h3>Argomenti</h3><span class="desc">Scegli su cosa allenarti in grammatica</span></button>
    <button class="menu-card" onclick="goProgress()"><span class="emoji">🏆</span><h3>Progressi</h3><span class="desc">XP, giorni di fila e medaglie</span></button>
    <button class="menu-card" onclick="goTeoriaChoose()"><span class="emoji">📘</span><h3>Teoria</h3><span class="desc">Le regole spiegate in breve</span></button>
    <button class="menu-card" onclick="goClassStats()"><span class="emoji">📊</span><h3>Statistiche</h3><span class="desc">Come va la classe</span></button>
    <button class="menu-card" onclick="goDettatoChoose()"><span class="emoji">🎓</span><h3>Modalità insegnante</h3><span class="desc">Crea un dettato sugli argomenti che scegli</span></button>
  </div>`;
}

/* ============ VIEW: MODE SELECT (grammatica) ============ */
function viewModeSelect(){
  return `
  <h2>Grammatica</h2>
  <p class="hint">Scegli una sfida.</p>
  <div class="mode-list">
    <button class="mode-card" onclick="goCheCosEChoose()"><span class="emoji">❓</span><div class="txt"><strong>Che cos'è?</strong><span>Nome, verbo, aggettivo o articolo — classica, a tempo, contro il mostro o in una frase</span></div></button>
    <button class="mode-card" onclick="goAnalizzaChoose()"><span class="emoji">🔎</span><div class="txt"><strong>Analisi grammaticale</strong><span>Nome, aggettivo, articolo, verbo, o una frase intera</span></div></button>
    <button class="mode-card" onclick="startIntruso()"><span class="emoji">🕵️</span><div class="txt"><strong>Trova l'intruso</strong><span>Tre parole simili, una diversa</span></div></button>
    <button class="mode-card" onclick="goPrimitiviChoose()"><span class="emoji">🌱</span><div class="txt"><strong>Primitivi e derivati</strong><span>Indovina o gioca a memoria</span></div></button>
    <button class="mode-card" onclick="startSfidaMista()"><span class="emoji">🎲</span><div class="txt"><strong>Sfida mista</strong><span>Un po' di tutto: pesca a caso da ogni modalità</span></div></button>
  </div>`;
}
