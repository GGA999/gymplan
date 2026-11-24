# GymPlan — Soluzioni operative frontend

Guida per il docente e il team: corrispondenza 1:1 con il backlog originale. Sviluppare in ordine, una issue alla volta. Gli snippet sono esempi di implementazione da integrare nei file indicati, non un repository completo già eseguito. I test e i comandi vanno verificati nel proprio ambiente. Usare dati fittizi.

Strategia: frontend first con MSW, contratto API comune subito, backend reale dopo il MVP. Ogni iterazione si chiude con demo e review. I task delle iterazioni successive sono estensioni, non prerequisiti della prima demo.

## Iterazione 0 — Setup e collaborazione (giorno 1)

### FE-001 — Installare Git, Node.js LTS, VS Code; verificare `git --version`, `node -v`, `npm -v`.

Scaricare Git, Node.js LTS compatibile con Vite e VS Code dai siti ufficiali. Su Windows riaprire PowerShell dopo l'installazione. Non installare React globalmente.
```bash
git --version
node -v
npm -v
code --version
```
Verifica: tutti i comandi restituiscono una versione; tutti gli studenti usano la stessa major di Node, annotata nel README.

### FE-002 — Creare account GitHub e un repository privato `gymplan-frontend` con README e invitare il team; configurare Git e autenticazione GitHub.

Su GitHub: New repository → gymplan-frontend → Private → Add README → Create. Settings → Collaborators → invitare il team. Configurare l'identità locale:
```bash
git config --global user.name "Nome Cognome"
git config --global user.email "email-associata-a-github"
git config --global init.defaultBranch main
```
Autenticarsi tramite Git Credential Manager oppure SSH; non condividere token. Verifica: ogni collaboratore accetta l'invito e può clonare.

### FE-003 — Clonare il repository, creare branch di lavoro e inizializzare React:

```bash
git clone https://github.com/ORGANIZZAZIONE/gymplan-frontend.git
cd gymplan-frontend
git switch -c setup/react-vite
npm create vite@latest . -- --template react
npm install
npm run dev
```
Se il generatore chiede come gestire README esistente, mantenerlo; non eliminare .git. In caso di conflitto creare il template in una cartella temporanea e copiare i file escluso .git. Verifica: pagina Vite in browser e terminale senza errori.

### FE-004 — Aprire URL locale indicato da Vite; spiegare `index.html`, `main.jsx`, `App.jsx`, JSX, componenti, props e state.

Aprire l'indirizzo stampato dal terminale. Sostituire `src/App.jsx` con:
```jsx
import { useState } from 'react';
function Counter({ label }) {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(c => c + 1)}>{label}: {count}</button>;
}
export default function App() {
  return <main><h1>GymPlan</h1><Counter label="Serie" /></main>;
}
```
Seguire il flusso index.html → main.jsx → App → Counter; spiegare JSX, props immutabili e state. Verifica: cambiare il titolo e cliccare il bottone senza ricaricare la pagina.

### FE-005 — Installare dipendenze iniziali: `npm install react-router-dom`; configurare ESLint fornito dal template e script `dev`, `build`, `preview`, `lint`.

```bash
npm install react-router-dom
npm run lint
npm run build
npm run preview
```
In package.json mantenere gli script `dev: vite`, `build: vite build`, `preview: vite preview`, `lint: eslint .` e il file eslint.config.js del template. Verifica: lint e build terminano con exit code 0.

### FE-006 — Organizzare `src/components`, `pages`, `features`, `services`, `mocks`, `hooks`, `styles`, `assets`, `context`.

Creare in VS Code le cartelle sotto src: components (Button/Input/Card), pages (route), features (auth/workouts/session), services (HTTP), mocks (handler e fixture), hooks, styles, assets, context. Non creare cartelle inutilizzate solo per architettura: aggiungere i file quando servono. `pages/Workouts.jsx` importa `features/workouts/WorkoutList.jsx`, che usa `services/workouts.js`, mai direttamente i mock. Verifica: import relativi funzionanti e nessuna chiamata HTTP nel componente presentazionale.

### FE-007 — Creare `.env.example` con `VITE_API_MODE=mock` e `VITE_API_BASE_URL=/api/v1`; ignorare `.env.local`, `node_modules`, `dist`. Nessun segreto nelle variabili VITE.

`.env.example`:
```dotenv
VITE_API_MODE=mock
VITE_API_BASE_URL=/api/v1
```
Copiare in `.env.local` (PowerShell: `Copy-Item .env.example .env.local`). In .gitignore aggiungere `.env.local`, `.env.*.local`, `node_modules/`, `dist/`. Leggere `import.meta.env.VITE_API_MODE`; qualsiasi valore VITE è pubblico. Verifica: `git status --short` non mostra .env.local.

