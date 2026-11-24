# GymPlan — Backlog frontend

## Obiettivo e metodo
Web app mobile-first React + Vite, installabile come PWA. Prima realizzare un prodotto utilizzabile con API simulate e persistenza locale; poi collegare il backend senza riscrivere le schermate. Ogni iterazione produce una demo funzionante. Le durate sono indicative: per uno stage di due settimane privilegiare le iterazioni 0–3 e una parte della 4.

Stack: Node.js LTS compatibile con Vite, npm, React, JavaScript, React Router, CSS, Vitest, Testing Library, MSW (Mock Service Worker), IndexedDB tramite `idb`, vite-plugin-pwa. Evitare Redux e librerie UI complesse nella prima iterazione.

## Iterazione 0 — Setup e collaborazione (giorno 1)
- [ ] FE-001 Installare Git, Node.js LTS, VS Code; verificare `git --version`, `node -v`, `npm -v`.
- [ ] FE-002 Creare account GitHub e un repository privato `gymplan-frontend` con README e invitare il team; configurare Git e autenticazione GitHub.
- [ ] FE-003 Clonare il repository, creare branch di lavoro e inizializzare React:

```bash
git clone <URL_REPOSITORY_FRONTEND>
cd gymplan-frontend
git switch -c setup/react-vite
npm create vite@latest . -- --template react
npm install
npm run dev
```
Se Vite segnala una cartella non vuota per il README, scegliere di mantenere i file esistenti; non cancellare `.git`.

- [ ] FE-004 Aprire URL locale indicato da Vite; spiegare `index.html`, `main.jsx`, `App.jsx`, JSX, componenti, props e state.
- [ ] FE-005 Installare dipendenze iniziali: `npm install react-router-dom`; configurare ESLint fornito dal template e script `dev`, `build`, `preview`, `lint`.
- [ ] FE-006 Organizzare `src/components`, `pages`, `features`, `services`, `mocks`, `hooks`, `styles`, `assets`, `context`.
- [ ] FE-007 Creare `.env.example` con `VITE_API_MODE=mock` e `VITE_API_BASE_URL=/api/v1`; ignorare `.env.local`, `node_modules`, `dist`. Nessun segreto nelle variabili VITE.
- [ ] FE-008 Creare README con installazione, avvio, build, regole di collaborazione; impostare GitHub Projects con Backlog, Ready, In progress, Review, Done; creare issue FE/BE e associare milestone.
- [ ] FE-009 Configurare branch `main`, PR con review, piccoli commit, branch `feature/<id>-<nome>`; protezione branch se supportata dal piano GitHub.
- [ ] FE-010 Creare GitHub Actions con `npm ci`, `npm run lint`, `npm run build` su PR; committare lockfile e aprire prima PR.

**Accettazione:** ogni studente clona, avvia e modifica la app; build e lint passano; prima PR integrata.

## Iterazione 1 — Navigazione, profilo e autenticazione mock (giorni 2–3)
- [ ] FE-011 Definire wireframe Stitch e design system: colori, font, spacing, button, input, card, dialog, feedback, layout responsive.
- [ ] FE-012 Creare AppLayout con bottom navigation mobile e sidebar desktop; rotte `/login`, `/register`, `/`, `/onboarding`, `/workouts`, `/calendar`, `/progress`, `/profile` e 404.
- [ ] FE-013 Installare `npm install -D msw vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom`; `npx msw init public/ --save`.
- [ ] FE-014 Attivare MSW prima del mount React solo in modalità mock; handler HTTP, seed dati, ritardo simulato, errori 400/401/404/500. Separare `apiClient` e servizi dal JSX; usare fetch verso `/api/v1` sia mock sia real. Vedi contratto backend.
- [ ] FE-015 Creare repository mock persistente in IndexedDB (`npm install idb`) o localStorage per piccoli dati non sensibili; reset demo. Non salvare password reali: login demo esplicitamente fittizio e registrazione simulata.
- [ ] FE-016 Implementare form registrazione, login, logout, validazione, loading ed errori; AuthContext, route protette, ripristino sessione demo; recupero password come placeholder dichiarato.
- [ ] FE-017 Onboarding: età, altezza, peso, obiettivo (massa/dimagrimento/definizione/tonificazione), esperienza, giorni, durata, luogo, attrezzatura; foto facoltativa rinviabile.
- [ ] FE-018 Homepage: stato profilo incompleto, CTA completamento, allenamento del giorno o empty state, lista schede, statistiche inizialmente derivate dai dati mock.
- [ ] FE-019 Profilo modificabile; persistenza dopo refresh; test login, route guard, form e profilo.

**Accettazione:** utente demo si registra, accede, completa profilo, vede homepage, modifica profilo ed esce senza backend.

