/* ============ DATI ============ */
let WORDS = []; // caricate da data/words.json (vedi js/app.js)

const TIPI_LABELS = {nome:'Nome', verbo:'Verbo', aggettivo:'Aggettivo', articolo:'Articolo', pronome:'Pronome', preposizione:'Preposizione', avverbio:'Avverbio'};
const CAT_LABELS = {persona:'Persona', animale:'Animale', cosa:'Cosa'};
const FORMA_LABELS = {concreto:'Concreto', astratto:'Astratto', collettivo:'Collettivo'};
const GEN_LABELS = {m:'Maschile', f:'Femminile'};
const NUM_LABELS = {s:'Singolare', p:'Plurale'};
const NOMETIPO_LABELS = {comune:'Comune', proprio:'Proprio'};
const ARTTIPO_LABELS = {determinativo:'Determinativo', indeterminativo:'Indeterminativo', partitivo:'Partitivo'};
const AGGTIPO_LABELS = {qualificativo:'Qualificativo', possessivo:'Possessivo', dimostrativo:'Dimostrativo'};
const PREPTIPO_LABELS = {semplice:'Semplice', articolata:'Articolata'};
const AVVTIPO_LABELS = {tempo:'Di tempo', luogo:'Di luogo', modo:'Di modo', quantita:'Di quantità'};
const SINCONTR_LABELS = {sinonimi:'Sinonimi', contrari:'Contrari'};
const ALTERATO_LABELS = {accrescitivo:'Accrescitivo', diminutivo:'Diminutivo', vezzeggiativo:'Vezzeggiativo', dispregiativo:'Dispregiativo'};
const SEMPCOMP_LABELS = {semplice:'Semplice', composto:'Composto'};
const PERSONA_LABELS = {'1':'1ª persona', '2':'2ª persona', '3':'3ª persona'};
const VERBOBASE_LABELS = {essere:'Essere', avere:'Avere', parlare:'Parlare', credere:'Credere', dormire:'Dormire'};
const PRIMDERIV_LABELS = {primitivo:'Primitivo', derivato:'Derivato'};
let PRIMITIVI_DERIVATI = []; // caricate da data/primitivi-derivati.json (vedi js/app.js) — versione "piatta", per il gioco di classificazione
let PRIMITIVI_FAMIGLIE = []; // stessa fonte, raggruppata per famiglia — per il gioco Memoria
let SINONIMI_CONTRARI = {sinonimi:[], contrari:[]}; // caricate da data/sinonimi-contrari.json
let NOMI_ALTERATI = []; // caricate da data/nomi-alterati.json (famiglie), appiattite: [{w,tipo}]
let NOMI_ALTERATI_FAMIGLIE = []; // stessa fonte, raggruppata per famiglia (base + alterati)
let NOMI_COMPOSTI = {composti:[], semplici:[]}; // caricate da data/nomi-composti.json
let ANAGRAMMI = []; // caricate da data/anagrammi.json
let TEORIA = {grammatica:[], ortografia:[]}; // caricate da data/teoria.json (vedi js/app.js)
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
