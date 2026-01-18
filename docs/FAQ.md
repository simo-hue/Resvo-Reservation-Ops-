# ❓ Domande Frequenti (FAQ) & Q&A

Benvenuto nella sezione FAQ di **Resvo**. Qui abbiamo raccolto le risposte alle domande più comuni per aiutarti a sfruttare al massimo il potenziale del nostro gestionale.

---

## 📑 Indice

1.  [Generale](#generale)
2.  [Gestione Prenotazioni](#gestione-prenotazioni)
3.  [Gestione Sala e Tavoli](#gestione-sala-e-tavoli)
4.  [Statistiche e Report](#statistiche-e-report)
5.  [Aspetti Tecnici e Installazione](#aspetti-tecnici-e-installazione)
6.  [Privacy e Sicurezza](#privacy-e-sicurezza)

---

## <a name="generale"></a> 1. Generale

### **1. Cos'è esattamente Resvo?**
Resvo è un sistema di gestione delle prenotazioni (Reservation Operations) open-source progettato specificamente per ristoranti che necessitano di un controllo granulare sui propri servizi, tavoli e flussi di clienti. Non è un semplice calendario, ma una suite completa per ottimizzare l'occupazione della sala.

### **2. Resvo è gratuito?**
Sì e no. Il codice sorgente è open-source e disponibile gratuitamente. Puoi scaricarlo, installarlo sul tuo server e usarlo senza pagare licenze software. Tuttavia, se decidi di usare servizi cloud come Supabase (per il database) o Vercel (per l'hosting) oltre i loro piani gratuiti, potresti incorrere nei costi di quei fornitori.

### **3. Posso usare Resvo su tablet o smartphone?**
Assolutamente sì. Resvo è stato progettato con un approccio "Mobile First". L'interfaccia si adatta perfettamente a iPad, tablet Android e smartphone, permettendo ai camerieri e ai manager di gestire la sala in movimento.

### **4. È necessaria una connessione internet per utilizzare Resvo?**
Sì, Resvo è un'applicazione web basata su cloud. Questo garantisce che i dati siano sempre sincronizzati tra tutti i dispositivi in tempo reale. Se la connessione cade, non potrai salvare nuove prenotazioni fino al ripristino della rete.

### **5. Posso personalizzare il logo e i colori per il mio ristorante?**
Essendo open-source, hai il controllo totale sul codice. Puoi modificare i colori, il logo e qualsiasi altro aspetto visivo modificando i file di configurazione del tema (es. `tailwind.config.ts` o `globals.css`).

### **6. Quanti utenti possono accedere contemporaneamente?**
Non c'è un limite imposto dal software. Puoi avere il manager in ufficio, l'hostess all'ingresso e i camerieri in sala collegati contemporaneamente. Grazie alla tecnologia "real-time" di Supabase, tutti vedranno gli aggiornamenti istantaneamente.

---

## <a name="gestione-prenotazioni"></a> 2. Gestione Prenotazioni

### **7. Come inserisco una nuova prenotazione?**
Puoi inserire una prenotazione cliccando sul pulsante "+" (FAB) presente in ogni schermata, oppure cliccando direttamente su un orario libero nella vista "Day View" del calendario.

### **8. Posso gestire le richieste speciali dei clienti (es. allergie, seggioloni)?**
Sì, il modulo di prenotazione include un campo note dedicato per allergie, richieste di seggioloni, preferenze per il tavolo o occasioni speciali come compleanni.

### **9. Cosa succede se un cliente non si presenta (No-Show)?**
Puoi marcare la prenotazione come "No-Show". Questo non la cancella dallo storico, ma aggiorna lo stato e ti permette di tenere traccia dei clienti inaffidabili nelle statistiche future.

### **10. Esiste una lista d'attesa?**
Attualmente, puoi inserire prenotazioni con stato "In Attesa" per tenerle in sospeso. Stiamo lavorando a una funzionalità di Lista d'Attesa automatizzata per le versioni future.

### **11. Posso modificare l'orario di una prenotazione già confermata?**
Certamente. Basta aprire i dettagli della prenotazione e modificare l'orario. Il sistema verificherà automaticamente se c'è disponibilità per il nuovo orario e ti avviserà in caso di conflitti (overbooking).

### **12. Il sistema invia email o SMS di conferma ai clienti?**
Di base, il sistema registra la prenotazione. L'integrazione per l'invio automatico di email (es. tramite Resend o SendGrid) o SMS (es. Twilio) può essere configurata estendendo le funzionalità backend, ma non è attiva di default per evitare costi nascosti.

### **13. Posso accettare prenotazioni online dal mio sito web?**
Resvo è principalmente il gestionale interno (lato staff). Tuttavia, puoi facilmente creare un widget pubblico che si collega alle stesse API di Resvo per permettere ai clienti di prenotare dal sito. È una funzionalità prevista nella roadmap.

---

## <a name="gestione-sala-e-tavoli"></a> 3. Gestione Sala e Tavoli

### **14. Posso configurare diverse sale (es. Giardino, Sala Interna)?**
Sì, la sezione "Configurazione Spazi" ti permette di creare aree distinte. Ogni tavolo può essere assegnato a una specifica area per una gestione visiva più chiara.

### **15. Come faccio a unire due tavoli per una grande tavolata?**
Nella gestione sala, puoi creare un "Tavolo Temporaneo" o assegnare una prenotazione a più tavoli. Il sistema calcolerà la capacità totale combinata.

### **16. Il sistema mi avvisa se sto assegnando un tavolo troppo piccolo?**
Sì, se provi ad assegnare una prenotazione di 6 persone a un tavolo da 4, il sistema mostrerà un avviso di capacità insufficiente, anche se ti permetterà di forzare l'azione se necessario (es. aggiungendo una sedia).

### **17. Posso bloccare un tavolo specifico per un VIP?**
Sì, puoi creare una prenotazione fittizia o uno stato "Bloccato" per un tavolo specifico per assicurarti che non venga assegnato automaticamente ad altri.

### **18. Come visualizzo quali tavoli sono liberi in questo momento?**
La vista "Table Map" o la Dashboard mostrano in tempo reale lo stato di tutti i tavoli: Verde (Libero), Rosso (Occupato/Seduto), Giallo (Prenotato/In Arrivo).

---

## <a name="statistiche-e-report"></a> 4. Statistiche e Report

### **19. Quali dati posso analizzare con Resvo?**
Puoi monitorare:
*   Numero totale di coperti (giornalieri, settimanali, mensili).
*   Fatturato medio stimato (se configuri lo scontrino medio).
*   Tasso di occupazione per fascia oraria.
*   Confronto tra servizi Pranzo vs Cena.

### **20. Posso esportare i dati in Excel o PDF?**
Attualmente i dati sono visualizzabili tramite grafici interattivi nella dashboard. L'esportazione in CSV/Excel è una funzionalità in fase di sviluppo che verrà rilasciata a breve.

### **21. Il sistema calcola il "RevPASH" (Revenue Per Available Seat Hour)?**
Al momento calcoliamo il tasso di occupazione semplice. Il calcolo del RevPASH richiede l'integrazione con il sistema di cassa (POS) per avere i dati reali di fatturato, che è una personalizzazione avanzata.

### **22. Posso vedere lo storico di un cliente specifico?**
Sì, cercando un cliente per nome o numero di telefono, puoi vedere tutte le sue prenotazioni passate, inclusi i No-Show e le note sulle preferenze.

---

## <a name="aspetti-tecnici-e-installazione"></a> 5. Aspetti Tecnici e Installazione

### **23. Quali sono i requisiti del server per ospitare Resvo?**
Resvo è molto leggero. Può girare su un qualsiasi server Node.js (anche un piano base di DigitalOcean o Hetzner da 5€/mese) o essere ospitato gratuitamente su Vercel (per progetti hobby/piccoli).

### **24. Di quali competenze ho bisogno per installarlo?**
È richiesta una conoscenza base di terminale, git e npm. Se segui la nostra [Guida all'Installazione](INSTALLATION_IT.md), dovresti essere in grado di farlo anche senza essere un programmatore esperto.

### **25. Come faccio il backup dei dati?**
I dati risiedono su Supabase. Supabase offre backup automatici giornalieri nei piani Pro. Nel piano gratuito, dovresti eseguire manualmente un dump del database periodico tramite i loro strumenti CLI.

### **26. Come aggiorno Resvo all'ultima versione?**
Basta entrare nella cartella del progetto, lanciare `git pull` per scaricare le ultime modifiche e poi `npm install` e `npm run build` per aggiornare le dipendenze e ricostruire l'app.

### **27. Posso collegare Resvo al mio software di cassa (POS)?**
Resvo ha un'architettura API-first. Se il tuo POS ha delle API aperte, è possibile sviluppare un "connettore" per sincronizzare i dati. Tuttavia, non ci sono integrazioni native "plug-and-play" al momento.

### **28. Supporta l'autenticazione a due fattori (2FA)?**
Supabase supporta l'autenticazione MFA (Multi-Factor Authentication). Puoi abilitarla nel pannello di controllo di Supabase per aumentare la sicurezza degli account staff.

---

## <a name="privacy-e-sicurezza"></a> 6. Privacy e Sicurezza

### **29. I dati dei miei clienti sono al sicuro?**
Sì. Usiamo protocolli di sicurezza standard (HTTPS, RLS di PostgreSQL). I dati sono tuoi e risiedono sul tuo database Supabase, non su server di terze parti sconosciuti.

### **30. Resvo è conforme al GDPR?**
Poiché sei tu a ospitare l'applicazione e il database, sei tu il "Titolare del Trattamento". Resvo ti fornisce gli strumenti per essere conforme (es. possibilità di cancellare i dati cliente), ma la conformità legale dipende da come gestisci e proteggi l'accesso ai dati.

### **31. Chi può vedere i miei dati?**
Solo gli utenti che autorizzi nel sistema. Grazie alle Row Level Security (RLS) di Supabase, possiamo garantire che anche in caso di bug applicativi, i dati siano protetti a livello di database.

### **32. C'è un log delle attività (Audit Log)?**
Attualmente il sistema traccia chi ha creato o modificato una prenotazione (campi `created_by`, `updated_by`). Un log di audit completo e immutabile per ogni singola azione è previsto per le versioni Enterprise.

---

### Hai altre domande?

Se non hai trovato la risposta che cercavi, sentiti libero di:
1.  Aprire una **Issue** su GitHub.
2.  Contattarci direttamente tramite i canali di supporto della community.
3.  Consultare la documentazione tecnica nel codice.

*Buon lavoro con Resvo!*