### FE-008 — Creare README con installazione, avvio, build, regole di collaborazione; impostare GitHub Projects con Backlog, Ready, In progress, Review, Done; creare issue FE/BE e associare milestone.

README: prerequisiti, clone, npm ci, copia env, npm run dev/build/lint, modalità mock e regole PR. Su GitHub Projects creare board GymPlan con colonne Backlog, Ready, In progress, Review, Done. Creare una issue per ogni ID dei due backlog, milestone Iterazione 0–5, owner e criteri. Verifica: FE-003 assegnata e visibile nella board.

### FE-009 — Configurare branch `main`, PR con review, piccoli commit, branch `feature/<id>-<nome>`; protezione branch se supportata dal piano GitHub.

```bash
git switch main
git pull --ff-only
git switch -c feature/fe-011-design
git add src
git commit -m "feat: add design tokens (FE-011)"
git push -u origin feature/fe-011-design
```
Aprire PR verso main, collegare issue (`Closes #numero`), richiedere review. Settings → Rules/Branch protection se disponibile: PR obbligatoria, check CI, niente force push. Non committare segreti. Verifica: un compagno revisiona prima del merge.

### FE-010 — Creare GitHub Actions con `npm ci`, `npm run lint`, `npm run build` su PR; committare lockfile e aprire prima PR.

`.github/workflows/ci.yml` (esempio Node 22, usare la versione comune compatibile):
```yaml
name: Frontend CI
on: [pull_request, push]
jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: npm
      - run: npm ci
      - run: npm run lint
      - run: npm run build
```
Committare package-lock.json. Dopo FE-013 aggiungere `npm run test`. Verifica: check verde sulla PR.

**Accettazione:** ogni studente clona, avvia e modifica la app; build e lint passano; prima PR integrata.

## Iterazione 1 — Navigazione, profilo e autenticazione mock (giorni 2–3)

### FE-011 — Definire wireframe Stitch e design system: colori, font, spacing, button, input, card, dialog, feedback, layout responsive.

Esportare da Stitch le schermate di riferimento, confrontarle con il backlog. Definire `src/styles/tokens.css`:
```css
:root { color-scheme: dark; --bg:#101114; --surface:#1c1e24; --accent:#c4f82a; --text:#f5f5f5; --radius:12px; --space:16px; }
body { margin:0; background:var(--bg); color:var(--text); font-family:system-ui,sans-serif; }
button,input,select { font:inherit; min-height:44px; }
button:focus-visible { outline:3px solid var(--accent); }
```
Creare componenti Button, Field con label/errore, Card e Dialog con focus gestito. Verifica: schermate a 360 e 1280 px, contrasto e navigazione tastiera.

### FE-012 — Creare AppLayout con bottom navigation mobile e sidebar desktop; rotte `/login`, `/register`, `/`, `/onboarding`, `/workouts`, `/calendar`, `/progress`, `/profile` e 404.

In `main.jsx` avvolgere App in BrowserRouter. In App definire Routes, Route, Navigate e layout con Outlet. Esempio:
```jsx
<Routes>
  <Route path="/login" element={<Login/>}/>
  <Route path="/register" element={<Register/>}/>
  <Route element={<RequireAuth/>}>
    <Route path="/onboarding" element={<Onboarding/>}/>
    <Route element={<AppLayout/>}>
      <Route index element={<Home/>}/>
      <Route path="workouts" element={<Workouts/>}/>
      <Route path="calendar" element={<Calendar/>}/>
      <Route path="progress" element={<Progress/>}/>
      <Route path="profile" element={<Profile/>}/>
    </Route>
    <Route path="/workouts/:id/run" element={<WorkoutSession/>}/>
  </Route>
  <Route path="*" element={<NotFound/>}/>
</Routes>
```
I componenti citati vanno creati e importati; iniziare con placeholder. Layout con NavLink, CSS media query a 768px. Verifica: URL diretti, back e 404.

### FE-013 — Installare `npm install -D msw vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom`; `npx msw init public/ --save`.

```bash
npm install -D msw vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
npx msw init public/ --save
npm pkg set scripts.test="vitest run" scripts.test:watch="vitest"
```
In vite.config.js aggiungere `test: { environment: 'jsdom', setupFiles: ['./src/test/setup.js'] }`; setup.js importa `@testing-library/jest-dom/vitest`. Per test HTTP usare setupServer di msw/node, listen/resetHandlers/close. Verifica: test di rendering di App o Button passa.

