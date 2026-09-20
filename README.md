# Linguavventura

App web per il ripasso giocoso della grammatica, del lessico e dell'ortografia italiana — pensata per una classe quarta primaria, da usare alla LIM o sui dispositivi degli alunni.

Nessun login obbligatorio: è un sito statico, i progressi (XP, medaglie, record) restano salvati nel `localStorage` del dispositivo. Un database (Supabase) è collegabile in un secondo momento, in modo del tutto opzionale, per avere un nickname libero e delle statistiche di classe — vedi più sotto.

## Sviluppo locale

**Importante:** aprire `index.html` direttamente con doppio click (protocollo `file://`) NON funziona bene, perché i file JS/CSS sono separati e i browser bloccano il caricamento di script esterni da file locali. Va servito con un server statico qualsiasi, ad esempio:

```bash
npx serve .
```

poi apri l'indirizzo che ti stampa a schermo (di solito `http://localhost:3000`).

## Struttura del progetto

```
index.html          lo scheletro della pagina, carica CSS e script in ordine
favicon.svg          il logo (L verde) mostrato nella scheda del browser
supabase-schema.sql  SQL da eseguire una volta su Supabase per le statistiche di classe (opzionale)
css/style.css        tutti gli stili
data/                 IL DATABASE, in JSON puro — apribile e modificabile senza toccare il codice
  words.json            tutte le parole (nomi, verbi, aggettivi, articoli, pronomi, preposizioni, avverbi) con le loro caratteristiche
  sentences.json         le frasi pronte per "Analizza tutto" e "Parola misteriosa"
  ortografia.json        le liste per ogni regola di ortografia (ce/cie, ge/gie, gli/li, cu/qu, doppie, H, sillabe, accento, apostrofo, punteggiatura)
  primitivi-derivati.json  le parole per "Primitivi e derivati" (Indovina e Memoria)
  sinonimi-contrari.json  le coppie di parole per il gioco "Sinonimi e contrari"
  nomi-alterati.json     le famiglie di parole per "Nomi alterati" (accrescitivo/diminutivo/vezzeggiativo/dispregiativo)
  nomi-composti.json     le parole per "Nomi composti" (semplice o composto da due parole)
  anagrammi.json         la lista di parole per il gioco "Anagramma"
  teoria.json              le schede di teoria (regole di grammatica e ortografia spiegate in breve)
js/
  config.js           URL e chiave del tuo progetto Supabase (vuoto di default: vedi sotto)
  sync.js             gestione del nickname, invio delle risposte a Supabase, contatore visite
  data.js             le etichette mostrate a schermo e le medaglie (non le parole: quelle sono in /data)
  storage.js          salvataggio/lettura di impostazioni e progressi (localStorage),
                       XP, giorni di fila, medaglie
  helpers.js          funzioni di utilità condivise (shuffle, pick random, ecc.)
                       e la logica comune ai giochi "a round" (punteggio, rigioca)
  router.js           schermata attuale e funzione che disegna la pagina
  view-home.js        home e schermata di scelta modalità
  view-nickname.js    schermata "come ti chiami?" mostrata la prima volta (solo se Supabase è collegato)
  view-stats.js       pagina "Statistiche" per l'insegnante (legge da Supabase)
  view-teoria.js      pagina "Teoria" (regole spiegate in breve, con link all'esercizio)
  view-settings.js    pagina "Argomenti" (attiva/disattiva caratteristiche)
  view-progress.js    pagina "Progressi" (XP, medaglie, statistiche personali)
  game-checose.js     modalità "Che cos'è?" (classica, a tempo, mostro, frase, ordina, tira e leggi)
  game-analizza.js    "Analisi grammaticale" (nome, aggettivo, articolo, verbo, pronome, preposizione, avverbio)
  game-analizzatutto.js  "Analizza tutto" (frase intera, parola per parola)
  game-misteriosa.js  "Parola misteriosa"
  game-primitivi.js   "Primitivi e derivati" (Indovina)
  game-memoria.js     "Primitivi e derivati" (Memoria: abbina le coppie)
  game-lessico.js     "Lessico": sinonimi e contrari, nomi alterati, nomi composti
  game-anagramma.js   "Anagramma" (dentro Ortografia: ricomponi la parola con le lettere)
  game-sfidamista.js  "Sfida mista" (pesca a caso da tutte le altre modalità di grammatica)
  game-intruso.js     "Trova l'intruso"
  game-lampo.js       "Sfida lampo"
  game-mostro.js      "Il mostro della grammatica"
  game-ortografia.js  "Ortografia" (10 regole, più sfida mista e anagramma)
  game-classroom.js   "Modalità classe" (schermo condiviso, tiro alla fune, battaglia navale, ruota della fortuna — tutte e tre a schermo diviso, stessa domanda, vince chi risponde giusto per primo — più squadra contro squadra, a tempo — per la LIM)
  app.js              carica i file in /data, poi avvia l'app (ultimo file caricato)
```

I file JS sono script "classici" (non moduli), caricati in ordine da `index.html`: le funzioni e le costanti definite in un file sono visibili anche nei successivi, quindi l'ordine dei tag `<script>` in `index.html` conta e va rispettato se aggiungi nuovi file.

`js/app.js` all'avvio scarica i tre file JSON con `fetch()` e solo dopo disegna la pagina — per questo **serve sempre un server locale** (vedi sopra): con `file://` (doppio click) i browser bloccano il caricamento di questi file e la pagina resta su "Caricamento...".

## Modificare i contenuti

Tutto il contenuto "didattico" sta in `/data`, come JSON puro — nessuna sintassi di programmazione, solo dati:

