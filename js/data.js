/* ============ DATI ============ */
let WORDS = []; // caricate da data/words.json (vedi js/app.js)

const TIPI_LABELS = {nome:'Nome', verbo:'Verbo', aggettivo:'Aggettivo', articolo:'Articolo'};
const CAT_LABELS = {persona:'Persona', animale:'Animale', cosa:'Cosa'};
const FORMA_LABELS = {concreto:'Concreto', astratto:'Astratto', collettivo:'Collettivo'};
const GEN_LABELS = {m:'Maschile', f:'Femminile'};
const NUM_LABELS = {s:'Singolare', p:'Plurale'};
const NOMETIPO_LABELS = {comune:'Comune', proprio:'Proprio'};
const ARTTIPO_LABELS = {determinativo:'Determinativo', indeterminativo:'Indeterminativo'};
const AGGTIPO_LABELS = {qualificativo:'Qualificativo', possessivo:'Possessivo', dimostrativo:'Dimostrativo'};
const PERSONA_LABELS = {'1':'1ª persona', '2':'2ª persona', '3':'3ª persona'};
const VERBOBASE_LABELS = {essere:'Essere', avere:'Avere', parlare:'Parlare', credere:'Credere', dormire:'Dormire'};
const TEMPO_LABELS = {presente:'Presente', imperfetto:'Imperfetto', futuro:'Futuro semplice'};
const MODO_LABELS = {indicativo:'Indicativo', congiuntivo:'Congiuntivo', condizionale:'Condizionale', imperativo:'Imperativo'};

const BADGES_META = {
  prima_sfida:{ic:'🎓',nm:'Prima sfida'},
  dieci_di_fila:{ic:'🔥',nm:'10 di fila'},
  cento_risposte:{ic:'💯',nm:'100 risposte'},
  prima_analisi:{ic:'🔍',nm:'Prima analisi'},
  cacciatore_di_mostri:{ic:'🐉',nm:'Cacciatore di mostri'},
  settimana_di_fuoco:{ic:'📅',nm:'7 giorni di fila'},
  prima_frase:{ic:'📖',nm:'Prima frase analizzata'},
};

/* Frasi già pronte per "Analizza tutto" e "Parola misteriosa" (nome/verbo/aggettivo/articolo) */
let SENTENCES = []; // caricate da data/sentences.json (vedi js/app.js)