### FE-014 — Attivare MSW prima del mount React solo in modalità mock; handler HTTP, seed dati, ritardo simulato, errori 400/401/404/500. Separare `apiClient` e servizi dal JSX; usare fetch verso `/api/v1` sia mock sia real. Vedi contratto backend.

`src/services/apiClient.js`:
```js
const base = import.meta.env.VITE_API_BASE_URL || '/api/v1';
export async function api(path, { body, headers, ...options } = {}) {
  const res = await fetch(base + path, { credentials:'include', ...options,
    headers:{ ...(body === undefined ? {} : {'Content-Type':'application/json'}), ...headers },
    ...(body === undefined ? {} : {body:JSON.stringify(body)}) });
  if (res.status === 204) return null;
  const json = await res.json().catch(() => null);
  if (!res.ok) throw Object.assign(new Error(json?.error?.message || 'Errore richiesta'), {status:res.status, code:json?.error?.code});
  return json;
}
```
`src/mocks/browser.js`: `export const worker = setupWorker(...handlers)` importando setupWorker da msw/browser e handlers dal file locale. Handler esempio:
```js
import { http, HttpResponse, delay } from 'msw';
export const handlers = [http.get('/api/v1/exercises', async () => {
  await delay(250);
  return HttpResponse.json({data:[],meta:{total:0,limit:20,offset:0}});
})];
```
In main.jsx, prima di createRoot, se mode mock fare `await (await import('./mocks/browser.js')).worker.start({onUnhandledRequest:'bypass'})` dentro funzione async bootstrap. Ampliare handler per endpoint BE-007, inclusi errori con envelope standard. Verifica: Network mostra GET e JSON; test handler 401/500.

### FE-015 — Creare repository mock persistente in IndexedDB (`npm install idb`) o localStorage per piccoli dati non sensibili; reset demo. Non salvare password reali: login demo esplicitamente fittizio e registrazione simulata.

```bash
npm install idb
```
`src/mocks/db.js`:
```js
import { openDB } from 'idb';
export const db = openDB('gymplan-demo',1,{upgrade(d){
  d.createObjectStore('records');
}});
export async function get(key, fallback=null){ return (await (await db).get('records',key)) ?? fallback; }
export async function put(key,value){ await (await db).put('records',value,key); }
export async function reset(){ await (await db).clear('records'); }
```
Chiavi `demo:accounts`, `demo:currentUser`, `demo:<userId>:workouts`, profilo/sessioni. Login mock riconosce email registrata e password demo fissa dichiarata, non conserva password digitate. UUID via crypto.randomUUID in contesto sicuro. Verifica: refresh conserva scheda, reset elimina solo demo.

### FE-016 — Implementare form registrazione, login, logout, validazione, loading ed errori; AuthContext, route protette, ripristino sessione demo; recupero password come placeholder dichiarato.

Creare servizi auth `register(body)=>api('/auth/register',{method:'POST',body})`, login analogo, `me()=>api('/auth/me')`, logout POST. Handler mock: registrazione normalizza email, controlla duplicato, salva account senza password e utente corrente; login demo cerca account, controlla password fittizia; me restituisce 401 se assente; logout cancella sessione demo. AuthProvider mantiene `{user,loading}` e carica me al mount; login/register aggiornano user da `response.data`; logout azzera user. RequireAuth:
```jsx
function RequireAuth(){
  const {user,loading}=useAuth();
  if(loading) return <p>Caricamento...</p>;
  return user ? <Outlet/> : <Navigate to="/login" replace/>;
}
```
Form con label, required, email, password minima, conferma, pending e messaggio errore; non loggare input. Recupero password mostra “Non disponibile nella demo”. Verifica: login errato, refresh, logout, accesso diretto protetto.

### FE-017 — Onboarding: età, altezza, peso, obiettivo (massa/dimagrimento/definizione/tonificazione), esperienza, giorni, durata, luogo, attrezzatura; foto facoltativa rinviabile.

Creare Onboarding con useState per draft e step, input numerici convertiti solo a submit. Campi del DTO Profile (inclusi timezone da `Intl.DateTimeFormat().resolvedOptions().timeZone`, equipment array). Validare età/altezza/peso positivi, giorni 1–7, durata positiva, enum goal ed experience; non inviare stringhe vuote come numeri. PATCH `/profile` salva draft validato; handler calcola completed dai campi richiesti, non dal valore client. Verifica: step non valido non avanza; profilo completo aggiorna home.

