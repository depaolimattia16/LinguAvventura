/* ============ SETTINGS ============ */
function viewSettings(){
  const t = settings.tipi;
  const ns = settings.nomiSkills;
  const as = settings.aggSkills;
  const arts = settings.artSkills;
  const tipiRows = sortedKeysByLabel(Object.keys(TIPI_LABELS), TIPI_LABELS).map(k=>`
    <label class="check-row"><input type="checkbox" ${t[k]?'checked':''} onchange="toggleTipo('${k}')"> ${TIPI_LABELS[k]}</label>
  `).join('');
  const nomeSkillRows = `
    <label class="check-row"><input type="checkbox" ${ns.tipo?'checked':''} onchange="toggleNomiSkill('tipo')"> Comune / proprio</label>
    <label class="check-row"><input type="checkbox" ${ns.categoria?'checked':''} onchange="toggleNomiSkill('categoria')"> Persona / animale / cosa</label>
    <label class="check-row"><input type="checkbox" ${ns.forma?'checked':''} onchange="toggleNomiSkill('forma')"> Concreto / astratto / collettivo</label>
    <label class="check-row"><input type="checkbox" ${ns.genere?'checked':''} onchange="toggleNomiSkill('genere')"> Genere</label>
    <label class="check-row"><input type="checkbox" ${ns.numero?'checked':''} onchange="toggleNomiSkill('numero')"> Numero</label>
  `;
  const aggSkillRows = `
    <label class="check-row"><input type="checkbox" ${as.sottotipo?'checked':''} onchange="toggleAggSkill('sottotipo')"> Qualificativo</label>
    <label class="check-row"><input type="checkbox" ${as.genere?'checked':''} onchange="toggleAggSkill('genere')"> Genere</label>
    <label class="check-row"><input type="checkbox" ${as.numero?'checked':''} onchange="toggleAggSkill('numero')"> Numero</label>
  `;
  const artSkillRows = `
    <label class="check-row"><input type="checkbox" ${arts.tipo?'checked':''} onchange="toggleArtSkill('tipo')"> Determinativo / indeterminativo</label>
    <label class="check-row"><input type="checkbox" ${arts.genere?'checked':''} onchange="toggleArtSkill('genere')"> Genere</label>
    <label class="check-row"><input type="checkbox" ${arts.numero?'checked':''} onchange="toggleArtSkill('numero')"> Numero</label>
  `;
  const vb = settings.verboSkills;
  const verboSkillRows = `
    <label class="check-row"><input type="checkbox" ${vb.persona?'checked':''} onchange="toggleVerboSkill('persona')"> Persona</label>
    <label class="check-row"><input type="checkbox" ${vb.numero?'checked':''} onchange="toggleVerboSkill('numero')"> Numero</label>
    <label class="check-row"><input type="checkbox" ${vb.tempo?'checked':''} onchange="toggleVerboSkill('tempo')"> Tempo (presente/imperfetto/futuro)</label>
    <label class="check-row"><input type="checkbox" ${vb.modo?'checked':''} onchange="toggleVerboSkill('modo')"> Modo</label>
  `;
  const vbase = settings.verboBasi;
  const verboBasiRows = Object.keys(VERBOBASE_LABELS).map(k=>`
    <label class="check-row"><input type="checkbox" ${vbase[k]?'checked':''} onchange="toggleVerboBase('${k}')"> ${VERBOBASE_LABELS[k]}</label>
  `).join('');
  const ps = settings.pronomeSkills;
  const pronomeSkillRows = `
    <label class="check-row"><input type="checkbox" ${ps.persona?'checked':''} onchange="togglePronomeSkill('persona')"> Persona</label>
    <label class="check-row"><input type="checkbox" ${ps.numero?'checked':''} onchange="togglePronomeSkill('numero')"> Numero</label>
  `;
  const preps = settings.preposizioneSkills;
  const preposizioneSkillRows = `
    <label class="check-row"><input type="checkbox" ${preps.tipo?'checked':''} onchange="togglePreposizioneSkill('tipo')"> Semplice / articolata</label>
  `;
  const avs = settings.avverbioSkills;
  const avverbioSkillRows = `
    <label class="check-row"><input type="checkbox" ${avs.tipo?'checked':''} onchange="toggleAvverbioSkill('tipo')"> Tempo / luogo / modo / quantità</label>
  `;
  return `
  <h2>Argomenti</h2>
  <p class="hint">Scegli su cosa vuoi allenare la classe nelle modalità di Grammatica. (L'Ortografia ha sempre tutte le regole disponibili: non serve attivarle qui.)</p>
  <div class="blackboard">
    <h3>Parti del discorso</h3>
    ${tipiRows}
    <div class="hint">Servono almeno due parti del discorso attive per giocare a "Che cos'è?", "Sfida lampo" e "Il mostro".</div>
  </div>
  <div class="settings-block">
    <h3>Analisi del nome</h3>
    ${nomeSkillRows}
  </div>
  <div class="settings-block">
    <h3>Analisi dell'aggettivo</h3>
    ${aggSkillRows}
  </div>
  <div class="settings-block">
    <h3>Analisi dell'articolo</h3>
    ${artSkillRows}
  </div>
  <div class="settings-block">
    <h3>Analisi del verbo</h3>
    ${verboSkillRows}
  </div>
  <div class="settings-block">
    <h3>Analisi del pronome</h3>
    ${pronomeSkillRows}
  </div>
  <div class="settings-block">
    <h3>Analisi della preposizione</h3>
    ${preposizioneSkillRows}
  </div>
  <div class="settings-block">
    <h3>Analisi dell'avverbio</h3>
    ${avverbioSkillRows}
  </div>
  <div class="blackboard">
    <h3>Quali verbi avete già fatto</h3>
    ${verboBasiRows}
    <div class="hint">Solo i verbi qui attivi compaiono nell'analisi del verbo. Coniugati solo all'indicativo (presente, imperfetto, futuro).</div>
  </div>
  <p class="hint">Le caratteristiche qui sopra si usano nelle modalità "Analisi grammaticale", "Analizza tutto" e "Trova l'intruso" (nome).</p>`;
}
function toggleTipo(k){
  const active = Object.keys(settings.tipi).filter(x=>settings.tipi[x]);
  if(settings.tipi[k] && active.length<=1){ showToast('Deve restare attiva almeno una parte del discorso'); return; }
  settings.tipi[k] = !settings.tipi[k];
  saveSettings();
  render();
}
function toggleNomiSkill(k){
  const active = Object.keys(settings.nomiSkills).filter(x=>settings.nomiSkills[x]);
  if(settings.nomiSkills[k] && active.length<=1){ showToast('Deve restare attiva almeno una caratteristica'); return; }
  settings.nomiSkills[k] = !settings.nomiSkills[k];
  saveSettings();
  render();
}
function toggleAggSkill(k){
  const active = Object.keys(settings.aggSkills).filter(x=>settings.aggSkills[x]);
  if(settings.aggSkills[k] && active.length<=1){ showToast('Deve restare attiva almeno una caratteristica'); return; }
  settings.aggSkills[k] = !settings.aggSkills[k];
  saveSettings();
  render();
}
function toggleArtSkill(k){
  const active = Object.keys(settings.artSkills).filter(x=>settings.artSkills[x]);
  if(settings.artSkills[k] && active.length<=1){ showToast('Deve restare attiva almeno una caratteristica'); return; }
  settings.artSkills[k] = !settings.artSkills[k];
  saveSettings();
  render();
}
function toggleVerboSkill(k){
  const active = Object.keys(settings.verboSkills).filter(x=>settings.verboSkills[x]);
  if(settings.verboSkills[k] && active.length<=1){ showToast('Deve restare attiva almeno una caratteristica'); return; }
  settings.verboSkills[k] = !settings.verboSkills[k];
  saveSettings();
  render();
}
function toggleVerboBase(k){
  settings.verboBasi[k] = !settings.verboBasi[k];
  saveSettings();
  render();
}
function togglePronomeSkill(k){
  const active = Object.keys(settings.pronomeSkills).filter(x=>settings.pronomeSkills[x]);
  if(settings.pronomeSkills[k] && active.length<=1){ showToast('Deve restare attiva almeno una caratteristica'); return; }
  settings.pronomeSkills[k] = !settings.pronomeSkills[k];
  saveSettings();
  render();
}
function togglePreposizioneSkill(k){
  const active = Object.keys(settings.preposizioneSkills).filter(x=>settings.preposizioneSkills[x]);
  if(settings.preposizioneSkills[k] && active.length<=1){ showToast('Deve restare attiva almeno una caratteristica'); return; }
  settings.preposizioneSkills[k] = !settings.preposizioneSkills[k];
  saveSettings();
  render();
}
function toggleAvverbioSkill(k){
  const active = Object.keys(settings.avverbioSkills).filter(x=>settings.avverbioSkills[x]);
  if(settings.avverbioSkills[k] && active.length<=1){ showToast('Deve restare attiva almeno una caratteristica'); return; }
  settings.avverbioSkills[k] = !settings.avverbioSkills[k];
  saveSettings();
  render();
}
