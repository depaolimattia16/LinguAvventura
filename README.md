# Linguavventura

App web per il ripasso giocoso della grammatica italiana (nomi, verbi, aggettivi, articoli) — pensata per una classe quarta primaria, da usare alla LIM o sui dispositivi degli alunni.

Nessun login, nessun database: è un unico file HTML statico, i progressi (XP, medaglie, record) restano salvati nel `localStorage` del dispositivo.

## Sviluppo locale

Basta aprire `index.html` nel browser, oppure servirlo con un server statico qualsiasi:

```bash
npx serve .
```

## Modificare i contenuti

Tutto il database di parole, le modalità di gioco e le impostazioni sono in un unico file: `index.html`.
- L'array `WORDS` (in cima allo `<script>`) contiene tutte le parole con le loro caratteristiche grammaticali.
- Le costanti `*_LABELS` definiscono le etichette mostrate a schermo.
- Le funzioni `start*` / `view*` definiscono le singole modalità di gioco.

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