### FE-018 — Homepage: stato profilo incompleto, CTA completamento, allenamento del giorno o empty state, lista schede, statistiche inizialmente derivate dai dati mock.

Home carica GET /profile, /workouts, /schedule e /sessions tramite servizi. Mostrare skeleton fino alla risposta, errore con retry. Se !profile.completed mostra Link /onboarding. Cercare schedule.date uguale a data locale dell'utente (non usare UTC slice per giorno locale). Se assente mostra CTA nuova scheda. Statistiche MVP: sessioni completed della settimana, somma activeSeconds/60. Verifica: nuovo utente vede empty state; dopo creazione scheda vede lista.

### FE-019 — Profilo modificabile; persistenza dopo refresh; test login, route guard, form e profilo.

Riutilizzare ProfileForm dell'onboarding con valori iniziali e PATCH; aggiornare il contesto o ricaricare profilo dopo successo. Test con Testing Library: compilare campi tramite getByLabelText e userEvent, click Salva, attendere findByText del successo. Test guard con MemoryRouter e utente assente; simulare refresh ricaricando GET /profile. Verifica: nuovo peso persiste e un altro account non lo vede.

**Accettazione:** utente demo si registra, accede, completa profilo, vede homepage, modifica profilo ed esce senza backend.

## Iterazione 2 — Schede allenamento (giorni 4–5)

### FE-020 — Definire modello Workout, Exercise, WorkoutExercise; enum goal `mass|weight_loss|definition|toning`, mode `reps|timed`; ID stabili e unità kg/secondi.

`src/features/workouts/model.js`:
```js
export const GOALS=['mass','weight_loss','definition','toning'];
export const MODES=['reps','timed'];
export function newExercise(exerciseId,mode='reps') {
 return {id:crypto.randomUUID(),exerciseId,position:0,mode,sets:3,
 ...(mode==='reps'?{reps:12,weightKg:0}:{durationSeconds:45}),
 restBetweenSetsSeconds:60,restAfterExerciseSeconds:90};
}
```
Workout contiene id,userId,name,goal,exercises,createdAt,updatedAt,version. Exercise contiene id,name,description,muscleGroups,equipment,difficulty,mediaUrl,defaultMode. In POST rimuovere id locali delle righe se il contratto non li ammette; il server assegna ID definitivi. Verifica: fixture conforme a BE-007.

### FE-021 — Popolare catalogo mock con almeno 12 esercizi, gruppi muscolari, attrezzatura, difficoltà, immagini con licenza compatibile o placeholder.

Fixture JSON condivisa con BE-020: 12 esercizi (squat, affondi, panca, push-up, rematore, lat machine, shoulder press, curl, triceps extension, plank, jumping jack, mountain climber). Generare una sola volta UUID stabili e committarli nel JSON; non generarli ad ogni GET. Aggiungere gruppi, attrezzatura, difficulty, defaultMode (plank/jumping jack/mountain climber timed). Immagini placeholder locali o media con licenza documentata. Verifica: 12 ID unici e filtri coerenti.

### FE-022 — Libreria esercizi con ricerca, filtri, dettaglio, loading, empty state ed errori.

Creare `listExercises(filters,signal)` che usa URLSearchParams e `api('/exercises?'+params,{signal})`. In pagina controllare input ricerca/filtri; effect con AbortController e cleanup, loading/error/empty. Handler filtra nome e array muscleGroups/equipment, ordina name/id e restituisce slice(offset,offset+limit) con total prima del taglio. GET /exercises/:id per dettaglio. Verifica: ricerca inesistente, filtro, errore, paginazione.

### FE-023 — Wizard scheda: obiettivo, nome, giorno facoltativo, selezione esercizi, configurazione, riepilogo.

Wizard con stato unico `{name:'',goal:'mass',exercises:[]}` e step 0–4; selezione goal → nome/giorno → catalogo → configurazione → riepilogo. Giorno è una pianificazione separata, non campo Workout: dopo POST scheda eventualmente POST schedule. Salvataggio solo finale; pulsante indietro mantiene draft. Verifica: tornare indietro senza perdere esercizi, non avanzare senza nome o almeno un esercizio.

### FE-024 — Configurazione individuale: serie, ripetizioni, kg, durata, recupero tra serie/esercizi; valori predefiniti per obiettivo modificabili. Reps richiede serie/ripetizioni; timed richiede serie/durata; validare numeri positivi, recupero anche zero, peso non negativo.

