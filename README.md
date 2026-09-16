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
js/
  data.js             il database delle parole (WORDS), le frasi pronte (SENTENCES),
                       le liste per l'ortografia, le etichette e le medaglie
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
  game-intruso.js     "Trova l'intruso"
  game-lampo.js       "Sfida lampo"
  game-mostro.js      "Il mostro della grammatica"
  game-ortografia.js  "Ortografia" (ce/cie, ge/gie, sce/sci, gli/li, cu/qu, doppie, la H)
  game-classroom.js   "Modalità classe" (per la LIM)
  app.js              avvio dell'app (ultimo file caricato)
```

I file JS sono script "classici" (non moduli), caricati in ordine da `index.html`: le funzioni e le costanti definite in un file sono visibili anche nei successivi, quindi l'ordine dei tag `<script>` in `index.html` conta e va rispettato se aggiungi nuovi file.

## Modificare i contenuti

- Per aggiungere parole al database, apri `js/data.js` e aggiungi voci all'array `WORDS`, seguendo lo stesso formato delle altre.
- Per aggiungere frasi ad "Analizza tutto" / "Parola misteriosa", aggiungi un array di parole taggate a `SENTENCES` in `js/data.js`.
- Per una nuova regola di ortografia, aggiungi una lista di coppie `{ok, bad}` e una voce in `ORTHO_TOPICS` dentro `js/game-ortografia.js`.
- Le costanti `*_LABELS` in `js/data.js` definiscono le etichette mostrate a schermo.

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