## Iterazione 2 — Schede allenamento (giorni 4–5)
- [ ] FE-020 Definire modello Workout, Exercise, WorkoutExercise; enum goal `mass|weight_loss|definition|toning`, mode `reps|timed`; ID stabili e unità kg/secondi.
- [ ] FE-021 Popolare catalogo mock con almeno 12 esercizi, gruppi muscolari, attrezzatura, difficoltà, immagini con licenza compatibile o placeholder.
- [ ] FE-022 Libreria esercizi con ricerca, filtri, dettaglio, loading, empty state ed errori.
- [ ] FE-023 Wizard scheda: obiettivo, nome, giorno facoltativo, selezione esercizi, configurazione, riepilogo.
- [ ] FE-024 Configurazione individuale: serie, ripetizioni, kg, durata, recupero tra serie/esercizi; valori predefiniti per obiettivo modificabili. Reps richiede serie/ripetizioni; timed richiede serie/durata; validare numeri positivi, recupero anche zero, peso non negativo.
- [ ] FE-025 Aggiungere, rimuovere, duplicare e riordinare esercizi; mostrare stima durata (assunzione esplicita per esercizi a ripetizioni).
- [ ] FE-026 Lista schede con CRUD, duplicazione, conferma eliminazione, dettaglio e CTA inizia; persistenza mock e isolamento dati demo per account.
- [ ] FE-027 Collegare dashboard e schede; test wizard, validazione, salvataggio e modifica.

**Accettazione:** creare e modificare una scheda mista con almeno un esercizio a ripetizioni e uno a tempo; ritrovarla dopo refresh.

## Iterazione 3 — Motore allenamento (giorni 6–8)
- [ ] FE-030 Definire macchina a stati `idle → active → rest → active → completed`; `paused` conserva fase precedente; `abandoned` terminale. Un solo motore per tutti gli obiettivi.
- [ ] FE-031 Implementare reducer puro e hook `useWorkoutSession`: snapshot scheda, indice esercizio/serie, risultati, transizioni. Evitare doppio avanzamento al click e allo scadere timer.
- [ ] FE-032 Modalità reps: GIF/foto, carico, serie corrente/totale, ripetizioni, cronometro crescente, modifica carico/ripetizioni effettive, pulsante serie terminata.
- [ ] FE-033 Modalità timed: countdown, round/serie, pausa/riprendi, prossimo esercizio (con conferma se salta serie), completamento alla scadenza.
- [ ] FE-034 Recupero: countdown, anteprima prossima serie/esercizio, +/-15s, pausa, salta; recupero zero salta fase; nessun recupero dopo ultimo esercizio. Alla fine del recupero mostrare CTA per iniziare.
- [ ] FE-035 Timer basato su timestamp di scadenza/inizio, non semplice decremento di setInterval; ricalcolo al visibilitychange; pausa congela tempo; cleanup interval; test con fake timers.
- [ ] FE-036 Salvare sessione attiva a ogni transizione in IndexedDB; ripristino refresh/chiusura; una sessione attiva per account; conferma abbandono; gestire tab multipli almeno con avviso.
- [ ] FE-037 Riepilogo sessione: durata, serie, ripetizioni, volume kg×ripetizioni, tempo attivo/recupero, note; salvataggio idempotente per ID sessione; distinguere completata e interrotta.
- [ ] FE-038 Test transizioni, ultima serie, pausa, recupero zero, refresh e doppio click; demo su smartphone.

**Accettazione MVP:** registrazione demo → profilo → scheda → allenamento misto → recupero → riepilogo persistente, senza backend.

## Iterazione 4 — Storico, calendario e PWA (giorni 9–10 o estensione)
- [ ] FE-040 Storico sessioni con dettaglio e filtri; statistiche da sessioni salvate, empty state; peso corporeo e grafici avanzati in estensione.
- [ ] FE-041 Calendario settimanale con pianificazione schede e indicazione completati; evitare duplicati involontari.
- [ ] FE-042 `npm install -D vite-plugin-pwa`; manifest nome, icone 192/512 e maskable, start_url, standalone, tema; HTTPS in deploy.
- [ ] FE-043 Configurare service worker per app shell e risorse pubbliche; non cache indiscriminata di API private. MSW e PWA usano service worker: separare scope/configurazione o disattivare SW PWA nella demo MSW; test PWA con backend reale o adapter locale senza MSW.
- [ ] FE-044 Accesso offline a schede già scaricate, sessioni persistenti, indicatore offline, coda operazioni con ID univoco e retry; non promettere timer/notifiche affidabili a schermo bloccato.
- [ ] FE-045 Installabilità Android/iOS dove supportata, safe area, touch target, contrasto, accessibilità tastiera; test build e preview.

**Accettazione:** avvio sessione già disponibile senza rete, refresh con ripristino, storico locale e app installabile in ambiente compatibile.

## Iterazione 5 — Integrazione backend reale (dopo MVP)
- [ ] FE-050 Allineare DTO e OpenAPI con backend; test contrattuali; modalità real via env senza handler MSW; fetch con credentials, errori standard e abort controller.
- [ ] FE-051 Sostituire auth demo con cookie HttpOnly server, gestione scadenza/401, logout e recupero password; non memorizzare token in localStorage.
- [ ] FE-052 Integrare profilo, catalogo, CRUD schede, sessioni, storico, calendario in ordine di disponibilità backend.
- [ ] FE-053 Separare dati per utente, pulire cache privata al logout, migrare dati demo solo con consenso o tenerli separati; sync sessioni idempotenti e gestione conflitti 409.
- [ ] FE-054 Test E2E percorso completo, errori rete, offline/online, accessibilità, responsive, build produzione; deploy statico con fallback SPA e API HTTPS.

**Accettazione:** dati persistono sul server e sono accessibili da un altro dispositivo; mock resta disponibile per sviluppo e test.

## Definition of Done (tutte le issue)
- [ ] Criteri di accettazione soddisfatti, PR revisionata, lint/build/test pertinenti verdi, nessun segreto, README aggiornato se necessario, demo verificata. Ogni issue ha responsabile, stima, dipendenze e test.