```js
export function validExercise(e){
 const int=(n,min)=>Number.isInteger(n)&&n>=min;
 return ['reps','timed'].includes(e.mode)&&int(e.sets,1)
 &&int(e.restBetweenSetsSeconds,0)&&int(e.restAfterExerciseSeconds,0)
 &&(e.weightKg==null||(Number.isFinite(e.weightKg)&&e.weightKg>=0))
 &&(e.mode==='reps'?int(e.reps,1):int(e.durationSeconds,1));
}
```
Default illustrativi e modificabili: mass 3×10, definition 3×12, toning 3×15, weight_loss timed 3×45s; non sono prescrizioni. Al cambio mode rimuovere il campo non pertinente. Configurare limiti condivisi con backend (es. sets 1–50, durata 1–3600). Verifica: zero ripetizioni e peso negativo rifiutati; recupero zero valido.

### FE-025 — Aggiungere, rimuovere, duplicare e riordinare esercizi; mostrare stima durata (assunzione esplicita per esercizi a ripetizioni).

```js
const reorder = (rows,from,to) => {
 const copy=[...rows]; const [item]=copy.splice(from,1); copy.splice(to,0,item);
 return copy.map((e,position)=>({...e,position}));
};
const estimate = rows => rows.reduce((sum,e,i)=>sum+e.sets*(e.mode==='timed'?e.durationSeconds:e.reps*3)+(e.sets-1)*e.restBetweenSetsSeconds+(i<rows.length-1?e.restAfterExerciseSeconds:0),0);
```
Duplicare con nuovo UUID, rimuovere per id, rinumerare position. Pulsanti Su/Giù accessibili. Mostrare “stima: 3 secondi per ripetizione”. Verifica: ordine e durata aggiornati.

### FE-026 — Lista schede con CRUD, duplicazione, conferma eliminazione, dettaglio e CTA inizia; persistenza mock e isolamento dati demo per account.

Servizi GET/POST /workouts, GET/PATCH/DELETE /workouts/:id, POST /workouts/:id/duplicate. Handler mock carica lista per user corrente, restituisce 401 se assente, 404 se id non posseduto; POST assegna id/version 1, PATCH controlla version e incrementa, DELETE 204, duplicate rigenera id di scheda e righe. UI lista/dettaglio con conferma cancellazione e Link alla sessione. Verifica: CRUD dopo refresh, conflitto version 409, account separati.

### FE-027 — Collegare dashboard e schede; test wizard, validazione, salvataggio e modifica.

Dopo save navigare a /workouts o sessione e ricaricare lista; dashboard usa la stessa API, non copia di stato. Test wizard con userEvent: scegliere goal, esercizio reps e timed, compilare, salvare, verificare POST e card. Test modifica e 400. Verifica: demo completa di scheda mista persistente.

**Accettazione:** creare e modificare una scheda mista con almeno un esercizio a ripetizioni e uno a tempo; ritrovarla dopo refresh.

## Iterazione 3 — Motore allenamento (giorni 6–8)

### FE-030 — Definire macchina a stati `idle → active → rest → active → completed`; `paused` conserva fase precedente; `abandoned` terminale. Un solo motore per tutti gli obiettivi.

Definire stato `{phase,previousPhase,workoutSnapshot,exerciseIndex,setIndex,results,startedAt,phaseStartedAt,deadline,remainingMs,revision}`. START da idle → active; FINISH_SET da active → rest o completed; REST_END → ready (sottostato di rest con CTA); START_NEXT → active; PAUSE da active/rest → paused; RESUME ripristina fase; ABANDON → abandoned. completed/abandoned terminali. Usare snapshot immutabile e indici serie 1-based. Verifica: disegnare diagramma e tabella eventi/stati, eventi non ammessi ignorati.

### FE-031 — Implementare reducer puro e hook `useWorkoutSession`: snapshot scheda, indice esercizio/serie, risultati, transizioni. Evitare doppio avanzamento al click e allo scadere timer.

