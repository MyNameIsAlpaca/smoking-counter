# Smoking Counter con Angular e Supabase

Applicazione Angular per creare, consultare, modificare ed eliminare le smoking archiviate nella tabella `smoking` di Supabase.

## 📋 Struttura del progetto

```
smoking-counter/
├─ package.json
├─ angular.json
├─ tsconfig.json
├─ tsconfig.app.json
├─ src/
│ ├─ index.html
│ ├─ main.ts
│ ├─ styles.css
│ └─ app/
│ ├─ app.module.ts
│ ├─ app.component.ts
│ ├─ app.component.html
│ ├─ services/
│ │ └─ supabase.service.ts
│ ├─ models/
│ │ └─ smoking.ts
│ └─ items/
│ ├─ item-list.component.ts
│ ├─ item-list.component.html
│ ├─ item-form.component.ts
│ └─ item-form.component.html
└─ README.md
```

## 🚀 Come avviare l'applicazione

### Prerequisiti

- Node.js (versione 18 o successiva)
- npm o yarn

### Installazione

1. Installa le dipendenze:
```bash
npm install
```

### Configurazione di Supabase

La tabella `smoking` deve essere presente nel progetto Supabase. Se non l'hai già creata, apri l'editor SQL della dashboard ed esegui `supabase-setup.sql`.

La policy inclusa nello script permette tutte le operazioni ed è adatta solo a sviluppo e test: in produzione va sostituita con policy che limitino l'accesso.

### Accesso

L'applicazione consente l'accesso solo agli utenti creati manualmente nel pannello Supabase; non è prevista la registrazione pubblica. L'URL del progetto e la Publishable Key sono configurati in `src/environments/environment.ts` e `src/environments/environment.prod.ts`. Supabase gestisce la persistenza della sessione tramite il client ufficiale.

La route `/login` è pubblica. Dopo l'accesso, `/home` presenta le sezioni **Censimento** e **Consultazione**. `/censimento` consente di inserire una registrazione, `/censimento/:id` di modificarla e `/consultazione` mostra le registrazioni raggruppate in pannelli apribili per giorno. Tutte le sezioni sono protette da autenticazione. La route `/` e gli URL non riconosciuti reindirizzano in base alla sessione.

### Avvio dell'applicazione

```bash
npm start
```

L'applicazione sarà disponibile all'indirizzo `http://localhost:4200`.

## 🎯 Funzionalità

- ✅ **Create**: crea smoking
- ✅ **Read**: elenca le smoking
- ✅ **Update**: modifica le smoking esistenti
- ✅ **Delete**: elimina le smoking

## 🛠️ Tecnologie utilizzate

- Angular 17
- Supabase (JavaScript Client)
- TypeScript
- RxJS
- Angular Forms (Reactive Forms)

## 📝 Modello dei dati

Il modello `Smoking` corrisponde alle colonne della tabella `smoking`:

- `id`: identificatore univoco generato dal database
- `data_inserimento`: data e ora obbligatorie
- `data_chiusura`: data e ora facoltative
- `tiri`: numero intero non negativo
- `luogo`: testo obbligatorio (massimo 255 caratteri)

Nel modulo la data e l'orario sono inseriti separatamente e salvati insieme in `data_inserimento`. Il campo `data_chiusura` resta facoltativo e non viene modificato dal modulo.

Il censimento mostra i tiri già salvati per la data selezionata; la consultazione mostra il totale per ogni giorno. Il riepilogo è verde fino a 75 tiri, giallo da 76 a 85 e rosso oltre 85. Il riferimento visualizzato è 80 tiri.

## 🔧 Configurazione

Il servizio usa il client JavaScript di Supabase. Configura l'URL del progetto e la chiave anon del client con i valori del tuo progetto.

## 📦 Script disponibili

- `npm start`: avvia il server di sviluppo
- `npm run build`: compila l'applicazione per la produzione
- `npm test`: esegue i test

## 🎨 Interfaccia

L'applicazione offre un'interfaccia con:
- Design moderno con sfumature
- Schede con ombre leggere
- Animazioni al passaggio del puntatore sui pulsanti
- Messaggi di errore e di conferma
- Convalida dei campi richiesti e dei relativi limiti

## 📄 Licenza

Questo progetto è destinato esclusivamente a scopi didattici.
