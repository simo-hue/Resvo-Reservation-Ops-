# 🚀 Guida all'Installazione

Benvenuto nella guida ufficiale per l'installazione di **Resvo**. Questa documentazione dettagliata ti accompagnerà passo dopo passo nella configurazione del sistema di gestione prenotazioni più avanzato per ristoranti. Che tu sia uno sviluppatore o un ristoratore che desidera il pieno controllo sui propri strumenti, sei nel posto giusto.

## 📋 Prerequisiti

Prima di iniziare, assicurati di avere i seguenti strumenti installati sul tuo computer:

1.  **Node.js**: È richiesta la versione 18.0.0 o superiore. [Scarica Node.js](https://nodejs.org/)
2.  **npm**: Solitamente installato automaticamente con Node.js.
3.  **Git**: Necessario per clonare il repository. [Scarica Git](https://git-scm.com/)
4.  **Un Account Supabase**: Utilizziamo Supabase come backend per database e autenticazione. [Registrati gratis](https://supabase.com/)

---

## 🛠️ Installazione Passo-Passo

### 1. Clona il Repository

Il primo passo è scaricare il codice sorgente sul tuo computer. Apri il terminale e digita:

```bash
git clone https://github.com/tuo-username/resvo-reservation-ops.git
cd resvo-reservation-ops
```

### 2. Installa le Dipendenze

Ora dobbiamo installare tutte le librerie necessarie per far funzionare l'applicazione. Consigliamo di usare `npm`:

```bash
npm install
```

Questo processo potrebbe richiedere qualche minuto. Il sistema sta scaricando Next.js, React e tutti gli strumenti necessari per offrirti un'esperienza fluida e potente.

### 3. Configurazione dell'Ambiente

Per collegarsi al database, l'applicazione ha bisogno di alcune "chiavi" segrete.

1.  Crea un file chiamato `.env.local` nella cartella principale del progetto.
2.  Apri questo file con un editor di testo e inserisci le tue credenziali Supabase:

    ```env
    NEXT_PUBLIC_SUPABASE_URL=la_tua_url_supabase
    NEXT_PUBLIC_SUPABASE_ANON_KEY=la_tua_chiave_anon_supabase
    ```

    Troverai questi dati nella Dashboard di Supabase sotto **Settings > API**.

### 4. Configurazione del Database

Resvo si basa su una struttura dati solida e sicura. Abbiamo preparato degli script SQL per configurare tutto automaticamente.

1.  Accedi alla Dashboard di Supabase e apri l'**SQL Editor**.
2.  Nella cartella `database` di questo progetto, troverai dei file numerati.
3.  Copia e incolla il contenuto di questi file nell'editor SQL di Supabase ed eseguili in questo ordine esatto:

    *   `01_schema.sql`: Crea le tabelle per prenotazioni, tavoli, ecc.
    *   `02_rls_policies.sql`: Imposta le regole di sicurezza per proteggere i dati.
    *   `03_triggers_functions.sql`: Aggiunge automazioni intelligenti.
    *   `04_seed_data.sql` (Opzionale): Inserisce dei dati di prova per iniziare subito a testare.

**Nota:** Per dettagli tecnici sulla struttura del database, consulta il file `database/README.md`.

### 5. Avvia l'Applicazione

È il momento della verità! Avvia il server di sviluppo con il comando:

```bash
npm run dev
```

Apri il tuo browser preferito e vai su [http://localhost:3000](http://localhost:3000).

🎉 **Congratulazioni!** Dovresti vedere la schermata di login di Resvo. Sei pronto a gestire il tuo ristorante come un pro.

---

## 🔧 Preparazione per la Produzione

Se desideri utilizzare Resvo nel tuo ristorante reale, ti consigliamo di creare una versione "build" ottimizzata per le massime prestazioni:

```bash
npm run build
npm start
```

Questo assicurerà che l'app sia velocissima anche durante i servizi più frenetici.

## 🆘 Risoluzione Problemi

*   **Errore di connessione al database**: Controlla il file `.env.local`. Verifica che non ci siano spazi extra e che le chiavi siano corrette.
*   **Problemi di Login**: Assicurati di aver abilitato il "Provider Email" nelle impostazioni di Autenticazione di Supabase.

Hai bisogno di aiuto? Apri una "issue" su GitHub e saremo felici di assisterti!