`src/features/session/reducer.js` (nucleo di avanzamento, da comporre con timer e pausa FE-035):
```js
export function finishSet(s,event){
 if(s.phase!=='active'||event.revision!==s.revision) return s;
 const e=s.workoutSnapshot.exercises[s.exerciseIndex];
 const lastSet=s.setIndex===e.sets;
 const lastExercise=s.exerciseIndex===s.workoutSnapshot.exercises.length-1;
 const results=[...s.results,{...event.result,workoutExerciseId:e.id,setIndex:s.setIndex}];
 const base={...s,results,revision:s.revision+1};
 if(lastSet&&lastExercise) return {...base,phase:'completed',endedAt:event.now};
 const rest=lastSet?e.restAfterExerciseSeconds:e.restBetweenSetsSeconds;
 return {...base,exerciseIndex:s.exerciseIndex+(lastSet?1:0),setIndex:lastSet?1:s.setIndex+1,
 phase:'rest',ready:rest===0,deadline:event.now+rest*1000,phaseStartedAt:event.now};
}
```
Hook `useReducer` inizializza snapshot con structuredClone; ogni evento contiene now e revision catturata dalla schermata. Per rest zero mostrare direttamente CTA di avvio senza countdown. Aggiungere START/PAUSE/RESUME/ABANDON con stessa regola di revision e accumulo tempi. Non fare IO nel reducer. Verifica: due FINISH_SET con stessa revision producono un solo risultato.

### FE-032 — Modalità reps: GIF/foto, carico, serie corrente/totale, ripetizioni, cronometro crescente, modifica carico/ripetizioni effettive, pulsante serie terminata.

Componente RepsExercise riceve stato e callback. Derivare esercizio da snapshot e indice; mostrare media, kg, setIndex/sets, reps previste e timer crescente. Input controllati actualReps e actualWeightKg inizializzati per ogni revision di nuova serie; validare e dispatch FINISH_SET con elapsedSeconds e status completed. Non aggiornare il carico della scheda automaticamente. Verifica: 3 serie da 12 con ultima da 10 registrano 34 ripetizioni.

### FE-033 — Modalità timed: countdown, round/serie, pausa/riprendi, prossimo esercizio (con conferma se salta serie), completamento alla scadenza.

TimedExercise usa deadline e tempo residuo calcolato in FE-035. Quando arriva a zero dispatch FINISH_SET con revision corrente e elapsedSeconds limitato alla durata. Pulsante “Prossimo esercizio” chiede conferma e registra le serie non eseguite come skipped (non completed), avanzando con un evento atomico dedicato. Pausa e ripresa usano reducer condiviso. Verifica: countdown termina una sola volta e salto non aumenta le serie completate.

### FE-034 — Recupero: countdown, anteprima prossima serie/esercizio, +/-15s, pausa, salta; recupero zero salta fase; nessun recupero dopo ultimo esercizio. Alla fine del recupero mostrare CTA per iniziare.

RestScreen usa la destinazione già calcolata dal reducer, mostra nome, media, peso, serie. Pulsanti +/-15s modificano deadline con minimo now, senza alterare tempo già trascorso; se in pausa modificano remainingMs. REST_END/SKIP_REST impostano ready e fermano conteggio recupero; START_NEXT avvia serie. Nessuna schermata rest dopo ultimo set. Verifica: zero, salto, estensione e ultima serie.

### FE-035 — Timer basato su timestamp di scadenza/inizio, non semplice decremento di setInterval; ricalcolo al visibilitychange; pausa congela tempo; cleanup interval; test con fake timers.

```js
export const secondsLeft=(deadline,now)=>Math.max(0,Math.ceil((deadline-now)/1000));
export const elapsed=(start,now)=>Math.max(0,Math.floor((now-start)/1000));
```
In hook mantenere now con setInterval da 200 ms; al visibilitychange aggiornare Date.now(); cleanup listener e interval. Su PAUSE salvare deadline-now oppure elapsed accumulato; RESUME imposta nuova deadline o nuovo start, sommando tempo precedente. Accumulare millisecondi per fase, convertire in secondi al riepilogo. Allo zero inviare evento con revision; non eseguire automaticamente l'intero allenamento mentre app chiusa. Test con vi.useFakeTimers e vi.setSystemTime: 45s meno 10s, pausa 20s, ripresa 35s. Verifica: timer non perde tempo quando tab inattiva.

### FE-036 — Salvare sessione attiva a ogni transizione in IndexedDB; ripristino refresh/chiusura; una sessione attiva per account; conferma abbandono; gestire tab multipli almeno con avviso.

Store IndexedDB separato per sessioni attive, chiave userId e valore snapshot/stato/revision. Persistenza tramite effect serializzato per evitare scritture fuori ordine; non salvare ogni tick, solo transizioni e modifiche. Al login leggere sessione e offrire Riprendi/Abbandona. BroadcastChannel('gymplan-session') segnala altra scheda con stesso userId; bloccare avvio duplicato o mostrare avviso, non promettere lock distribuito. Verifica: refresh durante pausa e recupero conserva fase e tempi; abbandono richiede conferma.