- **`data/words.json`** — un array di oggetti, uno per parola. Esempio:
  ```json
  { "w": "cane", "t": "nome", "tipo": "comune", "cat": "animale", "forma": "concreto", "gen": "m", "num": "s" }
  ```
  Per aggiungere una parola, copia una riga simile (stesso tipo `t`) e cambia i valori. Attenzione alle virgole tra un oggetto e l'altro: un JSON con una virgola di troppo o mancante non si carica più — se non sei sicuro, incolla il file in un validatore JSON online prima di salvare.
- **`data/sentences.json`** — un array di frasi, ogni frase è un array di parole taggate come sopra (con in più, per i verbi, persona/numero/tempo/modo).
- **`data/ortografia.json`** — un oggetto con una lista per ogni regola (`cege`, `scesci`, `glili`, `cuqu`, `doppie`, `letterah`), ciascuna con coppie `{ "ok": "...", "bad": "..." }` (oppure `{ "s": "...", "ok": "...", "bad": "..." }` per Ce/Cie-Ge/Gie, o `{ "sentence": "...", "ok": "...", "bad": "..." }` per la lettera H).
- **`data/primitivi-derivati.json`** — un oggetto con `famiglie`: un array di `{ "primitivo": "...", "derivati": ["...", "..."] }`. Serve sia per "Indovina" (primitivo o derivato) sia per "Memoria" (abbina le coppie della stessa famiglia).
- **`data/sinonimi-contrari.json`** — un oggetto con due liste, `sinonimi` e `contrari`, ciascuna un array di coppie `["parola1", "parola2"]`.
- **`data/nomi-alterati.json`** — un oggetto con `famiglie`: un array di `{ "base": "...", "alterati": [{ "w": "...", "tipo": "accrescitivo|diminutivo|vezzeggiativo|dispregiativo" }] }`.
- **`data/nomi-composti.json`** — un oggetto con `composti` (array di `{ "w": "...", "parti": ["...", "..."] }`) e `semplici` (un semplice array di parole non composte, per contrasto).
- **`data/anagrammi.json`** — un semplice array di parole (minuscole, senza spazi o apostrofi).

Per una NUOVA parte del discorso (oltre a nome/verbo/aggettivo/articolo/pronome/preposizione/avverbio) o una nuova regola di ortografia, oltre ai dati serve anche aggiungere una voce a `ANALYSIS_CONFIG` (in `js/game-analizza.js`) o a `ORTHO_TOPICS` (in `js/game-ortografia.js`). Le costanti `*_LABELS` in `js/data.js` definiscono le etichette mostrate a schermo (es. "Maschile"/"Femminile"). Tutti gli altri giochi (Che cos'è, Trova l'intruso, Sfida lampo, Il mostro, Ordina, Tira e leggi, e tutta la Modalità classe) pescano automaticamente da qualsiasi parte del discorso attiva nelle impostazioni: non serve toccarli.

## Statistiche di classe (opzionale, richiede Supabase)

Di base l'app non ha nessun database: i progressi restano sul dispositivo di ognuno, come descritto sopra. Se vuoi vedere anche tu, da insegnante, come va la classe nel complesso (e su quali argomenti si sbaglia di più), puoi collegare un progetto Supabase gratuito. Senza questo passaggio l'app funziona comunque esattamente come prima.

1. Crea un progetto su [supabase.com](https://supabase.com) (o usane uno che hai già).
2. Apri **SQL Editor** nel progetto, incolla il contenuto di `supabase-schema.sql` (nella cartella principale del repository) e lancialo. Crea la tabella `attempts` con le regole di sicurezza necessarie.
3. Vai su **Project Settings → API**: copia **Project URL** e la chiave **anon public**.
4. Apri `js/config.js` e incollali:
   ```js
   const SUPABASE_URL = 'https://IL-TUO-PROGETTO.supabase.co';
   const SUPABASE_ANON_KEY = 'la-tua-chiave-anon';
   ```
5. Fai il deploy (o ricarica in locale). D'ora in poi, ogni volta che qualcuno gioca, ogni risposta (giusta o sbagliata, con l'argomento a cui appartiene) viene mandata anche a Supabase, collegata al nickname scelto.
6. Da qualsiasi dispositivo, apri **Home → Statistiche** per vedere il riepilogo per studente e per argomento, ordinato dagli argomenti/studenti con più difficoltà.

Note:
- Il nickname è libero (ogni studente lo scrive al primo utilizzo su quel dispositivo) e resta salvato lì; si può cambiare in qualsiasi momento toccando la pillola col nome in alto nello schermo, utile se più studenti condividono lo stesso dispositivo a turno.
- Se internet non è disponibile o Supabase non è raggiungibile, il gioco continua a funzionare normalmente: semplicemente quella risposta non viene sincronizzata.
- La chiave "anon" è pensata per stare nel codice pubblico del sito (è quella con cui l'app stessa comunica con Supabase); le regole di sicurezza (`supabase-schema.sql`) permettono a chiunque abbia quella chiave di leggere e scrivere le risposte, senza login. Per una classe va bene così, ma è bene sapere che non c'è una vera protezione ad accesso.

## Deploy su Vercel

1. Crea un repository su GitHub e caricaci questi file:
   ```bash
   git init
   git add .
   git commit -m "Prima versione di Linguavventura"
   git branch -M main
   git remote add origin https://github.com/<tuo-utente>/linguavventura.git
   git push -u origin main
   ```
2. Su [vercel.com](https://vercel.com), scegli **Add New → Project**, importa il repository. Vercel riconosce automaticamente che è un sito statico (nessuna build da configurare): basta confermare e fare deploy.
3. Ad ogni `git push` su `main`, Vercel ripubblica automaticamente la nuova versione.
