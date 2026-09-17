# Linguavventura

App web per il ripasso giocoso della grammatica e dell'ortografia italiana — pensata per una classe quarta primaria, da usare alla LIM o sui dispositivi degli alunni.

Nessun login, nessun database: sono file statici, i progressi (XP, medaglie, record) restano salvati nel `localStorage` del dispositivo.

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
css/style.css        tutti gli stili
data/                 IL DATABASE, in JSON puro — apribile e modificabile senza toccare il codice
  words.json            tutte le parole (nomi, verbi, aggettivi, articoli) con le loro caratteristiche
  sentences.json         le frasi pronte per "Analizza tutto" e "Parola misteriosa"
  ortografia.json        le liste per ogni regola di ortografia (ce/cie, ge/gie, gli/li, ecc.)
  primitivi-derivati.json  le parole per l'esercizio "Primitivi e derivati"
js/
  data.js             le etichette mostrate a schermo e le medaglie (non le parole: quelle sono in /data)
  storage.js          salvataggio/lettura di impostazioni e progressi (localStorage),
                       XP, giorni di fila, medaglie
  helpers.js          funzioni di utilità condivise (shuffle, pick random, ecc.)
                       e la logica comune ai giochi "a round" (punteggio, rigioca)
  router.js           schermata attuale e funzione che disegna la pagina
  view-home.js        home e schermata di scelta modalità
  view-settings.js    pagina "Argomenti" (attiva/disattiva caratteristiche)
  view-progress.js    pagina "Progressi" (XP, medaglie, statistiche)
  game-checose.js     modalità "Che cos'è?"
  game-analizza.js    "Analisi grammaticale" (nome, aggettivo, articolo, verbo)
  game-analizzatutto.js  "Analizza tutto" (frase intera, parola per parola)
  game-misteriosa.js  "Parola misteriosa"
  game-primitivi.js   "Primitivi e derivati"
  game-sfidamista.js  "Sfida mista" (pesca a caso da tutte le altre modalità di grammatica)
  game-intruso.js     "Trova l'intruso"
  game-lampo.js       "Sfida lampo"
  game-mostro.js      "Il mostro della grammatica"
  game-ortografia.js  "Ortografia" (ce/cie, ge/gie, sce/sci, gli/li, cu/qu, doppie, la H)
  game-classroom.js   "Modalità classe" (per la LIM)
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
- **`data/primitivi-derivati.json`** — un array di `{ "w": "...", "tipo": "primitivo" }` oppure `"tipo": "derivato"`.

Per una NUOVA regola di ortografia (non solo nuove parole in una esistente) serve anche aggiungere una voce a `ORTHO_TOPICS` dentro `js/game-ortografia.js`. Le costanti `*_LABELS` in `js/data.js` definiscono le etichette mostrate a schermo (es. "Maschile"/"Femminile").

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