### FE-037 — Riepilogo sessione: durata, serie, ripetizioni, volume kg×ripetizioni, tempo attivo/recupero, note; salvataggio idempotente per ID sessione; distinguere completata e interrotta.

```js
export function summarize(results){
 const done=results.filter(r=>r.status==='completed');
 return {sets:done.length,reps:done.reduce((n,r)=>n+(r.actualReps??0),0),volumeKg:done.reduce((n,r)=>n+(r.actualReps??0)*(r.actualWeightKg??0),0)};
}
```
POST /sessions con UUID creato all'avvio, workoutSnapshot, startedAt/endedAt ISO, status, results, active/rest/pausedSeconds, notes. Conservare payload immutabile per retry; eliminare sessione attiva soltanto dopo salvataggio locale durevole o risposta server. Handler mock confronta payload normalizzato per stesso id (200 identico, 409 differente). Verifica: doppio click Salva produce un solo storico.

### FE-038 — Test transizioni, ultima serie, pausa, recupero zero, refresh e doppio click; demo su smartphone.

Test reducer con Vitest: start, FINISH_SET, duplicate revision, REST_END, START_NEXT, ultimo set completed, PAUSE/RESUME, ABANDON e recupero zero. Test hook con fake timers e mock IndexedDB o browser reale. Test E2E manuale smartphone: scheda con reps 2×12 e timed 1×5s, refresh in recupero, completa, verifica storico. Registrare esito per ogni caso in PR.

**Accettazione MVP:** registrazione demo → profilo → scheda → allenamento misto → recupero → riepilogo persistente, senza backend.

## Iterazione 4 — Storico, calendario e PWA (giorni 9–10 o estensione)

### FE-040 — Storico sessioni con dettaglio e filtri; statistiche da sessioni salvate, empty state; peso corporeo e grafici avanzati in estensione.

GET /sessions con limit/offset e status/date; mostrare cards e dettaglio tramite GET /sessions/:id. Aggregare solo completed per statistiche principali e mostrare abandoned separatamente. Filtri periodo con date esplicite, zero dati = messaggio e valori zero. Verifica: somma volume coerente con FE-037; sessione interrotta non conta come completata.

### FE-041 — Calendario settimanale con pianificazione schede e indicazione completati; evitare duplicati involontari.

Calendario 7 giorni dalla settimana locale; usare date YYYY-MM-DD e timezone IANA, non toISOString().slice(0,10) per data locale. POST /schedule `{workoutId,date,time,timezone}`, PATCH/DELETE per modifica. Impedire duplicato identico lato mock e server; visualizzare allenamento svolto separatamente dal pianificato. Verifica: pianificazione dopo refresh e nessun duplicato al doppio click.

### FE-042 — `npm install -D vite-plugin-pwa`; manifest nome, icone 192/512 e maskable, start_url, standalone, tema; HTTPS in deploy.

```bash
npm install -D vite-plugin-pwa
```
In vite.config.js importare VitePWA e aggiungere ai plugins soltanto nella modalità PWA/real (vedi FE-043):
```js
VitePWA({registerType:'prompt',manifest:{name:'GymPlan',short_name:'GymPlan',start_url:'/',display:'standalone',theme_color:'#101114',background_color:'#101114',icons:[{src:'/icon-192.png',sizes:'192x192',type:'image/png'},{src:'/icon-512.png',sizes:'512x512',type:'image/png'},{src:'/icon-maskable.png',sizes:'512x512',type:'image/png',purpose:'maskable'}]}})
```
Creare davvero le tre icone in public. Verifica: manifest valido in DevTools, HTTPS o localhost.

### FE-043 — Configurare service worker per app shell e risorse pubbliche; non cache indiscriminata di API private. MSW e PWA usano service worker: separare scope/configurazione o disattivare SW PWA nella demo MSW; test PWA con backend reale o adapter locale senza MSW.

Usare loadEnv di Vite nella funzione defineConfig per disabilitare plugin PWA quando VITE_API_MODE=mock; MSW e PWA non devono contendersi lo stesso scope. Per demo offline PWA senza backend aggiungere modalità local in apiClient che chiama lo stesso repository mock direttamente, senza MSW; alternativa testare real con backend. Cache app shell, CSS/JS e immagini pubbliche autorizzate; escludere `/api/` da fallback navigazione e runtime caching privato. Verifica: un solo service worker attivo per scope; disregistrare vecchio worker quando si cambia modalità.

### FE-044 — Accesso offline a schede già scaricate, sessioni persistenti, indicatore offline, coda operazioni con ID univoco e retry; non promettere timer/notifiche affidabili a schermo bloccato.

Cache dati per account in IndexedDB, solo schede già caricate. `navigator.onLine` e eventi online/offline sono indizi: gestire anche errori fetch. Coda sessioni `{id,userId,payload,attempts,nextRetryAt}`; flush seriale al reconnect e avvio, exponential backoff su rete/5xx, 401 richiede login, 409 richiede intervento, 400 non riprovare automaticamente. Salvare prima localmente; retry con stesso ID. Verifica: DevTools Offline, avvio scheda, refresh, completamento, ritorno online e una sola sessione.

### FE-045 — Installabilità Android/iOS dove supportata, safe area, touch target, contrasto, accessibilità tastiera; test build e preview.

CSS safe area `padding-bottom: env(safe-area-inset-bottom)` e viewport-fit=cover. Controllare focus, label, contrasto, tap target >=44px. `npm run build && npm run preview`; installare da browser compatibile (iOS menu condivisione → Aggiungi a schermata Home). Non garantire timer in background o notifiche su tutti i device. Verifica: test Android/iOS disponibili, desktop e modalità standalone.

**Accettazione:** avvio sessione già disponibile senza rete, refresh con ripristino, storico locale e app installabile in ambiente compatibile.

## Iterazione 5 — Integrazione backend reale (dopo MVP)

### FE-050 — Allineare DTO e OpenAPI con backend; test contrattuali; modalità real via env senza handler MSW; fetch con credentials, errori standard e abort controller.

Confrontare ogni servizio con docs/openapi.yaml, fixture ed envelope. `.env.local`: VITE_API_MODE=real, VITE_API_BASE_URL=/api/v1; Vite proxy verso localhost:3000 durante dev, reverse proxy stessa origin in produzione. Non avviare MSW. apiClient FE-014 usa credentials e supporta signal; gestire 204, 401, 409, 429. Aggiungere header CSRF secondo BE-013. Verifica: stessa UI con mock e real, test contratto su fixture.

### FE-051 — Sostituire auth demo con cookie HttpOnly server, gestione scadenza/401, logout e recupero password; non memorizzare token in localStorage.

Sostituire handler con endpoint reali senza cambiare AuthProvider; server invia cookie HttpOnly. GET /auth/me ripristina sessione, 401 azzera utente e porta a login, ma errore rete non equivale a logout. Form forgot/reset con messaggi generici; token reset non loggato, rimuovere da URL dopo acquisizione. Invocare logout server e pulire dati account dopo successo. Verifica: cookie non leggibile da JS, scadenza e logout.

### FE-052 — Integrare profilo, catalogo, CRUD schede, sessioni, storico, calendario in ordine di disponibilità backend.

Integrare in ordine profile → exercises → workouts → sessions → schedule → stats. Per ciascun endpoint: confrontare DTO, chiamare con account di test, gestire loading/empty/error, verificare dati persistenti riavviando server. Non usare fallback mock silenzioso in real. Verifica: scheda creata da dispositivo A letta da B.

### FE-053 — Separare dati per utente, pulire cache privata al logout, migrare dati demo solo con consenso o tenerli separati; sync sessioni idempotenti e gestione conflitti 409.

Namespace cache e queue con userId e ambiente; mai sincronizzare payload di altro account. Logout pulisce cache privata e gestisce esplicitamente sessioni offline non sincronizzate (avviso prima di eliminazione). Demo separata, import solo esplicito e validato. PATCH version 409 mostra ricarica/confronta, non sovrascrivere. Verifica: account A/B separati, retry idempotente e conflitto visibile.

### FE-054 — Test E2E percorso completo, errori rete, offline/online, accessibilità, responsive, build produzione; deploy statico con fallback SPA e API HTTPS.

Installare Playwright se serve: `npm install -D @playwright/test`, `npx playwright install`. E2E: register→profile→workout→session→history→logout; secondo utente, rete assente, 401, 409. Configurare hosting statico con fallback SPA per rotte frontend, ma non per /api; HTTPS e reverse proxy API. `npm ci`, lint, test, build. Verifica: URL diretto /workouts dopo refresh, test mobile e desktop, nessun segreto nel bundle.

**Accettazione:** dati persistono sul server e sono accessibili da un altro dispositivo; mock resta disponibile per sviluppo e test.

## Definition of Done comune

- Issue collegata alla PR, responsabile e criteri verificati.
- Lint, test pertinenti e build (frontend) o migrazioni (backend) verificati.
- Review di un collega, documentazione aggiornata e nessun segreto.
- Demo ripetibile; problemi non risolti riportati nella issue, non marcati Done.
